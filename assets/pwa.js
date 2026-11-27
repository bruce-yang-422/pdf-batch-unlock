const installPrompt = document.querySelector('#pwa-install-prompt');
const installButton = document.querySelector('#pwa-install-button');
const laterButton = document.querySelector('#pwa-install-later');
const notNeededButton = document.querySelector('#pwa-install-not-needed');
const installInstructions = document.querySelector('#pwa-install-instructions');
const footerInstallAction = document.querySelector('#footer-install-action');
const footerInstallButton = document.querySelector('#footer-install-button');
const footerExtensionLink = document.querySelector('#footer-extension-link');
const mobileFooterQuery = window.matchMedia('(max-width: 640px)');
const extensionDialog = document.querySelector('#extension-download-dialog');
const extensionDialogTitle = document.querySelector('#extension-dialog-title');
const extensionDialogDescription = document.querySelector('#extension-dialog-description');
const extensionDialogCancel = document.querySelector('#extension-dialog-cancel');
const extensionCopyLink = document.querySelector('#extension-copy-link');
const extensionDownloadZip = document.querySelector('#extension-download-zip');

const installLabels = {
  'zh-Hant': '安裝 App', 'zh-Hans': '安装应用', en: 'Install app',
  ja: 'アプリをインストール', ko: '앱 설치', es: 'Instalar app',
  de: 'App installieren', fr: 'Installer l’appli', ru: 'Установить приложение',
  'pt-BR': 'Instalar app', th: 'ติดตั้งแอป', vi: 'Cài đặt ứng dụng', id: 'Instal aplikasi',
};

const extensionLinkLabels = {
  'zh-Hant': ['外掛 ZIP', '已複製外掛連結', '取得瀏覽器外掛', '手機通常無法直接安裝 ZIP，請選擇要如何處理連結。', '複製連結', '仍要下載 ZIP', '取消'],
  'zh-Hans': ['扩展 ZIP 选项', '已复制扩展链接', '获取浏览器扩展', '手机通常无法直接安装 ZIP，请选择如何处理链接。', '复制链接', '仍要下载 ZIP', '取消'],
  en: ['Extension ZIP options', 'Extension link copied', 'Get the browser extension', 'Phones usually cannot install this ZIP directly. Choose what to do with the link.', 'Copy link', 'Download ZIP anyway', 'Cancel'],
  ja: ['拡張機能 ZIP の操作', 'リンクをコピーしました', 'ブラウザー拡張機能を入手', 'スマートフォンでは通常 ZIP を直接インストールできません。リンクの扱いを選択してください。', 'リンクをコピー', 'ZIP をダウンロード', 'キャンセル'],
  ko: ['확장 ZIP 옵션', '링크를 복사했습니다', '브라우저 확장 프로그램 받기', '휴대폰에서는 일반적으로 ZIP을 직접 설치할 수 없습니다. 링크 처리 방법을 선택하세요.', '링크 복사', 'ZIP 다운로드', '취소'],
  es: ['Opciones del ZIP', 'Enlace copiado', 'Obtener la extensión', 'Normalmente no se puede instalar este ZIP directamente en un móvil. Elige qué hacer con el enlace.', 'Copiar enlace', 'Descargar ZIP', 'Cancelar'],
  de: ['ZIP-Optionen', 'Link kopiert', 'Browser-Erweiterung laden', 'Auf Smartphones lässt sich diese ZIP-Datei meist nicht direkt installieren. Wählen Sie eine Aktion.', 'Link kopieren', 'ZIP herunterladen', 'Abbrechen'],
  fr: ['Options du ZIP', 'Lien copié', 'Obtenir l’extension', 'Un téléphone ne peut généralement pas installer ce ZIP directement. Choisissez une action.', 'Copier le lien', 'Télécharger le ZIP', 'Annuler'],
  ru: ['Действия с ZIP', 'Ссылка скопирована', 'Получить расширение', 'На телефоне обычно нельзя установить ZIP напрямую. Выберите действие.', 'Копировать ссылку', 'Скачать ZIP', 'Отмена'],
  'pt-BR': ['Opções do ZIP', 'Link copiado', 'Obter a extensão', 'Celulares normalmente não instalam este ZIP diretamente. Escolha o que fazer com o link.', 'Copiar link', 'Baixar ZIP', 'Cancelar'],
  th: ['ตัวเลือก ZIP', 'คัดลอกลิงก์แล้ว', 'รับส่วนขยายเบราว์เซอร์', 'โดยทั่วไปโทรศัพท์ไม่สามารถติดตั้ง ZIP นี้โดยตรงได้ โปรดเลือกวิธีจัดการลิงก์', 'คัดลอกลิงก์', 'ดาวน์โหลด ZIP', 'ยกเลิก'],
  vi: ['Tùy chọn ZIP', 'Đã sao chép liên kết', 'Tải tiện ích trình duyệt', 'Điện thoại thường không thể cài trực tiếp tệp ZIP này. Hãy chọn cách xử lý liên kết.', 'Sao chép liên kết', 'Vẫn tải ZIP', 'Hủy'],
  id: ['Opsi ZIP', 'Tautan disalin', 'Dapatkan ekstensi', 'Ponsel biasanya tidak dapat memasang ZIP ini secara langsung. Pilih tindakan untuk tautan.', 'Salin tautan', 'Unduh ZIP', 'Batal'],
};

let extensionCopyTimer = null;

function extensionLabels() {
  return extensionLinkLabels[document.documentElement.lang] ?? extensionLinkLabels.en;
}

function updateExtensionLinkMode() {
  if (!footerExtensionLink) return;
  clearTimeout(extensionCopyTimer);
  const mobile = mobileFooterQuery.matches;
  footerExtensionLink.textContent = mobile ? extensionLabels()[0] : 'Chrome / Edge Extension v1.1.2 (ZIP)';
  footerExtensionLink.classList.toggle('is-copy-link', mobile);
  if (mobile) footerExtensionLink.setAttribute('role', 'button');
  else footerExtensionLink.removeAttribute('role');
}

function updateExtensionDialogLabels() {
  const labels = extensionLabels();
  extensionDialogTitle.textContent = labels[2];
  extensionDialogDescription.textContent = labels[3];
  extensionCopyLink.textContent = labels[4];
  extensionDownloadZip.textContent = labels[5];
  extensionDialogCancel.textContent = labels[6];
}

function openExtensionOptions(event) {
  if (!mobileFooterQuery.matches) return;
  event.preventDefault();
  updateExtensionDialogLabels();
  extensionDialog.showModal();
}

async function copyExtensionLink() {
  const url = footerExtensionLink.href;
  try {
    await navigator.clipboard.writeText(url);
    extensionDialog.close();
    footerExtensionLink.textContent = extensionLabels()[1];
    clearTimeout(extensionCopyTimer);
    extensionCopyTimer = window.setTimeout(updateExtensionLinkMode, 2200);
  } catch {
    extensionDialog.close();
    window.prompt(extensionLabels()[0], url);
  }
}

function downloadExtensionZip() {
  extensionDialog.close();
  const anchor = document.createElement('a');
  anchor.href = footerExtensionLink.href;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

function updateInstallLabel() {
  footerInstallButton.textContent = installLabels[document.documentElement.lang] ?? installLabels.en;
}

let deferredInstallPrompt = null;
const INSTALL_SUPPRESSION_KEY = 'pwa-install-suppressed-until';
const SIXTY_DAYS_IN_MS = 60 * 24 * 60 * 60 * 1000;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches
    || navigator.standalone === true;
}

function isIosDevice() {
  return /iPad|iPhone|iPod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function wasDismissedThisSession() {
  try {
    return sessionStorage.getItem('pwa-install-dismissed') === 'true';
  } catch {
    return false;
  }
}

function isSuppressed() {
  try {
    const suppressedUntil = Number(localStorage.getItem(INSTALL_SUPPRESSION_KEY));
    if (Number.isFinite(suppressedUntil) && suppressedUntil > Date.now()) return true;
    localStorage.removeItem(INSTALL_SUPPRESSION_KEY);
  } catch {
    // Continue normally when persistent storage is unavailable.
  }
  return false;
}

function hideInstallPrompt() {
  installPrompt.hidden = true;
  installPrompt.classList.remove('is-visible');
}

function showInstallPrompt({ manual = false } = {}) {
  if (isStandalone() || (!manual && (wasDismissedThisSession() || isSuppressed()))) return;
  installPrompt.hidden = false;
  requestAnimationFrame(() => installPrompt.classList.add('is-visible'));
}

function suppressInstallPrompt() {
  // Always suppress the current session as well. This keeps the prompt hidden
  // even if persistent storage is cleared or unavailable after this click.
  try {
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  } catch {
    // The prompt can still be hidden when storage is unavailable.
  }

  try {
    localStorage.setItem(INSTALL_SUPPRESSION_KEY, String(Date.now() + SIXTY_DAYS_IN_MS));
  } catch {
    // The session flag above still prevents the prompt from returning now.
  }
  hideInstallPrompt();
}

function dismissInstallPrompt() {
  try {
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  } catch {
    // The prompt can still be hidden when storage is unavailable.
  }
  hideInstallPrompt();
}

async function requestInstallation() {
  if (deferredInstallPrompt) {
    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        footerInstallAction.hidden = true;
        hideInstallPrompt();
      }
      else dismissInstallPrompt();
    } catch (error) {
      console.warn('無法開啟瀏覽器安裝視窗：', error);
      showInstallPrompt({ manual: true });
      installInstructions.textContent = '請使用瀏覽器選單中的「安裝應用程式」或「加入主畫面」。';
      installInstructions.hidden = false;
      installButton.hidden = true;
    }
    return;
  }

  showInstallPrompt({ manual: true });
  installInstructions.textContent = isIosDevice()
    ? '請點選瀏覽器的「分享」按鈕，再選擇「加入主畫面」。'
    : '請使用瀏覽器選單中的「安裝應用程式」或「加入主畫面」。';
  installInstructions.hidden = false;
  installButton.hidden = true;
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  footerInstallAction.hidden = isStandalone();
  installInstructions.hidden = true;
  installButton.hidden = false;
  showInstallPrompt();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  footerInstallAction.hidden = true;
  try {
    localStorage.removeItem(INSTALL_SUPPRESSION_KEY);
  } catch {
    // No cleanup is needed when storage is unavailable.
  }
  hideInstallPrompt();
});

installButton?.addEventListener('click', requestInstallation);
footerInstallButton.addEventListener('click', requestInstallation);
globalThis.addEventListener('pdf-tool-language-change', () => {
  updateInstallLabel();
  updateExtensionLinkMode();
});
updateInstallLabel();
updateExtensionLinkMode();
footerExtensionLink?.addEventListener('click', openExtensionOptions);
extensionCopyLink?.addEventListener('click', copyExtensionLink);
extensionDownloadZip?.addEventListener('click', downloadExtensionZip);
extensionDialog?.addEventListener('click', (event) => {
  if (event.target === extensionDialog) extensionDialog.close();
});
mobileFooterQuery.addEventListener?.('change', updateExtensionLinkMode);
footerInstallAction.hidden = isStandalone();
laterButton?.addEventListener('click', dismissInstallPrompt);
notNeededButton?.addEventListener('click', suppressInstallPrompt);

if (isIosDevice() && !isStandalone()) showInstallPrompt();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js', { scope: './' });
    } catch (error) {
      console.warn('無法註冊離線服務：', error);
    }
  });
}
