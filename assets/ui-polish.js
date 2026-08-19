const card = document.querySelector('.card');
const tabs = [...document.querySelectorAll('.tool-tab')];
const workspace = document.querySelector('.workspace');
const activityPanel = document.querySelector('.activity-panel');
const pageManager = document.querySelector('#page-manager-section');
const pageGrid = document.querySelector('#page-grid');
const processButton = document.querySelector('#process-button');
const historySection = document.querySelector('#history-section');
const historyToggle = document.querySelector('#toggle-history');
const status = document.querySelector('#status');
const mobileQuery = window.matchMedia('(max-width: 640px)');

const pageManagerHome = document.createComment('page-manager-home');
const processButtonHome = document.createComment('process-button-home');
pageManager.before(pageManagerHome);
processButton.before(processButtonHome);

let toastTimer;

function activeTool() {
  return tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.tool ?? 'unlock';
}

function updateResponsiveLayout() {
  const pageMode = activeTool() === 'pages';
  card.classList.toggle('page-manager-mode', pageMode);

  if (mobileQuery.matches && pageMode) {
    activityPanel.before(pageManager);
    pageGrid.after(processButton);
  } else {
    pageManagerHome.after(pageManager);
    processButtonHome.after(processButton);
  }
}

function updateHistoryState(expanded) {
  historySection.classList.toggle('is-collapsed', !expanded);
  historyToggle.setAttribute('aria-expanded', String(expanded));
  historyToggle.textContent = expanded ? '收合' : '展開';
}

function updateStatusPresentation() {
  clearTimeout(toastTimer);
  status.classList.remove('is-success-toast', 'is-toast-hidden');

  if (status.dataset.kind === 'success') {
    status.classList.add('is-success-toast');
    toastTimer = window.setTimeout(() => {
      status.classList.remove('is-success-toast');
      status.classList.add('is-toast-hidden');
    }, 4200);
  }
}

historyToggle.addEventListener('click', () => {
  updateHistoryState(historyToggle.getAttribute('aria-expanded') !== 'true');
});

const tabObserver = new MutationObserver(updateResponsiveLayout);
tabs.forEach((tab) => tabObserver.observe(tab, { attributes: true, attributeFilter: ['class'] }));

const statusObserver = new MutationObserver(updateStatusPresentation);
statusObserver.observe(status, { attributes: true, attributeFilter: ['data-kind'], childList: true, characterData: true, subtree: true });

mobileQuery.addEventListener?.('change', updateResponsiveLayout);
updateHistoryState(false);
updateResponsiveLayout();
updateStatusPresentation();
