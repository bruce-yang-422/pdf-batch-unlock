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
let touchSort = null;
let touchSortTimer = null;
let suppressPageClickUntil = 0;

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

function dispatchSortEvent(target, type) {
  target.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
}

function pageCardAtPoint(clientX, clientY) {
  return document.elementFromPoint(clientX, clientY)?.closest('.page-card') ?? null;
}

function clearTouchSort() {
  clearTimeout(touchSortTimer);
  touchSortTimer = null;
  pageGrid.querySelectorAll('.is-touch-dragging, .is-touch-drop-target').forEach((card) => {
    card.classList.remove('is-touch-dragging', 'is-touch-drop-target');
  });
  document.body.classList.remove('is-touch-sorting');
  touchSort = null;
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
  const target = pageCardAtPoint(touch.clientX, touch.clientY);
  if (!target || target === touchSort.source) return;

  if (touchSort.target !== target) {
    touchSort.target?.classList.remove('is-touch-drop-target');
    touchSort.target = target;
    target.classList.add('is-touch-drop-target');
  }
  dispatchSortEvent(target, 'dragover');
}, { passive: false });

function finishTouchSort(event) {
  if (!touchSort) return;
  const touch = touchByIdentifier(event.changedTouches, touchSort.identifier);
  if (!touch) return;

  clearTimeout(touchSortTimer);
  if (touchSort.active) {
    event.preventDefault();
    const source = touchSort.source;
    const target = pageCardAtPoint(touch.clientX, touch.clientY) ?? touchSort.target;
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

const tabObserver = new MutationObserver(updateResponsiveLayout);
tabs.forEach((tab) => tabObserver.observe(tab, { attributes: true, attributeFilter: ['class'] }));

const statusObserver = new MutationObserver(updateStatusPresentation);
statusObserver.observe(status, { attributes: true, attributeFilter: ['data-kind'], childList: true, characterData: true, subtree: true });

mobileQuery.addEventListener?.('change', updateResponsiveLayout);
updateHistoryState(false);
updateResponsiveLayout();
updateStatusPresentation();
