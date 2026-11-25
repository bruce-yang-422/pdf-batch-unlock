const installPrompt = document.querySelector('#pwa-install-prompt');
const installButton = document.querySelector('#pwa-install-button');
const laterButton = document.querySelector('#pwa-install-later');
const notNeededButton = document.querySelector('#pwa-install-not-needed');
const installInstructions = document.querySelector('#pwa-install-instructions');
const footerInstallAction = document.querySelector('#footer-install-action');
const footerInstallButton = document.querySelector('#footer-install-button');

const installLabels = {
  'zh-Hant': '安裝 App', 'zh-Hans': '安装应用', en: 'Install app',
  ja: 'アプリをインストール', ko: '앱 설치', es: 'Instalar app',
  de: 'App installieren', fr: 'Installer l’appli', ru: 'Установить приложение',
  'pt-BR': 'Instalar app', th: 'ติดตั้งแอป', vi: 'Cài đặt ứng dụng', id: 'Instal aplikasi',
};

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
globalThis.addEventListener('pdf-tool-language-change', updateInstallLabel);
updateInstallLabel();
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
