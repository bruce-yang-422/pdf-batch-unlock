const tab = document.querySelector('#nup-tool-tab');
const toolSelect = document.querySelector('#tool-select');
const toolForm = document.querySelector('#tool-form');
const workspace = document.querySelector('#nup-workspace');
const title = document.querySelector('#tool-title');
const description = document.querySelector('#tool-description');
const legalNotice = document.querySelector('#unlock-legal-notice');
const fileInput = document.querySelector('#nup-file-input');
const dropZone = document.querySelector('#nup-drop-zone');
const fileList = document.querySelector('#nup-file-list');
const fileCount = document.querySelector('#nup-file-count');
const processButton = document.querySelector('#nup-process');
const status = document.querySelector('#nup-status');
const summary = document.querySelector('#nup-summary');
const result = document.querySelector('#nup-result');
const resultTitle = document.querySelector('#nup-result-title');
const downloadButton = document.querySelector('#nup-download');
const openLink = document.querySelector('#nup-open');

const MM = 72 / 25.4;
const PAPER = {
  A3: [297 * MM, 420 * MM],
  A4: [210 * MM, 297 * MM],
  A5: [148 * MM, 210 * MM],
};

let files = [];
let pdfLibPromise;
let outputUrl = '';
let active = false;
let previousHeading = null;

const mobileOption = document.createElement('option');
mobileOption.value = 'nup';
mobileOption.textContent = '多頁合版';
toolSelect.querySelector('option[value="pages"]')?.after(mobileOption);

function loadPdfLib() {
  if (globalThis.PDFLib) return Promise.resolve(globalThis.PDFLib);
  if (!pdfLibPromise) {
    pdfLibPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('./pdf-lib.min.js', import.meta.url).href;
      script.onload = () => resolve(globalThis.PDFLib);
      script.onerror = () => reject(new Error('無法載入 PDF 處理元件。'));
      document.head.append(script);
    });
  }
  return pdfLibPromise;
}

function activate() {
  if (active) return;
  active = true;
  previousHeading = { title: title.textContent, description: description.textContent };
  document.querySelectorAll('.tool-tab').forEach((item) => item.classList.remove('is-active'));
  document.querySelector('.card')?.classList.remove('page-manager-mode', 'decorate-mode');
  document.querySelector('.card')?.classList.add('nup-mode');
  tab.classList.add('is-active');
  tab.setAttribute('aria-pressed', 'true');
  toolSelect.value = 'nup';
  title.textContent = '多頁合版';
  description.textContent = '將 2 或 4 個 PDF 頁面縮排到同一張紙，適合表單、講義與節省紙張列印。';
  legalNotice.hidden = true;
  toolForm.hidden = true;
  workspace.hidden = false;
  updateSummary();
}

function deactivate() {
  if (!active) return;
  active = false;
  document.querySelector('.card')?.classList.remove('nup-mode');
  tab.classList.remove('is-active');
  tab.setAttribute('aria-pressed', 'false');
  toolForm.hidden = false;
  workspace.hidden = true;
  if (previousHeading) {
    title.textContent = previousHeading.title;
    description.textContent = previousHeading.description;
  }
}

tab.addEventListener('click', activate);
document.querySelector('.tool-tabs')?.addEventListener('click', (event) => {
  if (event.target.closest('.tool-tab')) deactivate();
}, true);
toolSelect.addEventListener('change', (event) => {
  if (toolSelect.value === 'nup') {
    event.stopImmediatePropagation();
    activate();
  } else {
    deactivate();
  }
}, true);

function selected(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value;
}

function geometry() {
  const count = Number(selected('nup-layout'));
  const paper = selected('nup-paper');
  const landscape = selected('nup-orientation') === 'landscape';
  const margin = Math.max(0, Number(document.querySelector('#nup-margin').value) || 0) * MM;
  const gap = Math.max(0, Number(document.querySelector('#nup-gap').value) || 0) * MM;
  const [portraitWidth, portraitHeight] = PAPER[paper];
  const pageWidth = landscape ? portraitHeight : portraitWidth;
  const pageHeight = landscape ? portraitWidth : portraitHeight;
  const columns = count === 4 ? 2 : landscape ? 2 : 1;
  const rows = count === 4 ? 2 : landscape ? 1 : 2;
  const boxWidth = (pageWidth - margin * 2 - gap * (columns - 1)) / columns;
  const boxHeight = (pageHeight - margin * 2 - gap * (rows - 1)) / rows;
  return { count, paper, landscape, margin, gap, pageWidth, pageHeight, columns, rows, boxWidth, boxHeight, slotPortrait: boxHeight > boxWidth };
}

function fitScale(width, height, layout) {
  const long = Math.max(width, height);
  const short = Math.min(width, height);
  return layout.slotPortrait
    ? Math.min(layout.boxWidth / short, layout.boxHeight / long)
    : Math.min(layout.boxWidth / long, layout.boxHeight / short);
}

function scaleRange(layout) {
  const scales = files.flatMap((file) => file.sizes.map(([width, height]) => fitScale(width, height, layout)));
  return scales.length ? { min: Math.min(...scales), max: Math.max(...scales) } : null;
}

function updateSummary() {
  const layout = geometry();
  const pages = files.reduce((total, file) => total + file.pages, 0);
  const duplicate = document.querySelector('#nup-duplicate').checked;
  const outputPages = duplicate ? pages : Math.ceil(pages / layout.count);
  const direction = layout.count === 4 ? '2 × 2 四格' : layout.landscape ? '左右排列' : '上下排列';
  const range = scaleRange(layout);
  let text = files.length
    ? `${pages} 個來源頁面 → ${outputPages} 張 ${layout.paper}；${layout.count} 合 1・${direction}。`
    : `輸出 ${layout.paper}；${layout.count} 合 1・${direction}。加入 PDF 後會顯示張數與縮放比例。`;
  summary.classList.remove('is-warning');
  if (range) {
    const min = Math.round(range.min * 100);
    text += ` 最小縮放比例約 ${min}%。`;
    if (min < 60) {
      text += ' ⚠ 文字可能過小，建議減少合版頁數或使用較大的紙張。';
      summary.classList.add('is-warning');
    }
  }
  summary.textContent = text;
}

function releaseResult() {
  if (outputUrl) URL.revokeObjectURL(outputUrl);
  outputUrl = '';
  result.hidden = true;
  openLink.removeAttribute('href');
}

function renderFiles() {
  fileList.replaceChildren();
  const pages = files.reduce((total, file) => total + file.pages, 0);
  fileCount.textContent = files.length ? `${files.length} 個檔案・共 ${pages} 頁` : '尚未加入檔案';
  files.forEach((item, index) => {
    const row = document.createElement('li');
    row.className = 'nup-file-row';
    const main = document.createElement('div');
    main.className = 'nup-file-row-main';
    const name = document.createElement('strong');
    name.textContent = item.name;
    const meta = document.createElement('small');
    meta.textContent = `${item.pages} 頁・${(item.file.size / 1024 / 1024).toFixed(2)} MB`;
    main.append(name, meta);
    const actions = document.createElement('div');
    actions.className = 'nup-file-row-actions';
    for (const [label, action, disabled] of [
      ['↑', 'up', index === 0], ['↓', 'down', index === files.length - 1], ['×', 'remove', false],
    ]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'text-button compact';
      button.textContent = label;
      button.dataset.action = action;
      button.dataset.index = index;
      button.disabled = disabled;
      button.setAttribute('aria-label', action === 'remove' ? `移除 ${item.name}` : `${label === '↑' ? '上移' : '下移'} ${item.name}`);
      actions.append(button);
    }
    row.append(main, actions);
    fileList.append(row);
  });
  processButton.disabled = files.length === 0;
  status.textContent = files.length ? '準備就緒' : '請先加入 PDF';
  releaseResult();
  updateSummary();
}

async function addFiles(fileCollection) {
  const incoming = [...fileCollection].filter((file) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name));
  if (!incoming.length) {
    status.textContent = '請選擇 PDF 檔案。';
    return;
  }
  processButton.disabled = true;
  status.textContent = '正在讀取 PDF 頁面資訊…';
  try {
    const { PDFDocument } = await loadPdfLib();
    for (const file of incoming) {
      try {
        const bytes = await file.arrayBuffer();
        const document = await PDFDocument.load(bytes, { ignoreEncryption: true });
        files.push({
          file,
          name: file.name,
          bytes,
          pages: document.getPageCount(),
          sizes: document.getPages().map((page) => [page.getWidth(), page.getHeight()]),
        });
      } catch (error) {
        console.error('N-up PDF load failed:', error);
        status.textContent = `${file.name} 無法讀取；若有密碼，請先使用「移除密碼」。`;
      }
    }
  } finally {
    renderFiles();
  }
}

fileInput.addEventListener('change', () => {
  addFiles(fileInput.files);
  fileInput.value = '';
});
dropZone.addEventListener('click', (event) => { if (event.target !== fileInput) fileInput.click(); });
dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fileInput.click();
  }
});
for (const eventName of ['dragenter', 'dragover']) {
  dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('is-dragging'); });
}
for (const eventName of ['dragleave', 'drop']) {
  dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('is-dragging'); });
}
dropZone.addEventListener('drop', (event) => addFiles(event.dataTransfer?.files ?? []));

fileList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const index = Number(button.dataset.index);
  if (button.dataset.action === 'remove') files.splice(index, 1);
  if (button.dataset.action === 'up' && index > 0) [files[index - 1], files[index]] = [files[index], files[index - 1]];
  if (button.dataset.action === 'down' && index < files.length - 1) [files[index + 1], files[index]] = [files[index], files[index + 1]];
  renderFiles();
});
document.querySelector('#nup-sort-files').addEventListener('click', () => {
  files.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant', { numeric: true }));
  renderFiles();
});
document.querySelector('#nup-clear-files').addEventListener('click', () => { files = []; renderFiles(); });

function drawFitted(page, embedded, rotation, x0, y0, boxWidth, boxHeight, degrees) {
  const width = embedded.width;
  const height = embedded.height;
  const swap = rotation === 90 || rotation === 270;
  const displayWidth = swap ? height : width;
  const displayHeight = swap ? width : height;
  const scale = Math.min(boxWidth / displayWidth, boxHeight / displayHeight);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const occupiedWidth = displayWidth * scale;
  const occupiedHeight = displayHeight * scale;
  const baseX = x0 + (boxWidth - occupiedWidth) / 2;
  const baseY = y0 + (boxHeight - occupiedHeight) / 2;
  let x = baseX;
  let y = baseY;
  if (rotation === 90) x = baseX + occupiedWidth;
  if (rotation === 180) { x = baseX + scaledWidth; y = baseY + scaledHeight; }
  if (rotation === 270) y = baseY + occupiedHeight;
  page.drawPage(embedded, { x, y, width: scaledWidth, height: scaledHeight, rotate: degrees(rotation) });
}

async function createOutput() {
  const { PDFDocument, degrees, rgb } = await loadPdfLib();
  const layout = geometry();
  const duplicate = document.querySelector('#nup-duplicate').checked;
  const cutline = document.querySelector('#nup-cutline').checked;
  const output = await PDFDocument.create();
  const slots = [];
  for (const file of files) {
    const source = await PDFDocument.load(file.bytes, { ignoreEncryption: true });
    for (const sourcePage of source.getPages()) {
      let embedded = null;
      try { embedded = await output.embedPage(sourcePage); } catch { /* Preserve an empty slot for blank pages. */ }
      const sourceRotation = ((sourcePage.getRotation().angle % 360) + 360) % 360;
      const rotation = (360 - sourceRotation) % 360;
      const swap = rotation === 90 || rotation === 270;
      const portrait = embedded ? (swap ? embedded.width : embedded.height) > (swap ? embedded.height : embedded.width) : false;
      const item = { embedded, rotation, portrait };
      for (let copy = 0; copy < (duplicate ? layout.count : 1); copy += 1) slots.push(item);
    }
  }
  for (let start = 0; start < slots.length; start += layout.count) {
    const page = output.addPage([layout.pageWidth, layout.pageHeight]);
    slots.slice(start, start + layout.count).forEach((item, index) => {
      if (!item.embedded) return;
      const column = index % layout.columns;
      const row = Math.floor(index / layout.columns);
      const rotation = item.portrait !== layout.slotPortrait ? (item.rotation + 90) % 360 : item.rotation;
      const x = layout.margin + column * (layout.boxWidth + layout.gap);
      const y = layout.pageHeight - layout.margin - (row + 1) * layout.boxHeight - row * layout.gap;
      drawFitted(page, item.embedded, rotation, x, y, layout.boxWidth, layout.boxHeight, degrees);
    });
    if (cutline) {
      const style = { thickness: 0.5, color: rgb(0.6, 0.6, 0.6), dashArray: [4, 3] };
      for (let column = 1; column < layout.columns; column += 1) {
        const x = layout.margin + column * layout.boxWidth + (column - 0.5) * layout.gap;
        page.drawLine({ start: { x, y: 0 }, end: { x, y: layout.pageHeight }, ...style });
      }
      for (let row = 1; row < layout.rows; row += 1) {
        const y = layout.pageHeight - layout.margin - row * layout.boxHeight - (row - 0.5) * layout.gap;
        page.drawLine({ start: { x: 0, y }, end: { x: layout.pageWidth, y }, ...style });
      }
    }
  }
  return { bytes: await output.save(), pages: Math.ceil(slots.length / layout.count), layout };
}

processButton.addEventListener('click', async () => {
  if (!files.length) return;
  processButton.disabled = true;
  status.textContent = '正在產生合版 PDF…';
  releaseResult();
  try {
    const output = await createOutput();
    const blob = new Blob([output.bytes], { type: 'application/pdf' });
    outputUrl = URL.createObjectURL(blob);
    const base = files.length === 1 ? files[0].name.replace(/\.pdf$/i, '') : '合版文件';
    const filename = `${base}_${output.layout.count}合1_${output.layout.paper}.pdf`;
    openLink.href = outputUrl;
    downloadButton.dataset.filename = filename;
    resultTitle.textContent = `完成：已產生 ${output.pages} 張 ${output.layout.paper}`;
    result.hidden = false;
    status.textContent = '處理完成，可下載或在新分頁預覽。';
  } catch (error) {
    console.error('N-up PDF generation failed:', error);
    status.textContent = `合版失敗：${error.message || '請確認 PDF 是否有效。'}`;
  } finally {
    processButton.disabled = files.length === 0;
  }
});

downloadButton.addEventListener('click', () => {
  if (!outputUrl) return;
  const anchor = document.createElement('a');
  anchor.href = outputUrl;
  anchor.download = downloadButton.dataset.filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
});

workspace.querySelectorAll('input[name="nup-layout"], input[name="nup-paper"], input[name="nup-orientation"], #nup-margin, #nup-gap, #nup-duplicate')
  .forEach((input) => input.addEventListener('input', updateSummary));

window.addEventListener('beforeunload', releaseResult);
renderFiles();
