// Heads-Up Display
let hudEl = null;
let bottomPanel = null;
let dayInfoEl = null;

const HUD_ITEMS = [
    { key: 'hope',          label: 'Hope',     color: '#f472b6' },
    { key: 'skill',         label: 'Skill',    color: '#60a5fa' },
    { key: 'savings',       label: 'Savings',  color: '#facc15' },
    { key: 'offerProgress', label: 'Progress', color: '#4ade80' }
];

function createBottomPanel() {
    bottomPanel = document.createElement('div');
    bottomPanel.id = 'bottom-panel';
    const canvas = document.querySelector('canvas');
    if (canvas && canvas.parentElement) {
        canvas.parentElement.style.position = 'relative';
        canvas.parentElement.style.overflow = 'hidden';
        canvas.parentElement.style.width = GAME_WIDTH + 'px';
        canvas.parentElement.style.height = GAME_HEIGHT + 'px';
        canvas.parentElement.appendChild(bottomPanel);
    } else {
        document.body.appendChild(bottomPanel);
    }
    return bottomPanel;
}

function createHud() {
    if (!bottomPanel) createBottomPanel();

    // day bar: top of bottom panel, above hud + options, below tilemap
    dayInfoEl = document.createElement('div');
    dayInfoEl.id = 'day-bar';
    bottomPanel.appendChild(dayInfoEl);

    // hud below the day bar
    hudEl = document.createElement('div');
    hudEl.id = 'hud';

    HUD_ITEMS.forEach(item => {
        const row = document.createElement('div');
        row.className = 'hud-row';

        const label = document.createElement('span');
        label.className = 'hud-label';
        label.textContent = item.label;

        const barBg = document.createElement('div');
        barBg.className = 'hud-bar-bg';

        const barFill = document.createElement('div');
        barFill.className = 'hud-bar-fill';
        barFill.id = `hud-bar-${item.key}`;
        barFill.style.backgroundColor = item.color;

        const value = document.createElement('span');
        value.className = 'hud-value';
        value.id = `hud-val-${item.key}`;

        barBg.appendChild(barFill);
        row.appendChild(label);
        row.appendChild(barBg);
        row.appendChild(value);
        hudEl.appendChild(row);
    });

    bottomPanel.appendChild(hudEl);
    updateHud();
}

function updateHud() {
    if (!hudEl) return;

    // update day info
    if (dayInfoEl) {
        const secsLeft = Math.max(0, Math.ceil(DAY_LENGTH - dayState.dayTimer));
        dayInfoEl.textContent = 'Day ' + dayState.day + '  |  ' + dayState.actionsLeft + ' actions  |  ' + secsLeft + 's';
    }

    const maxValues = {
        hope: HOPE_MAX,
        skill: SKILL_MAX,
        savings: 500,
        offerProgress: OFFER_PROGRESS_MAX
    };

    HUD_ITEMS.forEach(item => {
        const val = stats[item.key];
        const max = maxValues[item.key];
        const pct = Math.min(100, (val / max) * 100);

        const bar = document.getElementById(`hud-bar-${item.key}`);
        const valEl = document.getElementById(`hud-val-${item.key}`);

        if (bar) bar.style.width = pct + '%';
        if (valEl) {
            if (item.key === 'savings') {
                valEl.textContent = '$' + val;
            } else {
                valEl.textContent = Math.round(val);
            }
        }
    });
}
