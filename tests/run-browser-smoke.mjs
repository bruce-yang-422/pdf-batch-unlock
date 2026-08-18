import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const chromePath = process.env.CHROME_PATH
  ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9333;
const profile = await mkdtemp(join(tmpdir(), 'pdf-unlocker-smoke-'));
const vite = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js',
  '--host',
  '127.0.0.1',
  '--port',
  '4173',
  '--strictPort',
], { stdio: 'ignore' });
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore' });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function retry(operation, attempts = 50) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      await delay(100);
    }
  }
  throw lastError;
}

try {
  await retry(async () => {
    const response = await fetch('http://127.0.0.1:4173/tests/browser-smoke.html');
    if (!response.ok) throw new Error('Vite test server is not ready');
  });

  await retry(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (!response.ok) throw new Error('Chrome DevTools endpoint is not ready');
  });

  const pageResponse = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent('http://127.0.0.1:4173/tests/browser-smoke.html')}`,
    { method: 'PUT' },
  );
  if (!pageResponse.ok) throw new Error(`Could not create test page: ${pageResponse.status}`);
  const page = await pageResponse.json();
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let commandId = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });

  function send(method, params = {}) {
    commandId += 1;
    socket.send(JSON.stringify({ id: commandId, method, params }));
    return new Promise((resolve, reject) => pending.set(commandId, { resolve, reject }));
  }

  const outcome = await retry(async () => {
    const response = await send('Runtime.evaluate', {
      expression: "document.querySelector('#result')?.textContent",
      returnByValue: true,
    });
    const text = response.result?.value ?? '';
    if (text.startsWith('FAIL:')) throw new Error(text);
    if (!text.startsWith('PASS:')) throw new Error(`Test is still running: ${text}`);
    return text;
  }, 150);

  console.log(outcome);
  socket.close();
} finally {
  chrome.kill();
  vite.kill();
  await Promise.race([
    new Promise((resolve) => chrome.once('exit', resolve)),
    delay(2_000),
  ]);
  try {
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (error) {
    console.warn(`Could not remove temporary Chrome profile: ${error.message}`);
  }
}
