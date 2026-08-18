import './style.css';
import { decryptPdf } from './core/decrypt.js';
import { getUserErrorMessage } from './core/errors.js';
import { formatSize } from './utils/format-size.js';
import { unlockedFilename } from './utils/filename.js';

const form = document.querySelector('#unlock-form');
const fileInput = document.querySelector('#pdf-file');
const dropZone = document.querySelector('#drop-zone');
const fileFeedback = document.querySelector('#file-feedback');
const queueSection = document.querySelector('#queue-section');
const fileList = document.querySelector('#file-list');
const clearFilesButton = document.querySelector('#clear-files');
const passwordInput = document.querySelector('#password');
const togglePasswordButton = document.querySelector('#toggle-password');
const unlockButton = document.querySelector('#unlock-button');
const status = document.querySelector('#status');
let queue = [];
let isProcessing = false;

const STATUS_LABELS = {
  waiting: '等待中',
  processing: '處理中…',
  success: '完成',
  failed: '失敗',
};

function setStatus(message, kind = '') {
  status.textContent = message;
  status.dataset.kind = kind;
}

function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function isPdf(file) {
  return file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
}

function fileKey(file) {
  return `${file.name}\u0000${file.size}\u0000${file.lastModified}`;
}

function renderQueue() {
  queueSection.hidden = queue.length === 0;
  fileFeedback.textContent = queue.length
    ? `已加入 ${queue.length} 個 PDF，總大小 ${formatSize(queue.reduce((sum, item) => sum + item.file.size, 0))}`
    : '尚未加入檔案';
  fileList.replaceChildren();

  for (const item of queue) {
    const row = document.createElement('li');
    row.className = 'file-row';
    row.dataset.status = item.status;

    const details = document.createElement('div');
    details.className = 'queued-file';
    const name = document.createElement('strong');
    name.textContent = item.file.name;
    const size = document.createElement('span');
    size.textContent = formatSize(item.file.size);
    details.append(name, size);

    const state = document.createElement('span');
    state.className = 'file-state';
    state.textContent = item.error ?? STATUS_LABELS[item.status];

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-file';
    removeButton.type = 'button';
    removeButton.textContent = '移除';
    removeButton.disabled = isProcessing;
    removeButton.setAttribute('aria-label', `移除 ${item.file.name}`);
    removeButton.addEventListener('click', () => {
      queue = queue.filter((queuedItem) => queuedItem.id !== item.id);
      renderQueue();
    });

    row.append(details, state, removeButton);
    fileList.append(row);
  }
}

function addFiles(fileCollection) {
  if (isProcessing) return;
  const files = [...fileCollection];
  const pdfs = files.filter(isPdf);
  const existing = new Set(queue.map((item) => fileKey(item.file)));
  const additions = pdfs.filter((file) => !existing.has(fileKey(file)));

  queue.push(...additions.map((file) => ({
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    file,
    status: 'waiting',
    error: null,
  })));

  const rejected = files.length - pdfs.length;
  const duplicates = pdfs.length - additions.length;
  if (rejected) setStatus(`已略過 ${rejected} 個非 PDF 檔案。`, 'error');
  else if (duplicates) setStatus(`已略過 ${duplicates} 個重複檔案。`);
  else setStatus('準備就緒');
  renderQueue();
}

fileInput.addEventListener('change', () => {
  addFiles(fileInput.files ?? []);
  fileInput.value = '';
});

dropZone.addEventListener('click', (event) => {
  if (event.target !== fileInput) fileInput.click();
});
dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fileInput.click();
  }
});

for (const eventName of ['dragenter', 'dragover']) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (!isProcessing) dropZone.classList.add('is-dragging');
  });
}

for (const eventName of ['dragleave', 'drop']) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
  });
}

dropZone.addEventListener('drop', (event) => addFiles(event.dataTransfer?.files ?? []));

clearFilesButton.addEventListener('click', () => {
  if (isProcessing) return;
  queue = [];
  renderQueue();
  setStatus('已清除全部檔案。');
});

togglePasswordButton.addEventListener('click', () => {
  const willShow = passwordInput.type === 'password';
  passwordInput.type = willShow ? 'text' : 'password';
  togglePasswordButton.textContent = willShow ? '隱藏' : '顯示';
  togglePasswordButton.setAttribute('aria-pressed', String(willShow));
  passwordInput.focus();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const password = passwordInput.value;

  if (!queue.length) {
    setStatus('請先加入至少一個 PDF 檔案。', 'error');
    dropZone.focus();
    return;
  }

  if (!password) {
    setStatus('請輸入 PDF 密碼。', 'error');
    passwordInput.focus();
    return;
  }

  isProcessing = true;
  unlockButton.disabled = true;
  fileInput.disabled = true;
  passwordInput.disabled = true;
  togglePasswordButton.disabled = true;
  clearFilesButton.disabled = true;
  dropZone.setAttribute('aria-disabled', 'true');
  renderQueue();
  setStatus(`正在逐一處理 ${queue.length} 個 PDF…`, 'working');

  try {
    let successCount = 0;
    for (const item of queue) {
      item.status = 'processing';
      item.error = null;
      renderQueue();

      try {
        const output = await decryptPdf(item.file, password);
        downloadBytes(output, unlockedFilename(item.file.name));
        item.status = 'success';
        successCount += 1;
      } catch (error) {
        console.error(`PDF unlock failed (${item.file.name}):`, error);
        item.status = 'failed';
        item.error = getUserErrorMessage(error);
      }
      renderQueue();
    }

    const failedCount = queue.length - successCount;
    if (failedCount) {
      setStatus(`處理完成：${successCount} 個成功，${failedCount} 個失敗。`, 'error');
    } else {
      setStatus(`全部完成，已開始下載 ${successCount} 個 PDF。`, 'success');
    }
    passwordInput.value = '';
  } finally {
    isProcessing = false;
    unlockButton.disabled = false;
    fileInput.disabled = false;
    passwordInput.disabled = false;
    togglePasswordButton.disabled = false;
    clearFilesButton.disabled = false;
    dropZone.removeAttribute('aria-disabled');
    renderQueue();
  }
});
