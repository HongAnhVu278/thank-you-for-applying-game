let popupEl = null;
let currentZone = null;
let feedbackEl = null;
let feedbackTimer = null;

function createPopup() {
    if (!bottomPanel) createBottomPanel();

    popupEl = document.createElement('div');
    popupEl.id = 'action-popup';
    bottomPanel.appendChild(popupEl);
}

function showPopup(zoneType) {
    if (currentZone === zoneType) return;
    currentZone = zoneType;

    if (!popupEl) createPopup();
    popupEl.innerHTML = '';
    popupEl.style.display = 'flex';

    const actions = ZONE_ACTIONS[zoneType];
    if (!actions) { hidePopup(); return; }

    actions.forEach(entry => {
        const btn = document.createElement('button');
        btn.textContent = entry.label;

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        const statText = typeof entry.stat === 'function' ? entry.stat() : entry.stat;
        tooltip.textContent = statText || 'No cost';
        btn.appendChild(tooltip);

        btn.addEventListener('click', () => {
            entry.action();
            refreshTooltips();
        });
        popupEl.appendChild(btn);
    });
}

function refreshTooltips() {
    if (!popupEl || !currentZone) return;
    const actions = ZONE_ACTIONS[currentZone];
    if (!actions) return;

    const buttons = popupEl.querySelectorAll('button');
    buttons.forEach((btn, i) => {
        const tooltip = btn.querySelector('.tooltip');
        if (tooltip && actions[i]) {
            const statText = typeof actions[i].stat === 'function' ? actions[i].stat() : actions[i].stat;
            tooltip.textContent = statText || 'No cost';
        }
    });
}

function hidePopup() {
    if (currentZone === null) return;
    currentZone = null;
    if (popupEl) {
        popupEl.style.display = 'none';
        popupEl.innerHTML = '';
    }
}

function showFeedback(message) {
    // append to the game's parent container so it overlay the tilemap
    const container = document.querySelector('canvas')?.parentElement;
    if (!container) return;

    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.id = 'feedback';
        container.appendChild(feedbackEl);
    }

    feedbackEl.textContent = message;
    feedbackEl.classList.remove('fade-out');
    feedbackEl.style.display = 'block';

    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
        feedbackEl.classList.add('fade-out');
        setTimeout(() => {
            feedbackEl.style.display = 'none';
            feedbackEl.classList.remove('fade-out');
        }, 500);
    }, 2000);
}
