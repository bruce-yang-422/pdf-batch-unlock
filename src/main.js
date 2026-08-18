import './style.css';
import { decryptPdf } from './core/decrypt.js';
import { getUserErrorMessage } from './core/errors.js';
import { jpgsToPdf, mergePdfs, pdfToJpg, splitPdf } from './core/document-tools.js';
import { formatSize } from './utils/format-size.js';
import { unlockedFilename } from './utils/filename.js';

const TOOLS = {
  unlock: {
    title: '移除 PDF 密碼',
    description: '加入多個使用相同密碼的 PDF，逐檔移除密碼並下載。',
    accept: 'application/pdf,.pdf',
    kind: 'pdf',
    multiple: true,
    dropTitle: '將加密 PDF 拖曳到這裡',
    dropHint: '或點一下選擇多個 PDF',
    button: '全部移除密碼並下載',
    note: '檔案會逐一處理。瀏覽器可能會詢問是否允許下載多個檔案。',
  },
  merge: {
    title: '合併 PDF',
    description: '依清單順序將兩個以上未加密 PDF 合併成一個檔案。',
    accept: 'application/pdf,.pdf',
    kind: 'pdf',
    multiple: true,
    minimum: 2,
    dropTitle: '將要合併的 PDF 拖曳到這裡',
    dropHint: '檔案會依加入順序合併',
    button: '合併並下載 PDF',
    note: '加密 PDF 請先使用「移除密碼」。可拖曳檔案或使用箭頭調整合併順序。',
  },
  split: {
    title: '拆分 PDF',
    description: '將一個未加密 PDF 的每一頁拆成獨立 PDF，並打包為 ZIP。',
    accept: 'application/pdf,.pdf',
    kind: 'pdf',
    multiple: false,
    dropTitle: '將一個 PDF 拖曳到這裡',
    dropHint: '每頁會輸出一個 PDF',
    button: '拆分並下載 ZIP',
    note: '多頁輸出會打包成一個 ZIP，避免瀏覽器阻擋連續下載。',
  },
  'jpg-to-pdf': {
    title: 'JPG 轉 PDF',
    description: '將一張或多張 JPG 依清單順序轉成多頁 PDF。',
    accept: 'image/jpeg,.jpg,.jpeg',
    kind: 'jpg',
    multiple: true,
    dropTitle: '將 JPG 拖曳到這裡',
    dropHint: '支援多張 JPG／JPEG',
    button: '轉換並下載 PDF',
    note: '每張圖片會成為一頁，頁面尺寸會配合原始圖片。',
  },
  'pdf-to-jpg': {
    title: 'PDF 轉 JPG',
    description: '將一個未加密 PDF 的每一頁轉為 JPG，並打包為 ZIP。',
    accept: 'application/pdf,.pdf',
    kind: 'pdf',
    multiple: false,
    dropTitle: '將一個 PDF 拖曳到這裡',
    dropHint: '每頁會輸出一張 JPG',
    button: '轉換並下載 ZIP',
    note: '高解析度會使用較多記憶體；大型 PDF 建議使用標準或清晰模式。',
  },
};

const form = document.querySelector('#tool-form');
const tabs = [...document.querySelectorAll('.tool-tab')];
const toolSelect = document.querySelector('#tool-select');
const fileInput = document.querySelector('#file-input');
const dropZone = document.querySelector('#drop-zone');
const dropTitle = document.querySelector('#drop-title');
const dropHint = document.querySelector('#drop-hint');
const fileFeedback = document.querySelector('#file-feedback');
const queueSection = document.querySelector('#queue-section');
const fileList = document.querySelector('#file-list');
const clearFilesButton = document.querySelector('#clear-files');
const passwordSection = document.querySelector('#password-section');
const passwordInput = document.querySelector('#password');
const togglePasswordButton = document.querySelector('#toggle-password');
const jpgOptions = document.querySelector('#jpg-options');
const jpgScale = document.querySelector('#jpg-scale');
const processButton = document.querySelector('#process-button');
const toolTitle = document.querySelector('#tool-title');
const toolDescription = document.querySelector('#tool-description');
const status = document.querySelector('#status');
const limitNote = document.querySelector('#limit-note');

let activeTool = 'unlock';
let queue = [];
let isProcessing = false;
let draggedItemId = null;

const STATUS_LABELS = { waiting: '等待中', processing: '處理中…', success: '完成', failed: '失敗' };

function setStatus(message, kind = '') {
  status.textContent = message;
  status.dataset.kind = kind;
}

function moveQueueItem(itemId, destinationIndex) {
  const sourceIndex = queue.findIndex((item) => item.id === itemId);
  if (sourceIndex < 0) return;

  const boundedIndex = Math.max(0, Math.min(destinationIndex, queue.length - 1));
  if (sourceIndex === boundedIndex) return;

  const [movedItem] = queue.splice(sourceIndex, 1);
  queue.splice(boundedIndex, 0, movedItem);
  renderQueue();
  setStatus('已更新 PDF 合併順序。');
}

function clearDragIndicators() {
  fileList.querySelectorAll('.is-dragging, .drop-before, .drop-after').forEach((row) => {
    row.classList.remove('is-dragging', 'drop-before', 'drop-after');
  });
}

function matchesKind(file, kind) {
  if (kind === 'jpg') return /\.jpe?g$/i.test(file.name) || file.type === 'image/jpeg';
  return /\.pdf$/i.test(file.name) || file.type === 'application/pdf';
}

function fileKey(file) {
  return `${file.name}\u0000${file.size}\u0000${file.lastModified}`;
}

function renderQueue() {
  queueSection.hidden = queue.length === 0;
  const total = queue.reduce((sum, item) => sum + item.file.size, 0);
  fileFeedback.textContent = queue.length
    ? `已加入 ${queue.length} 個檔案，總大小 ${formatSize(total)}`
    : '尚未加入檔案';
  fileList.replaceChildren();

  for (const [index, item] of queue.entries()) {
    const row = document.createElement('li');
    row.className = 'file-row';
    row.dataset.status = item.status;
    row.dataset.queueId = item.id;

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

    const remove = document.createElement('button');
    remove.className = 'remove-file';
    remove.type = 'button';
    remove.textContent = '移除';
    remove.disabled = isProcessing;
    remove.setAttribute('aria-label', `移除 ${item.file.name}`);
    remove.addEventListener('click', () => {
      queue = queue.filter((queued) => queued.id !== item.id);
      renderQueue();
    });

    if (activeTool === 'merge') {
      row.classList.add('is-sortable');

      const reorderControls = document.createElement('div');
      reorderControls.className = 'reorder-controls';

      const dragHandle = document.createElement('span');
      dragHandle.className = 'drag-handle';
      dragHandle.textContent = '⠿';
      dragHandle.title = `拖曳調整 ${item.file.name} 的合併順序`;
      dragHandle.draggable = !isProcessing;
      dragHandle.setAttribute('aria-hidden', 'true');

      const moveUp = document.createElement('button');
      moveUp.className = 'order-button';
      moveUp.type = 'button';
      moveUp.textContent = '↑';
      moveUp.disabled = isProcessing || index === 0;
      moveUp.setAttribute('aria-label', `將 ${item.file.name} 上移`);
      moveUp.addEventListener('click', () => moveQueueItem(item.id, index - 1));

      const moveDown = document.createElement('button');
      moveDown.className = 'order-button';
      moveDown.type = 'button';
      moveDown.textContent = '↓';
      moveDown.disabled = isProcessing || index === queue.length - 1;
      moveDown.setAttribute('aria-label', `將 ${item.file.name} 下移`);
      moveDown.addEventListener('click', () => moveQueueItem(item.id, index + 1));

      dragHandle.addEventListener('dragstart', (event) => {
        draggedItemId = item.id;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', item.id);
        row.classList.add('is-dragging');
      });
      dragHandle.addEventListener('dragend', () => {
        draggedItemId = null;
        clearDragIndicators();
      });
      row.addEventListener('dragover', (event) => {
        if (!draggedItemId || draggedItemId === item.id || isProcessing) return;
        event.preventDefault();
        const after = event.clientY > row.getBoundingClientRect().top + row.offsetHeight / 2;
        fileList.querySelectorAll('.drop-before, .drop-after').forEach((target) => {
          target.classList.remove('drop-before', 'drop-after');
        });
        row.classList.add(after ? 'drop-after' : 'drop-before');
      });
      row.addEventListener('drop', (event) => {
        if (!draggedItemId || isProcessing) return;
        event.preventDefault();
        const sourceIndex = queue.findIndex((queued) => queued.id === draggedItemId);
        const targetIndex = queue.findIndex((queued) => queued.id === item.id);
        const after = event.clientY > row.getBoundingClientRect().top + row.offsetHeight / 2;
        let destinationIndex = targetIndex + (after ? 1 : 0);
        if (sourceIndex < destinationIndex) destinationIndex -= 1;
        const movedId = draggedItemId;
        draggedItemId = null;
        clearDragIndicators();
        moveQueueItem(movedId, destinationIndex);
      });

      reorderControls.append(dragHandle, moveUp, moveDown);
      row.append(details, state, reorderControls, remove);
    } else {
      row.append(details, state, remove);
    }
    fileList.append(row);
  }
}

function addFiles(fileCollection) {
  if (isProcessing) return;
  const config = TOOLS[activeTool];
  const incoming = [...fileCollection];
  const valid = incoming.filter((file) => matchesKind(file, config.kind));
  const existing = new Set(queue.map((item) => fileKey(item.file)));
  let additions = valid.filter((file) => !existing.has(fileKey(file)));

  if (!config.multiple) {
    additions = additions.slice(0, 1);
    queue = [];
  }

  queue.push(...additions.map((file) => ({
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    file,
    status: 'waiting',
    error: null,
  })));

  if (incoming.length > valid.length) setStatus(`已略過 ${incoming.length - valid.length} 個格式不符的檔案。`, 'error');
  else if (!config.multiple && valid.length > 1) setStatus('此工具一次只能處理一個檔案。');
  else setStatus('準備就緒');
  renderQueue();
}

function switchTool(tool) {
  if (isProcessing || tool === activeTool) return;
  activeTool = tool;
  queue = [];
  passwordInput.value = '';
  const config = TOOLS[tool];

  tabs.forEach((tab) => {
    const selected = tab.dataset.tool === tool;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-pressed', String(selected));
  });
  toolSelect.value = tool;
  toolTitle.textContent = config.title;
  toolDescription.textContent = config.description;
  fileInput.accept = config.accept;
  fileInput.multiple = config.multiple;
  dropTitle.textContent = config.dropTitle;
  dropHint.textContent = config.dropHint;
  processButton.textContent = config.button;
  limitNote.textContent = config.note;
  passwordSection.hidden = tool !== 'unlock';
  jpgOptions.hidden = tool !== 'pdf-to-jpg';
  fileInput.value = '';
  renderQueue();
  setStatus('準備就緒');
}

function download(result) {
  const blob = result.blob ?? new Blob([result.bytes], { type: result.type ?? 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function friendlyToolError(error) {
  const text = `${error?.name ?? ''} ${error?.message ?? ''}`.toLowerCase();
  if (/encrypt|password/.test(text)) return '此 PDF 受密碼保護，請先使用「移除密碼」。';
  if (/invalid|parse|header|format/.test(text)) return '檔案格式無效或內容已損毀。';
  if (/memory|allocation|out of bounds/.test(text)) return '瀏覽器記憶體不足，請減少頁數或降低 JPG 清晰度。';
  return error?.message ? `處理失敗：${error.message}` : '處理失敗，請確認檔案是否有效。';
}

function lockUi(locked) {
  isProcessing = locked;
  tabs.forEach((tab) => { tab.disabled = locked; });
  toolSelect.disabled = locked;
  fileInput.disabled = locked;
  passwordInput.disabled = locked;
  togglePasswordButton.disabled = locked;
  clearFilesButton.disabled = locked;
  processButton.disabled = locked;
  jpgScale.disabled = locked;
  if (locked) dropZone.setAttribute('aria-disabled', 'true');
  else dropZone.removeAttribute('aria-disabled');
  renderQueue();
}

async function processUnlock(password) {
  let successCount = 0;
  for (const item of queue) {
    item.status = 'processing';
    item.error = null;
    renderQueue();
    try {
      const output = await decryptPdf(item.file, password);
      download({ bytes: output, filename: unlockedFilename(item.file.name), type: 'application/pdf' });
      item.status = 'success';
      successCount += 1;
    } catch (error) {
      console.error(`PDF unlock failed (${item.file.name}):`, error);
      item.status = 'failed';
      item.error = getUserErrorMessage(error);
    }
    renderQueue();
  }
  const failures = queue.length - successCount;
  setStatus(
    failures ? `處理完成：${successCount} 個成功，${failures} 個失敗。` : `全部完成，已下載 ${successCount} 個 PDF。`,
    failures ? 'error' : 'success',
  );
}

async function processDocumentTool() {
  const progress = (current, total, label) => {
    setStatus(`正在處理 ${label}（${current}/${total}）…`, 'working');
  };
  let result;

  if (activeTool === 'merge') result = await mergePdfs(queue.map((item) => item.file), progress);
  if (activeTool === 'split') result = await splitPdf(queue[0].file, progress);
  if (activeTool === 'jpg-to-pdf') result = await jpgsToPdf(queue.map((item) => item.file), progress);
  if (activeTool === 'pdf-to-jpg') {
    result = await pdfToJpg(queue[0].file, { scale: Number(jpgScale.value), quality: 0.9 }, progress);
  }

  queue.forEach((item) => { item.status = 'success'; });
  renderQueue();
  download(result);
  setStatus(`完成，已下載 ${result.filename}。`, 'success');
}

tabs.forEach((tab) => tab.addEventListener('click', () => switchTool(tab.dataset.tool)));
toolSelect.addEventListener('change', () => switchTool(toolSelect.value));
fileInput.addEventListener('change', () => { addFiles(fileInput.files ?? []); fileInput.value = ''; });
dropZone.addEventListener('click', (event) => { if (event.target !== fileInput) fileInput.click(); });
dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.click(); }
});
for (const name of ['dragenter', 'dragover']) {
  dropZone.addEventListener(name, (event) => { event.preventDefault(); if (!isProcessing) dropZone.classList.add('is-dragging'); });
}
for (const name of ['dragleave', 'drop']) {
  dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove('is-dragging'); });
}
dropZone.addEventListener('drop', (event) => addFiles(event.dataTransfer?.files ?? []));
clearFilesButton.addEventListener('click', () => { if (!isProcessing) { queue = []; renderQueue(); setStatus('已清除全部檔案。'); } });
togglePasswordButton.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  togglePasswordButton.textContent = show ? '隱藏' : '顯示';
  togglePasswordButton.setAttribute('aria-pressed', String(show));
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const config = TOOLS[activeTool];
  if (queue.length < (config.minimum ?? 1)) {
    setStatus(config.minimum ? `請至少加入 ${config.minimum} 個 PDF。` : '請先加入檔案。', 'error');
    dropZone.focus();
    return;
  }
  if (activeTool === 'unlock' && !passwordInput.value) {
    setStatus('請輸入 PDF 密碼。', 'error');
    passwordInput.focus();
    return;
  }

  lockUi(true);
  setStatus('正在準備處理檔案…', 'working');
  try {
    if (activeTool === 'unlock') await processUnlock(passwordInput.value);
    else await processDocumentTool();
    passwordInput.value = '';
  } catch (error) {
    console.error(`${activeTool} failed:`, error);
    queue.forEach((item) => { if (item.status !== 'success') item.status = 'failed'; });
    renderQueue();
    setStatus(friendlyToolError(error), 'error');
  } finally {
    lockUi(false);
  }
});
