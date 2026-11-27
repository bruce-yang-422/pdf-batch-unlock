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
const previewPaper = document.querySelector('#nup-preview-paper');
const previewMeta = document.querySelector('#nup-preview-meta');
const previewFrame = document.querySelector('#nup-preview-frame');

const messageTemplates = {
  'zh-Hant': { fileCount: '{files} 個檔案・共 {pages} 頁', fileMeta: '{pages} 頁・{size} MB', emptySummary: '輸出 {paper}；{count} 合 1・{direction}。{hint}', summary: '{pages} 個來源頁面 → {sheets} 張 {paper}；{count} 合 1・{direction}。', scale: ' 最小縮放比例約 {scale}%。', result: '完成：已產生 {sheets} 張 {paper}', loadError: '{file} 無法讀取；若有密碼，請先使用「移除密碼」。', failed: '合版失敗：{error}', remove: '移除 {file}', up: '上移 {file}', down: '下移 {file}' },
  en: { fileCount: '{files} files · {pages} pages', fileMeta: '{pages} pages · {size} MB', emptySummary: 'Output: {paper}; {count}-up · {direction}. {hint}', summary: '{pages} source pages → {sheets} {paper} sheets; {count}-up · {direction}.', scale: ' Minimum scale: about {scale}%.', result: 'Done: created {sheets} {paper} sheets', loadError: 'Could not read {file}. If it is password-protected, use “Remove password” first.', failed: 'Layout failed: {error}', remove: 'Remove {file}', up: 'Move {file} up', down: 'Move {file} down' },
  ja: { fileCount: '{files} ファイル・全 {pages} ページ', fileMeta: '{pages} ページ・{size} MB', emptySummary: '出力 {paper}・1 枚あたり {count} ページ・{direction}。{hint}', summary: '{pages} ページ → {paper} {sheets} 枚・1 枚あたり {count} ページ・{direction}。', scale: ' 最小縮小率は約 {scale}% です。', result: '完了：{paper} を {sheets} 枚作成しました', loadError: '{file} を読み込めません。パスワード付きの場合は、先に「パスワード解除」を使用してください。', failed: 'ページの配置に失敗しました：{error}', remove: '{file} を削除', up: '{file} を上へ', down: '{file} を下へ' },
  ko: { fileCount: '파일 {files}개 · 총 {pages}페이지', fileMeta: '{pages}페이지 · {size} MB', emptySummary: '출력 {paper} · {count}쪽 모아찍기 · {direction}. {hint}', summary: '원본 {pages}페이지 → {paper} {sheets}장 · {count}쪽 모아찍기 · {direction}.', scale: ' 최소 배율 약 {scale}%.', result: '완료: {paper} {sheets}장 생성', loadError: '{file}을(를) 읽을 수 없습니다. 암호가 있으면 먼저 “암호 제거”를 사용하세요.', failed: '모아찍기 실패: {error}', remove: '{file} 제거', up: '{file} 위로', down: '{file} 아래로' },
  es: { fileCount: '{files} archivos · {pages} páginas', fileMeta: '{pages} páginas · {size} MB', emptySummary: 'Salida {paper}; {count} por hoja · {direction}. {hint}', summary: '{pages} páginas de origen → {sheets} hojas {paper}; {count} por hoja · {direction}.', scale: ' Escala mínima aproximada: {scale} %.', result: 'Listo: se crearon {sheets} hojas {paper}', loadError: 'No se pudo leer {file}. Si tiene contraseña, usa primero «Quitar contraseña».', failed: 'Error de diseño: {error}', remove: 'Quitar {file}', up: 'Subir {file}', down: 'Bajar {file}' },
  de: { fileCount: '{files} Dateien · {pages} Seiten', fileMeta: '{pages} Seiten · {size} MB', emptySummary: 'Ausgabe {paper}; {count} Seiten/Blatt · {direction}. {hint}', summary: '{pages} Quellseiten → {sheets} Blatt {paper}; {count} Seiten/Blatt · {direction}.', scale: ' Kleinste Skalierung ca. {scale} %.', result: 'Fertig: {sheets} Blatt {paper} erstellt', loadError: '{file} konnte nicht gelesen werden. Bei Passwortschutz zuerst „Passwort entfernen“ verwenden.', failed: 'Anordnung fehlgeschlagen: {error}', remove: '{file} entfernen', up: '{file} nach oben', down: '{file} nach unten' },
  fr: { fileCount: '{files} fichiers · {pages} pages', fileMeta: '{pages} pages · {size} Mo', emptySummary: 'Sortie {paper} ; {count} pages/feuille · {direction}. {hint}', summary: '{pages} pages source → {sheets} feuilles {paper} ; {count} pages/feuille · {direction}.', scale: ' Échelle minimale : environ {scale} %.', result: 'Terminé : {sheets} feuilles {paper} créées', loadError: 'Impossible de lire {file}. S’il est protégé, utilisez d’abord « Supprimer le mot de passe ».', failed: 'Échec de la mise en page : {error}', remove: 'Supprimer {file}', up: 'Monter {file}', down: 'Descendre {file}' },
  'zh-Hans': { fileCount: '{files} 个文件，共 {pages} 页', fileMeta: '{pages} 页 · {size} MB', emptySummary: '输出纸张：{paper}；每张 {count} 页；{direction}。{hint}', summary: '{pages} 个源页面 → {sheets} 张 {paper}；每张 {count} 页；{direction}。', scale: ' 最小缩放比例约为 {scale}%。', result: '完成：已生成 {sheets} 张 {paper}', loadError: '无法读取 {file}。如果文件有密码，请先使用“移除密码”。', failed: '排版失败：{error}', remove: '删除 {file}', up: '上移 {file}', down: '下移 {file}' },
  ru: { fileCount: '{files} файлов · {pages} страниц', fileMeta: '{pages} страниц · {size} МБ', emptySummary: 'Вывод: {paper}; {count} стр./лист · {direction}. {hint}', summary: '{pages} исходных страниц → {sheets} листов {paper}; {count} стр./лист · {direction}.', scale: ' Минимальный масштаб около {scale}%.', result: 'Готово: создано {sheets} листов {paper}', loadError: 'Не удалось прочитать {file}. Если файл защищён, сначала снимите пароль.', failed: 'Ошибка размещения: {error}', remove: 'Удалить {file}', up: 'Переместить {file} вверх', down: 'Переместить {file} вниз' },
  'pt-BR': { fileCount: '{files} arquivos · {pages} páginas', fileMeta: '{pages} páginas · {size} MB', emptySummary: 'Saída {paper}; {count} por folha · {direction}. {hint}', summary: '{pages} páginas de origem → {sheets} folhas {paper}; {count} por folha · {direction}.', scale: ' Escala mínima aproximada: {scale}%.', result: 'Concluído: {sheets} folhas {paper} criadas', loadError: 'Não foi possível ler {file}. Se houver senha, remova-a primeiro.', failed: 'Falha no layout: {error}', remove: 'Remover {file}', up: 'Mover {file} para cima', down: 'Mover {file} para baixo' },
  th: { fileCount: '{files} ไฟล์ · {pages} หน้า', fileMeta: '{pages} หน้า · {size} MB', emptySummary: 'ส่งออก {paper} · {count} หน้าต่อแผ่น · {direction} {hint}', summary: '{pages} หน้าต้นฉบับ → {sheets} แผ่น {paper} · {count} หน้าต่อแผ่น · {direction}', scale: ' อัตราส่วนต่ำสุดประมาณ {scale}%', result: 'เสร็จแล้ว: สร้าง {paper} {sheets} แผ่น', loadError: 'อ่าน {file} ไม่ได้ หากมีรหัสผ่าน ให้เอารหัสผ่านออกก่อน', failed: 'จัดหน้าไม่สำเร็จ: {error}', remove: 'ลบ {file}', up: 'เลื่อน {file} ขึ้น', down: 'เลื่อน {file} ลง' },
  vi: { fileCount: '{files} tệp · {pages} trang', fileMeta: '{pages} trang · {size} MB', emptySummary: 'Đầu ra {paper}; {count} trang/tờ · {direction}. {hint}', summary: '{pages} trang nguồn → {sheets} tờ {paper}; {count} trang/tờ · {direction}.', scale: ' Tỷ lệ nhỏ nhất khoảng {scale}%.', result: 'Hoàn tất: đã tạo {sheets} tờ {paper}', loadError: 'Không đọc được {file}. Nếu có mật khẩu, hãy gỡ mật khẩu trước.', failed: 'Dàn trang thất bại: {error}', remove: 'Xóa {file}', up: 'Đưa {file} lên', down: 'Đưa {file} xuống' },
  id: { fileCount: '{files} file · {pages} halaman', fileMeta: '{pages} halaman · {size} MB', emptySummary: 'Keluaran {paper}; {count} halaman/lembar · {direction}. {hint}', summary: '{pages} halaman sumber → {sheets} lembar {paper}; {count} halaman/lembar · {direction}.', scale: ' Skala minimum sekitar {scale}%.', result: 'Selesai: membuat {sheets} lembar {paper}', loadError: '{file} tidak dapat dibaca. Jika memakai kata sandi, hapus kata sandinya terlebih dahulu.', failed: 'Tata letak gagal: {error}', remove: 'Hapus {file}', up: 'Pindahkan {file} ke atas', down: 'Pindahkan {file} ke bawah' },
};

function locale() { return globalThis.pdfToolI18n?.locale ?? document.documentElement.lang ?? 'en'; }
function translate(source) { return globalThis.pdfToolI18n?.translate(source) ?? source; }
function message(key, values = {}) {
  const template = (messageTemplates[locale()] ?? messageTemplates.en)[key] ?? messageTemplates.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
}

const MM = 72 / 25.4;
const PAPER = {
  A3: [297 * MM, 420 * MM],
  A4: [210 * MM, 297 * MM],
  A5: [148 * MM, 210 * MM],
};
const CAUTION_SCALE = 0.85;
const DANGER_SCALE = 0.6;

let files = [];
let pdfLibPromise;
let outputUrl = '';
let active = false;
let previousHeading = null;
let lastResult = null;
let settingsTouched = false;

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
  title.textContent = translate('多頁合版');
  description.textContent = translate('將 2 或 4 個 PDF 頁面縮排到同一張紙，適合表單、講義與節省紙張列印。');
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

function geometry(overrides = {}) {
  const count = overrides.count ?? Number(selected('nup-layout'));
  const paper = overrides.paper ?? selected('nup-paper');
  const landscape = overrides.landscape ?? selected('nup-orientation') === 'landscape';
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

function recommendSettings() {
  const sourcePages = files.flatMap((file) => file.sizes);
  if (!sourcePages.length || settingsTouched) return;
  const pageCount = sourcePages.length;
  const candidates = [];
  for (const count of [2, 4]) {
    for (const paper of ['A5', 'A4', 'A3']) {
      for (const landscape of [true, false]) {
        const layout = geometry({ count, paper, landscape });
        const scales = sourcePages.map(([width, height]) => fitScale(width, height, layout));
        const worstDeviation = Math.max(...scales.map((scale) => Math.abs(Math.log2(Math.max(scale, 0.01)))));
        const minimumScale = Math.min(...scales);
        const maximumScale = Math.max(...scales);
        const severeShrinkPenalty = minimumScale < 0.6 ? (0.6 - minimumScale) * 3 : 0;
        const excessiveUpscalePenalty = maximumScale > 1.15 ? (maximumScale - 1.15) * 0.35 : 0;
        const emptySlotPenalty = pageCount < count ? (count - pageCount) * 0.08 : 0;
        const paperPreference = paper === 'A3' ? 0.02 : paper === 'A5' ? 0.01 : 0;
        const rotatedPageRatio = sourcePages.filter(([width, height]) => (height > width) !== layout.slotPortrait).length / pageCount;
        const rotationPenalty = rotatedPageRatio * 0.025;
        candidates.push({ layout, score: worstDeviation + severeShrinkPenalty + excessiveUpscalePenalty + emptySlotPenalty + paperPreference + rotationPenalty });
      }
    }
  }
  candidates.sort((a, b) => a.score - b.score || a.layout.count - b.layout.count);
  const recommended = candidates[0].layout;
  document.querySelector(`input[name="nup-layout"][value="${recommended.count}"]`).checked = true;
  document.querySelector(`input[name="nup-paper"][value="${recommended.paper}"]`).checked = true;
  document.querySelector(`input[name="nup-orientation"][value="${recommended.landscape ? 'landscape' : 'portrait'}"]`).checked = true;
}

function updateSummary() {
  const layout = geometry();
  const pages = files.reduce((total, file) => total + file.pages, 0);
  const duplicate = document.querySelector('#nup-duplicate').checked;
  const outputPages = duplicate ? pages : Math.ceil(pages / layout.count);
  const direction = translate(layout.count === 4 ? '2 × 2 四格' : layout.landscape ? '左右排列' : '上下排列');
  const range = scaleRange(layout);
  let text = files.length
    ? message('summary', { pages, sheets: outputPages, paper: layout.paper, count: layout.count, direction })
    : message('emptySummary', { paper: layout.paper, count: layout.count, direction, hint: translate('加入 PDF 後會顯示張數與縮放比例。') });
  summary.classList.remove('is-caution', 'is-danger');
  if (range) {
    const min = Math.round(range.min * 100);
    text += message('scale', { scale: min });
    if (range.min < DANGER_SCALE) {
      text += ` ⚠ ${translate('文字可能過小，建議減少合版頁數或使用較大的紙張。')}`;
      summary.classList.add('is-danger');
    } else if (range.min < CAUTION_SCALE) {
      text += ` ⚠ ${translate('內容會明顯縮小，列印前請確認文字大小。')}`;
      summary.classList.add('is-caution');
    }
  }
  summary.textContent = text;
  renderPreview(layout);
}

function renderPreview(layout = geometry()) {
  const duplicate = document.querySelector('#nup-duplicate').checked;
  const cutline = document.querySelector('#nup-cutline').checked;
  const marginMm = Math.max(0, Number(document.querySelector('#nup-margin').value) || 0);
  const gapMm = Math.max(0, Number(document.querySelector('#nup-gap').value) || 0);
  previewPaper.className = 'nup-preview-paper';
  previewPaper.classList.add(layout.count === 4 ? 'is-four-up' : layout.landscape ? 'is-two-landscape' : 'is-two-portrait');
  previewPaper.classList.toggle('is-portrait', !layout.landscape);
  previewPaper.classList.toggle('has-cutlines', cutline);
  previewPaper.style.padding = `${Math.min(30, 8 + marginMm * 1.1)}px`;
  previewPaper.style.gap = `${Math.min(24, gapMm * 1.3)}px`;
  previewMeta.textContent = `${layout.paper}・${translate(layout.count === 4 ? '4 合 1' : '2 合 1')}`;
  previewPaper.replaceChildren();
  const sourcePages = files.flatMap((file) => Array.from({ length: file.pages }, (_, index) => ({ file, page: index + 1 })));
  for (let index = 0; index < layout.count; index += 1) {
    const source = duplicate ? sourcePages[0] : sourcePages[index];
    const slot = document.createElement('div');
    slot.className = 'nup-preview-slot';
    const page = document.createElement('span');
    page.className = 'nup-preview-page';
    page.setAttribute('aria-hidden', 'true');
    for (let line = 0; line < 5; line += 1) page.append(document.createElement('i'));
    const number = document.createElement('b');
    number.textContent = source ? String(source.page) : String(index + 1);
    if (source) slot.title = `${source.file.name} · ${source.page}`;
    else slot.classList.add('is-placeholder');
    slot.append(page, number);
    previewPaper.append(slot);
  }
}

function releaseResult() {
  if (outputUrl) URL.revokeObjectURL(outputUrl);
  outputUrl = '';
  lastResult = null;
  result.hidden = true;
  openLink.removeAttribute('href');
  previewFrame.removeAttribute('src');
  previewFrame.hidden = true;
  previewPaper.hidden = false;
}

function renderFiles(resetOutput = true) {
  fileList.replaceChildren();
  const pages = files.reduce((total, file) => total + file.pages, 0);
  fileCount.textContent = files.length ? message('fileCount', { files: files.length, pages }) : translate('尚未加入檔案');
  files.forEach((item, index) => {
    const row = document.createElement('li');
    row.className = 'nup-file-row';
    const main = document.createElement('div');
    main.className = 'nup-file-row-main';
    const name = document.createElement('strong');
    name.textContent = item.name;
    const meta = document.createElement('small');
    meta.textContent = message('fileMeta', { pages: item.pages, size: (item.file.size / 1024 / 1024).toFixed(2) });
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
      button.setAttribute('aria-label', message(action === 'remove' ? 'remove' : label === '↑' ? 'up' : 'down', { file: item.name }));
      actions.append(button);
    }
    row.append(main, actions);
    fileList.append(row);
  });
  processButton.disabled = files.length === 0;
  status.textContent = files.length ? translate('準備就緒') : translate('請先加入 PDF');
  if (resetOutput) releaseResult();
  updateSummary();
}

async function addFiles(fileCollection) {
  const incoming = [...fileCollection].filter((file) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name));
  if (!incoming.length) {
    status.textContent = translate('請選擇 PDF 檔案。');
    return;
  }
  processButton.disabled = true;
  status.textContent = translate('正在讀取 PDF 頁面資訊…');
  const recommendAfterLoad = files.length === 0 && !settingsTouched;
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
        status.textContent = message('loadError', { file: file.name });
      }
    }
  } finally {
    if (recommendAfterLoad) recommendSettings();
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
document.querySelector('#nup-clear-files').addEventListener('click', () => { files = []; settingsTouched = false; renderFiles(); });

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
  status.textContent = translate('正在產生合版 PDF…');
  releaseResult();
  try {
    const output = await createOutput();
    const blob = new Blob([output.bytes], { type: 'application/pdf' });
    outputUrl = URL.createObjectURL(blob);
    const base = files.length === 1 ? files[0].name.replace(/\.pdf$/i, '') : translate('合版文件');
    const filename = `${base}_${output.layout.count}合1_${output.layout.paper}.pdf`;
    openLink.href = outputUrl;
    previewFrame.src = `${outputUrl}#page=1&zoom=page-width&navpanes=0`;
    previewFrame.hidden = false;
    previewPaper.hidden = true;
    downloadButton.dataset.filename = filename;
    lastResult = { sheets: output.pages, paper: output.layout.paper };
    resultTitle.textContent = message('result', lastResult);
    result.hidden = false;
    status.textContent = translate('處理完成，可下載或在新分頁預覽。');
  } catch (error) {
    console.error('N-up PDF generation failed:', error);
    status.textContent = message('failed', { error: error.message || translate('處理失敗，請確認檔案是否有效。') });
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

workspace.querySelectorAll('input[name="nup-layout"], input[name="nup-paper"], input[name="nup-orientation"], #nup-margin, #nup-gap, #nup-cutline, #nup-duplicate')
  .forEach((input) => input.addEventListener('input', (event) => {
    if (event.isTrusted) settingsTouched = true;
    releaseResult();
    updateSummary();
  }));

globalThis.addEventListener('pdf-tool-language-change', () => {
  if (active) {
    title.textContent = translate('多頁合版');
    description.textContent = translate('將 2 或 4 個 PDF 頁面縮排到同一張紙，適合表單、講義與節省紙張列印。');
  }
  renderFiles(false);
  previewPaper.setAttribute('aria-label', translate('合版配置預覽'));
  if (lastResult) {
    resultTitle.textContent = message('result', lastResult);
    status.textContent = translate('處理完成，可下載或在新分頁預覽。');
  }
});

window.addEventListener('beforeunload', releaseResult);
renderFiles();
