const card = document.querySelector('.card');
const tabs = [...document.querySelectorAll('.tool-tab')];
const workspace = document.querySelector('.workspace');
const activityPanel = document.querySelector('.activity-panel');
const queueSection = document.querySelector('#queue-section');
const pageManager = document.querySelector('#page-manager-section');
const pageGrid = document.querySelector('#page-grid');
const processButton = document.querySelector('#process-button');
const historySection = document.querySelector('#history-section');
const historyToggle = document.querySelector('#toggle-history');
const status = document.querySelector('#status');
const fileInput = document.querySelector('#file-input');
const fileList = document.querySelector('#file-list');
const dropTitle = document.querySelector('#drop-title');
const dropHint = document.querySelector('#drop-hint');
const mobileQuery = window.matchMedia('(max-width: 640px)');
const desktopQuery = window.matchMedia('(min-width: 901px)');
const compactUploadQuery = window.matchMedia('(max-width: 900px), (pointer: coarse)');
const watermarkLayout = document.querySelector('#watermark-layout');
const watermarkSource = document.querySelector('#watermark-source');
const watermarkTextOptions = document.querySelector('#watermark-text-options');
const watermarkImageOptions = document.querySelector('#watermark-image-options');
const watermarkImage = document.querySelector('#watermark-image');
const watermarkImageDropzone = document.querySelector('#watermark-image-dropzone');
const watermarkImageFeedback = document.querySelector('#watermark-image-feedback');
const watermarkFontLabel = document.querySelector('#watermark-font-label');
const watermarkSizeLabel = document.querySelector('#watermark-size-label');
const watermarkPosition = document.querySelector('#watermark-position');
const watermarkPositionLabel = document.querySelector('#watermark-position-label');
const watermarkSize = document.querySelector('#watermark-size');
const watermarkSizeValue = document.querySelector('#watermark-size-value');
const watermarkScale = document.querySelector('#watermark-scale');
const watermarkScaleValue = document.querySelector('#watermark-scale-value');
const addPageNumbers = document.querySelector('#add-page-numbers');
const pageNumberOptions = document.querySelector('#page-number-options');
const pageNumberSize = document.querySelector('#page-number-size');
const pageNumberSizeValue = document.querySelector('#page-number-size-value');
const watermarkText = document.querySelector('#watermark-text');
const watermarkFont = document.querySelector('#watermark-font');
const watermarkOpacity = document.querySelector('#watermark-opacity');
const watermarkAngle = document.querySelector('#watermark-angle');
const pageNumberFont = document.querySelector('#page-number-font');
const previewWatermarkLayer = document.querySelector('#preview-watermark-layer');
const previewPageNumber = document.querySelector('#preview-page-number');
const previewPaper = document.querySelector('#decoration-preview-paper');
const previewPdfPage = document.querySelector('#preview-pdf-page');
const previewDocumentPlaceholder = document.querySelector('#preview-document-placeholder');
const previewModeLabel = document.querySelector('#preview-mode-label');
const decorationPreview = document.querySelector('.decoration-preview');
const errorNotice = document.querySelector('#error-notice');
const errorSummary = document.querySelector('#error-summary');
const errorReason = document.querySelector('#error-reason');
const errorActions = document.querySelector('#error-actions');
const dismissError = document.querySelector('#dismiss-error');
const toolForm = document.querySelector('#tool-form');
const passwordInput = document.querySelector('#password');
const passwordLabel = document.querySelector('#password-label');
const togglePassword = document.querySelector('#toggle-password');
const confirmPasswordSection = document.querySelector('#confirm-password-section');
const confirmPassword = document.querySelector('#confirm-password');

const pageManagerHome = document.createComment('page-manager-home');
const processButtonHome = document.createComment('process-button-home');
const decorationPreviewHome = document.createComment('decoration-preview-home');
pageManager.before(pageManagerHome);
processButton.before(processButtonHome);
decorationPreview.before(decorationPreviewHome);

let toastTimer;
let touchSort = null;
let touchSortTimer = null;
let touchSortFrame = null;
let pendingTouchPoint = null;
let fileSortFrame = null;
let pendingFileSort = null;
let fileDropIndicator = null;
let suppressPageClickUntil = 0;
let previewImageUrl = null;
let previewImageAspectRatio = 1;
let previewImageToken = 0;
let previewPdfUrl = null;
let previewPdfToken = 0;
let previewPdfFile = null;
let previewPageWidth = 595;
let previewPageHeight = 842;
let lastCoreError = null;

const emptyDragImage = document.createElement('canvas');
emptyDragImage.width = 1;
emptyDragImage.height = 1;

function activeTool() {
  return tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.tool ?? 'unlock';
}

function updateUploadMode() {
  const clickOnly = compactUploadQuery.matches;
  card.classList.toggle('click-only-upload', clickOnly);

  if (clickOnly) {
    if (dropTitle.textContent !== '點一下選擇檔案') dropTitle.dataset.desktopCopy = dropTitle.textContent;
    if (dropHint.textContent !== '從裝置中選擇要處理的檔案') dropHint.dataset.desktopCopy = dropHint.textContent;
    dropTitle.textContent = '點一下選擇檔案';
    dropHint.textContent = '從裝置中選擇要處理的檔案';
  } else {
    if (dropTitle.dataset.desktopCopy) dropTitle.textContent = dropTitle.dataset.desktopCopy;
    if (dropHint.dataset.desktopCopy) dropHint.textContent = dropHint.dataset.desktopCopy;
    delete dropTitle.dataset.desktopCopy;
    delete dropHint.dataset.desktopCopy;
  }
}

function updateResponsiveLayout() {
  const pageMode = activeTool() === 'pages';
  const decorateMode = activeTool() === 'decorate';
  card.classList.toggle('page-manager-mode', pageMode);
  card.classList.toggle('decorate-mode', decorateMode);
  decorationPreview.hidden = !decorateMode;

  if (decorateMode && desktopQuery.matches) {
    queueSection.before(decorationPreview);
  } else {
    decorationPreviewHome.after(decorationPreview);
  }

  if (mobileQuery.matches && pageMode) {
    activityPanel.before(pageManager);
    pageGrid.after(processButton);
  } else {
    pageManagerHome.after(pageManager);
    processButtonHome.after(processButton);
  }

  updateUploadMode();
  updatePasswordMode();
}

function updatePasswordMode() {
  const protectMode = activeTool() === 'protect';
  passwordLabel.textContent = protectMode ? '新密碼' : 'PDF 密碼';
  passwordInput.placeholder = protectMode ? '輸入新的 PDF 開啟密碼' : '輸入 PDF 密碼';
  confirmPasswordSection.hidden = !protectMode;
  if (!protectMode) confirmPassword.value = '';
}

function updateHistoryState(expanded) {
  historySection.classList.toggle('is-collapsed', !expanded);
  historyToggle.setAttribute('aria-expanded', String(expanded));
  historyToggle.textContent = expanded ? '收合' : '展開';
}

function updateStatusPresentation() {
  clearTimeout(toastTimer);
  status.classList.remove('is-success-toast', 'is-toast-hidden');
  confirmPassword.disabled = status.dataset.kind === 'working';

  if (status.dataset.kind === 'success') {
    if (activeTool() === 'protect') confirmPassword.value = '';
    status.classList.add('is-success-toast');
    toastTimer = window.setTimeout(() => {
      status.classList.remove('is-success-toast');
      status.classList.add('is-toast-hidden');
    }, 4200);
    hideErrorNotice();
  } else if (status.dataset.kind === 'working') {
    lastCoreError = null;
    hideErrorNotice();
  } else if (status.dataset.kind === 'error') {
    showErrorNotice(status.textContent, lastCoreError?.message);
  }
}

toolForm.addEventListener('submit', (event) => {
  if (activeTool() !== 'protect' || passwordInput.value === confirmPassword.value) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  status.textContent = '兩次輸入的密碼不一致。';
  status.dataset.kind = 'error';
  showErrorNotice('無法為 PDF 加上密碼。', '兩次輸入的密碼不一致。');
  confirmPassword.focus();
}, { capture: true });

togglePassword.addEventListener('click', () => {
  confirmPassword.type = passwordInput.type;
});

function errorExplanation(message = '') {
  const text = message.toLowerCase();
  if (/不一致|do not match|not match|一致しません|일치하지|no coinciden|stimmen nicht|ne correspondent pas/.test(text)) return {
    reason: '兩次輸入的密碼不一致。',
    actions: ['確認兩個欄位完全相同後再試一次。'],
  };
  if (/password|密碼/.test(text)) return {
    reason: 'PDF 密碼不正確，或檔案使用目前工具無法處理的加密方式。',
    actions: ['重新確認密碼及大小寫。', '先使用「移除密碼」產生未加密 PDF，再執行其他工具。'],
  };
  if (/encrypt|加密/.test(text)) return {
    reason: '這份 PDF 仍受密碼或權限保護。',
    actions: ['先切換到「移除密碼」。', '使用解密後下載的 PDF 再試一次。'],
  };
  if (/memory|allocation|out of bounds|記憶體/.test(text)) return {
    reason: '瀏覽器可用記憶體不足，通常是頁數、圖片尺寸或輸出解析度太高。',
    actions: ['降低 JPG DPI 或浮水印圖片尺寸。', '分批處理頁面，並關閉其他占用記憶體的分頁。'],
  };
  if (/svg|doctype/.test(text)) return {
    reason: message || 'SVG 格式無效，或包含不允許的外部內容。',
    actions: ['確認檔案是有效 SVG。', '移除 DOCTYPE、外部圖片、腳本或 foreignObject 後再試。', '也可以先將 SVG 匯出成透明 PNG。'],
  };
  if (/png|jpe?g|image|圖片|浮水印/.test(text)) return {
    reason: message || '圖片格式無法解碼、檔案損毀，或超過 20 MB。',
    actions: ['重新匯出為 PNG 或 JPG。', '確認副檔名與實際格式一致，且檔案不超過 20 MB。'],
  };
  if (/invalid|parse|header|format|corrupt|損毀|格式/.test(text)) return {
    reason: '檔案格式無效、內容不完整，或 PDF 已經損毀。',
    actions: ['嘗試用 PDF 閱讀器重新另存一份。', '確認檔案可以正常開啟後再加入。'],
  };
  if (/download|下載/.test(text)) return {
    reason: '瀏覽器可能阻擋下載，或裝置儲存空間不足。',
    actions: ['允許此網站下載檔案。', '確認裝置有足夠空間後重試。'],
  };
  return {
    reason: message || '處理時發生未預期的錯誤。',
    actions: ['確認輸入檔案可以正常開啟。', '重新整理頁面後再試；若仍失敗，可改用較小的檔案。'],
  };
}

function showErrorNotice(summary, rawMessage = '') {
  const explanation = errorExplanation(rawMessage || summary);
  errorSummary.textContent = summary || '處理失敗。';
  errorReason.textContent = `可能原因：${explanation.reason}`;
  errorActions.replaceChildren(...explanation.actions.map((action) => {
    const item = document.createElement('li');
    item.textContent = action;
    return item;
  }));
  errorNotice.hidden = false;
}

function hideErrorNotice() {
  errorNotice.hidden = true;
}

function previewPosition() {
  const horizontalEdge = Math.max(1, 28 / previewPageWidth * 100);
  const verticalEdge = Math.max(1, 28 / previewPageHeight * 100);
  return {
    center: { left: '50%', top: '50%', translate: 'translate(-50%, -50%)' },
    'top-left': { left: `${horizontalEdge}%`, top: `${verticalEdge}%`, translate: 'translate(0, 0)' },
    'top-right': { left: `${100 - horizontalEdge}%`, top: `${verticalEdge}%`, translate: 'translate(-100%, 0)' },
    'bottom-left': { left: `${horizontalEdge}%`, top: `${100 - verticalEdge}%`, translate: 'translate(0, -100%)' },
    'bottom-right': { left: `${100 - horizontalEdge}%`, top: `${100 - verticalEdge}%`, translate: 'translate(-100%, -100%)' },
  }[watermarkPosition.value];
}

function createPreviewMark({ repeated = false } = {}) {
  const imageMode = watermarkSource.value === 'image';
  if (imageMode && !previewImageUrl) return null;
  if (!imageMode && !watermarkText.value.trim()) return null;

  const mark = document.createElement('div');
  mark.className = 'preview-watermark-mark';
  if (imageMode) {
    const image = document.createElement('img');
    image.src = previewImageUrl;
    image.alt = '';
    mark.append(image);
  } else {
    mark.textContent = watermarkText.value.trim();
    mark.style.fontFamily = watermarkFont.value;
    const baseSize = 9 + (Number(watermarkSize.value) - 12) / 148 * 27;
    mark.style.fontSize = `${Math.max(8, baseSize * (repeated ? 0.72 : 1))}px`;
  }
  return mark;
}

function renderRepeatedImagePreview(angle, scale) {
  const widthPercent = Math.min(90, Math.max(8, 30 * scale));
  const pageAspectRatio = previewPageWidth / previewPageHeight;
  const heightPercent = widthPercent * pageAspectRatio / Math.max(0.01, previewImageAspectRatio);
  const horizontalStep = widthPercent + Math.max(34 / previewPageWidth * 100, 6);
  const verticalStep = heightPercent + Math.max(42 / previewPageHeight * 100, 7);
  let row = 0;
  let count = 0;

  for (let top = -heightPercent; top < 100 + heightPercent && count < 160; top += verticalStep) {
    const rowOffset = row % 2 ? -horizontalStep / 2 : 0;
    for (let left = rowOffset - widthPercent; left < 100 + widthPercent && count < 160; left += horizontalStep) {
      const mark = createPreviewMark({ repeated: true });
      if (!mark) return;
      mark.style.left = `${left}%`;
      mark.style.top = `${top}%`;
      mark.style.width = `${widthPercent}%`;
      mark.style.transform = `rotate(${angle}deg)`;
      previewWatermarkLayer.append(mark);
      count += 1;
    }
    row += 1;
  }
}

function renderDecorationPreview() {
  if (!previewWatermarkLayer) return;
  previewWatermarkLayer.replaceChildren();
  const repeated = watermarkLayout.value === 'repeat';
  const imageMode = watermarkSource.value === 'image';
  previewWatermarkLayer.classList.toggle('is-repeat', repeated);
  previewWatermarkLayer.classList.toggle('is-image-repeat', repeated && imageMode);
  previewWatermarkLayer.style.opacity = String(Number(watermarkOpacity.value) / 100);
  previewWatermarkLayer.style.transform = '';
  const angle = Number(watermarkAngle.value);
  const scale = Number(watermarkScale.value) / 100;

  if (repeated) {
    if (imageMode) {
      renderRepeatedImagePreview(angle, scale);
    } else {
      previewWatermarkLayer.style.transform = `rotate(${angle}deg) scale(${Math.min(1.35, Math.max(0.65, scale))})`;
      for (let index = 0; index < 15; index += 1) {
        const mark = createPreviewMark({ repeated: true });
        if (!mark) break;
        previewWatermarkLayer.append(mark);
      }
    }
  } else {
    const mark = createPreviewMark();
    if (mark) {
      const position = previewPosition();
      mark.style.left = position.left;
      mark.style.top = position.top;
      if (imageMode) mark.style.width = `${Math.min(90, Math.max(8, 30 * scale))}%`;
      const textScale = watermarkSource.value === 'text' ? Math.min(3, Math.max(0.25, scale)) : 1;
      mark.style.transform = `${position.translate} rotate(${angle}deg) scale(${textScale})`;
      previewWatermarkLayer.append(mark);
    }
  }

  previewPageNumber.textContent = addPageNumbers.checked ? '1' : '';
  previewPageNumber.style.fontFamily = {
    helvetica: 'Arial, sans-serif',
    times: 'Times New Roman, serif',
    courier: 'Courier New, monospace',
  }[pageNumberFont.value];
  previewPageNumber.style.fontSize = `${8 + (Number(pageNumberSize.value) - 8) / 2}px`;
  previewPageNumber.style.bottom = `${Math.max(1, 16 / previewPageHeight * 100)}%`;
}

function resetPdfPagePreview() {
  previewPdfToken += 1;
  previewPdfFile = null;
  if (previewPdfUrl) URL.revokeObjectURL(previewPdfUrl);
  previewPdfUrl = null;
  previewPageWidth = 595;
  previewPageHeight = 842;
  previewPdfPage.removeAttribute('src');
  previewPdfPage.hidden = true;
  previewDocumentPlaceholder.hidden = false;
  previewPaper.style.aspectRatio = '210 / 297';
  previewModeLabel.textContent = '尚未載入 PDF';
  renderDecorationPreview();
}

async function renderPdfPagePreview(file) {
  if (!file || activeTool() !== 'decorate' || !/\.pdf$/i.test(file.name)) return;
  const token = ++previewPdfToken;
  previewPdfFile = file;
  previewModeLabel.textContent = '正在載入第 1 頁…';
  let pdfDocument;

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (token !== previewPdfToken) return;
    const loadingTask = globalThis.pdfjsLib.getDocument({ data: bytes });
    pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const renderScale = Math.min(2.5, Math.max(1, 720 / baseViewport.width));
    const viewport = page.getViewport({ scale: renderScale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const context = canvas.getContext('2d', { alpha: false });
    await page.render({ canvasContext: context, viewport, background: '#ffffff' }).promise;
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error('無法建立 PDF 預覽圖片。')), 'image/jpeg', 0.86);
    });
    canvas.width = 0;
    canvas.height = 0;
    if (token !== previewPdfToken) return;

    if (previewPdfUrl) URL.revokeObjectURL(previewPdfUrl);
    previewPdfUrl = URL.createObjectURL(blob);
    previewPageWidth = baseViewport.width;
    previewPageHeight = baseViewport.height;
    previewPaper.style.aspectRatio = `${previewPageWidth} / ${previewPageHeight}`;
    previewPdfPage.src = previewPdfUrl;
    previewPdfPage.hidden = false;
    previewDocumentPlaceholder.hidden = true;
    previewModeLabel.textContent = 'PDF 第 1 頁';
    renderDecorationPreview();
  } catch (error) {
    if (token !== previewPdfToken) return;
    resetPdfPagePreview();
    showErrorNotice('無法載入 PDF 第一頁預覽。', error?.message ?? String(error));
  } finally {
    await pdfDocument?.destroy?.();
  }
}

async function updatePreviewImage() {
  const token = ++previewImageToken;
  if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
  previewImageUrl = null;
  previewImageAspectRatio = 1;
  if (!validateWatermarkImage()) {
    renderDecorationPreview();
    return;
  }
  const file = watermarkImage.files?.[0];
  if (!file) {
    renderDecorationPreview();
    return;
  }
  try {
    const prepared = await globalThis.__preparePdfWatermarkImage(file);
    if (token !== previewImageToken) return;
    const url = URL.createObjectURL(new Blob([prepared.bytes], { type: prepared.type }));
    const image = new Image();
    image.src = url;
    await image.decode();
    if (token !== previewImageToken) {
      URL.revokeObjectURL(url);
      return;
    }
    previewImageUrl = url;
    previewImageAspectRatio = image.naturalWidth / Math.max(1, image.naturalHeight);
    hideErrorNotice();
  } catch (error) {
    showErrorNotice('無法建立圖片浮水印預覽。', error?.message ?? String(error));
  }
  renderDecorationPreview();
}

function updateDecorationOptions() {
  if (!watermarkLayout) return;
  const imageMode = watermarkSource.value === 'image';
  const repeated = watermarkLayout.value === 'repeat';
  watermarkTextOptions.hidden = imageMode;
  watermarkImageOptions.hidden = !imageMode;
  watermarkFontLabel.hidden = imageMode;
  watermarkSizeLabel.hidden = imageMode;
  watermarkPosition.disabled = repeated;
  watermarkPositionLabel.classList.toggle('is-disabled-option', repeated);
  watermarkPositionLabel.title = repeated ? '重複模式會自動鋪滿頁面，不使用單一位置。' : '';
  watermarkSizeValue.textContent = `${watermarkSize.value} pt`;
  watermarkScaleValue.textContent = `${watermarkScale.value}%`;
  pageNumberOptions.hidden = !addPageNumbers.checked;
  pageNumberSizeValue.textContent = `${pageNumberSize.value} pt`;
  renderDecorationPreview();
}

function removeUnsafeSvgContent(svgDocument) {
  svgDocument.querySelectorAll('script, foreignObject').forEach((node) => node.remove());
  svgDocument.querySelectorAll('*').forEach((node) => {
    for (const attribute of [...node.attributes]) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith('on')) {
        node.removeAttribute(attribute.name);
        continue;
      }
      if ((name === 'href' || name === 'xlink:href') && !value.startsWith('#') && !value.startsWith('data:image/')) {
        node.removeAttribute(attribute.name);
        continue;
      }
      if (/url\(\s*['"]?(?:https?:|\/\/)/i.test(value) || /@import/i.test(value)) {
        node.removeAttribute(attribute.name);
      }
    }
  });
  svgDocument.querySelectorAll('style').forEach((style) => {
    style.textContent = style.textContent
      .replace(/@import[^;]+;?/gi, '')
      .replace(/url\(\s*['"]?(?:https?:|\/\/)[^)]+\)/gi, 'none');
  });
}

function svgCanvasSize(svg) {
  const viewBox = (svg.getAttribute('viewBox') ?? '').trim().split(/[\s,]+/).map(Number);
  const widthAttribute = svg.getAttribute('width') ?? '';
  const heightAttribute = svg.getAttribute('height') ?? '';
  let width = widthAttribute.trim().endsWith('%') ? Number.NaN : Number.parseFloat(widthAttribute);
  let height = heightAttribute.trim().endsWith('%') ? Number.NaN : Number.parseFloat(heightAttribute);
  if ((!Number.isFinite(width) || width <= 0) && viewBox.length === 4) width = viewBox[2];
  if ((!Number.isFinite(height) || height <= 0) && viewBox.length === 4) height = viewBox[3];
  if (!Number.isFinite(width) || width <= 0) width = 1200;
  if (!Number.isFinite(height) || height <= 0) height = 800;
  const scale = Math.min(1, 2400 / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

async function svgFileToPng(file) {
  const source = await file.text();
  if (/<!DOCTYPE/i.test(source)) throw new Error('SVG 不支援 DOCTYPE。');
  const svgDocument = new DOMParser().parseFromString(source, 'image/svg+xml');
  if (svgDocument.querySelector('parsererror') || svgDocument.documentElement.localName !== 'svg') {
    throw new Error('SVG 格式無效。');
  }
  removeUnsafeSvgContent(svgDocument);
  if (!svgDocument.documentElement.hasAttribute('xmlns')) {
    svgDocument.documentElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  const { width, height } = svgCanvasSize(svgDocument.documentElement);
  const safeSvg = new XMLSerializer().serializeToString(svgDocument.documentElement);
  const url = URL.createObjectURL(new Blob([safeSvg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error('無法轉換 SVG。')), 'image/png');
    });
    canvas.width = 0;
    canvas.height = 0;
    return { bytes: await blob.arrayBuffer(), type: 'image/png' };
  } finally {
    URL.revokeObjectURL(url);
  }
}

globalThis.__preparePdfWatermarkImage = async (file) => {
  if (!file || file.size > 20 * 1024 * 1024) throw new Error('浮水印圖片不可超過 20 MB。');
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (file.type === 'image/svg+xml' || extension === 'svg') return svgFileToPng(file);
  if (file.type === 'image/png' || extension === 'png') return { bytes: await file.arrayBuffer(), type: 'image/png' };
  if (file.type === 'image/jpeg' || extension === 'jpg' || extension === 'jpeg') {
    return { bytes: await file.arrayBuffer(), type: 'image/jpeg' };
  }
  throw new Error('只支援 PNG、JPG 或 SVG 浮水印圖片。');
};

function validateWatermarkImage() {
  const file = watermarkImage.files?.[0];
  if (!file) {
    watermarkImageFeedback.textContent = '支援 PNG、JPG、SVG，建議使用透明背景 PNG 或 SVG，最大 20 MB。';
    watermarkImageFeedback.dataset.kind = '';
    return true;
  }
  const validType = /\.(png|jpe?g|svg)$/i.test(file.name) || ['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type);
  if (!validType || file.size > 20 * 1024 * 1024) {
    watermarkImage.value = '';
    watermarkImageFeedback.textContent = validType ? '圖片不可超過 20 MB。' : '只支援 PNG、JPG 或 SVG。';
    watermarkImageFeedback.dataset.kind = 'error';
    showErrorNotice('浮水印圖片無法使用。', watermarkImageFeedback.textContent);
    return false;
  }
  const formattedSize = file.size >= 1024 * 1024
    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    : `${Math.max(1, Math.round(file.size / 1024))} KB`;
  watermarkImageFeedback.textContent = `已選擇：${file.name}（${formattedSize}）`;
  watermarkImageFeedback.dataset.kind = 'success';
  return true;
}

function isFileDrag(event) {
  return [...(event.dataTransfer?.types ?? [])].includes('Files');
}

function blockCompactFileDrop(event) {
  if (!isFileDrag(event)) return;
  const target = event.target instanceof Element
    ? event.target.closest('#drop-zone, #watermark-image-dropzone')
    : null;
  if (!target) return;
  const shouldBlock = target === watermarkImageDropzone || compactUploadQuery.matches;
  if (!shouldBlock) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  target.classList.remove('is-dragging', 'is-dragover');
}

function dispatchSortEvent(target, type) {
  target.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
}

function clearFileDropIndicator() {
  if (fileSortFrame !== null) cancelAnimationFrame(fileSortFrame);
  fileSortFrame = null;
  pendingFileSort = null;
  fileDropIndicator?.classList.remove('drop-before', 'drop-after');
  fileDropIndicator = null;
}

function updateFileDropIndicator() {
  fileSortFrame = null;
  const pending = pendingFileSort;
  pendingFileSort = null;
  if (!pending?.target?.isConnected) return;

  const rect = pending.target.getBoundingClientRect();
  const position = pending.clientY > rect.top + rect.height / 2 ? 'drop-after' : 'drop-before';
  if (fileDropIndicator !== pending.target) {
    fileDropIndicator?.classList.remove('drop-before', 'drop-after');
    fileDropIndicator = pending.target;
  }
  fileDropIndicator.classList.toggle('drop-before', position === 'drop-before');
  fileDropIndicator.classList.toggle('drop-after', position === 'drop-after');
}

function setLightweightDragImage(event) {
  if (!event.dataTransfer) return;
  event.dataTransfer.setDragImage(emptyDragImage, 0, 0);
  document.body.classList.add('is-native-sorting');
}

document.addEventListener('dragstart', (event) => {
  const source = event.target instanceof Element
    ? event.target.closest('.page-card[draggable="true"], .drag-handle[draggable="true"]')
    : null;
  if (source) setLightweightDragImage(event);
}, { capture: true });

document.addEventListener('dragend', () => {
  document.body.classList.remove('is-native-sorting');
  clearFileDropIndicator();
}, { capture: true });

document.addEventListener('selectstart', (event) => {
  if (document.body.classList.contains('is-native-sorting')) event.preventDefault();
}, { capture: true });

fileList.addEventListener('dragover', (event) => {
  const source = fileList.querySelector('.file-row.is-dragging');
  const target = event.target instanceof Element ? event.target.closest('.file-row') : null;
  if (!source || !target) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  if (target === source) {
    clearFileDropIndicator();
    return;
  }

  pendingFileSort = { target, clientY: event.clientY };
  if (fileSortFrame === null) fileSortFrame = requestAnimationFrame(updateFileDropIndicator);
}, { capture: true });

fileList.addEventListener('drop', clearFileDropIndicator, { capture: true });

function pageCardAtPoint(clientX, clientY) {
  return document.elementFromPoint(clientX, clientY)?.closest('.page-card') ?? null;
}

function clearTouchSort() {
  clearTimeout(touchSortTimer);
  touchSortTimer = null;
  if (touchSortFrame !== null) cancelAnimationFrame(touchSortFrame);
  touchSortFrame = null;
  pendingTouchPoint = null;
  pageGrid.querySelectorAll('.is-touch-dragging, .is-touch-drop-target').forEach((card) => {
    card.classList.remove('is-touch-dragging', 'is-touch-drop-target');
  });
  document.body.classList.remove('is-touch-sorting');
  touchSort = null;
}

function updateTouchSortTarget() {
  touchSortFrame = null;
  const point = pendingTouchPoint;
  pendingTouchPoint = null;
  if (!touchSort?.active || !point) return;

  const target = pageCardAtPoint(point.clientX, point.clientY);
  if (!target || target === touchSort.source || touchSort.target === target) return;
  touchSort.target?.classList.remove('is-touch-drop-target');
  touchSort.target = target;
  target.classList.add('is-touch-drop-target');
}

function touchByIdentifier(touchList, identifier) {
  return [...touchList].find((touch) => touch.identifier === identifier);
}

pageGrid.addEventListener('touchstart', (event) => {
  if (event.touches.length !== 1 || event.target.closest('button')) return;
  const source = event.target.closest('.page-card[draggable="true"]');
  if (!source) return;

  const touch = event.changedTouches[0];
  touchSort = {
    identifier: touch.identifier,
    source,
    target: source,
    startX: touch.clientX,
    startY: touch.clientY,
    active: false,
  };

  touchSortTimer = window.setTimeout(() => {
    if (!touchSort || touchSort.source !== source) return;
    touchSort.active = true;
    source.classList.add('is-touch-dragging');
    document.body.classList.add('is-touch-sorting');
    dispatchSortEvent(source, 'dragstart');
    navigator.vibrate?.(20);
  }, 260);
}, { passive: true });

pageGrid.addEventListener('touchmove', (event) => {
  if (!touchSort) return;
  const touch = touchByIdentifier(event.changedTouches, touchSort.identifier);
  if (!touch) return;

  if (!touchSort.active) {
    const distance = Math.hypot(touch.clientX - touchSort.startX, touch.clientY - touchSort.startY);
    if (distance > 10) clearTouchSort();
    return;
  }

  event.preventDefault();
  pendingTouchPoint = { clientX: touch.clientX, clientY: touch.clientY };
  if (touchSortFrame === null) touchSortFrame = requestAnimationFrame(updateTouchSortTarget);
}, { passive: false });

function finishTouchSort(event) {
  if (!touchSort) return;
  const touch = touchByIdentifier(event.changedTouches, touchSort.identifier);
  if (!touch) return;

  clearTimeout(touchSortTimer);
  if (touchSort.active) {
    event.preventDefault();
    if (touchSortFrame !== null) cancelAnimationFrame(touchSortFrame);
    touchSortFrame = null;
    pendingTouchPoint = null;
    const source = touchSort.source;
    const hitTarget = pageCardAtPoint(touch.clientX, touch.clientY);
    const target = hitTarget && hitTarget !== source ? hitTarget : touchSort.target;
    if (target && target !== source) dispatchSortEvent(target, 'drop');
    dispatchSortEvent(source, 'dragend');
    suppressPageClickUntil = Date.now() + 500;
  }
  clearTouchSort();
}

pageGrid.addEventListener('touchend', finishTouchSort, { passive: false });
pageGrid.addEventListener('touchcancel', clearTouchSort, { passive: true });
pageGrid.addEventListener('contextmenu', (event) => {
  if (touchSort?.active) event.preventDefault();
});
pageGrid.addEventListener('click', (event) => {
  if (Date.now() < suppressPageClickUntil) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);

historyToggle.addEventListener('click', () => {
  updateHistoryState(historyToggle.getAttribute('aria-expanded') !== 'true');
});

watermarkLayout?.addEventListener('change', updateDecorationOptions);
watermarkSource?.addEventListener('change', updateDecorationOptions);
watermarkImage?.addEventListener('change', updatePreviewImage);
for (const eventName of ['dragenter', 'dragover', 'drop']) {
  document.addEventListener(eventName, blockCompactFileDrop, { capture: true });
}
fileInput.addEventListener('change', (event) => {
  const [file] = event.target.files ?? [];
  if (file) renderPdfPagePreview(file);
}, { capture: true });
document.addEventListener('drop', (event) => {
  if (compactUploadQuery.matches || activeTool() !== 'decorate') return;
  const target = event.target instanceof Element ? event.target.closest('#drop-zone') : null;
  const [file] = event.dataTransfer?.files ?? [];
  if (target && file) renderPdfPagePreview(file);
}, { capture: true });
watermarkText?.addEventListener('input', renderDecorationPreview);
watermarkFont?.addEventListener('change', renderDecorationPreview);
watermarkSize?.addEventListener('input', updateDecorationOptions);
watermarkScale?.addEventListener('input', updateDecorationOptions);
watermarkOpacity?.addEventListener('input', renderDecorationPreview);
watermarkPosition?.addEventListener('change', renderDecorationPreview);
watermarkAngle?.addEventListener('change', renderDecorationPreview);
addPageNumbers?.addEventListener('change', updateDecorationOptions);
pageNumberFont?.addEventListener('change', renderDecorationPreview);
pageNumberSize?.addEventListener('input', updateDecorationOptions);
dismissError?.addEventListener('click', hideErrorNotice);

globalThis.addEventListener('pdf-tool-error', (event) => {
  lastCoreError = event.detail ?? null;
  showErrorNotice('PDF 處理失敗。', lastCoreError?.message);
});

globalThis.addEventListener('error', (event) => {
  if (!event.error) return;
  showErrorNotice('頁面執行時發生錯誤。', event.error?.message ?? event.message);
});

globalThis.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message ?? String(event.reason ?? '未知錯誤');
  showErrorNotice('頁面執行時發生未預期的錯誤。', message);
});

const tabObserver = new MutationObserver(updateResponsiveLayout);
tabs.forEach((tab) => tabObserver.observe(tab, { attributes: true, attributeFilter: ['class'] }));

const statusObserver = new MutationObserver(updateStatusPresentation);
statusObserver.observe(status, { attributes: true, attributeFilter: ['data-kind'], childList: true, characterData: true, subtree: true });

const fileListObserver = new MutationObserver(() => {
  if (previewPdfFile && !fileList.querySelector('.file-row')) resetPdfPagePreview();
});
fileListObserver.observe(fileList, { childList: true });

mobileQuery.addEventListener?.('change', updateResponsiveLayout);
desktopQuery.addEventListener?.('change', updateResponsiveLayout);
compactUploadQuery.addEventListener?.('change', updateUploadMode);
updateHistoryState(false);
updateResponsiveLayout();
updateStatusPresentation();
updateDecorationOptions();
