const installPrompt = document.querySelector('#pwa-install-prompt');
const installButton = document.querySelector('#pwa-install-button');
const laterButton = document.querySelector('#pwa-install-later');
const installInstructions = document.querySelector('#pwa-install-instructions');

let deferredInstallPrompt = null;

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

function hideInstallPrompt() {
  installPrompt.hidden = true;
  installPrompt.classList.remove('is-visible');
}

function showInstallPrompt() {
  if (isStandalone() || wasDismissedThisSession()) return;
  installPrompt.hidden = false;
  requestAnimationFrame(() => installPrompt.classList.add('is-visible'));
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
      if (outcome === 'accepted') hideInstallPrompt();
      else dismissInstallPrompt();
    } catch (error) {
      console.warn('無法開啟瀏覽器安裝視窗：', error);
      installInstructions.textContent = '請使用瀏覽器選單中的「安裝應用程式」或「加入主畫面」。';
      installInstructions.hidden = false;
      installButton.hidden = true;
    }
    return;
  }

  if (isIosDevice()) {
    installInstructions.textContent = '請點選瀏覽器的「分享」按鈕，再選擇「加入主畫面」。';
    installInstructions.hidden = false;
    installButton.hidden = true;
  }
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  showInstallPrompt();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  hideInstallPrompt();
});

installButton?.addEventListener('click', requestInstallation);
laterButton?.addEventListener('click', dismissInstallPrompt);

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
