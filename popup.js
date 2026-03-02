let popupEl = null;
let currentZone = null;

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
        tooltip.textContent = entry.stat || 'No cost';
        btn.appendChild(tooltip);

        btn.addEventListener('click', entry.action);
        popupEl.appendChild(btn);
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
