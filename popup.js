let popupEl = null;
let currentZone = null;
let feedbackEl = null;
let feedbackTimer = null;
let endScreenEl = null;

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

function showFeedback(message, type) {
    // append to the game's parent container so it overlay the tilemap
    const container = document.querySelector('canvas')?.parentElement;
    if (!container) return;

    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.id = 'feedback';
        const inner = document.createElement('div');
        inner.id = 'feedback-inner';
        feedbackEl.appendChild(inner);
        container.appendChild(feedbackEl);
    }

    const inner = feedbackEl.querySelector('#feedback-inner');
    inner.textContent = message;
    feedbackEl.classList.remove('fade-out', 'feedback-centered');

    if (type === 'burnout') {
        feedbackEl.classList.add('feedback-centered');
    }

    feedbackEl.style.display = 'flex';

    const duration = type === 'burnout' ? 4000 : 2000;

    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
        feedbackEl.classList.add('fade-out');
        setTimeout(() => {
            feedbackEl.style.display = 'none';
            feedbackEl.classList.remove('fade-out', 'feedback-centered');
        }, 500);
    }, duration);
}

function showEndScreen(type) {
    dayState.gameOver = true;
    hidePopup();

    const container = document.querySelector('canvas')?.parentElement;
    if (!container) return;

    endScreenEl = document.createElement('div');
    endScreenEl.id = 'end-screen';

    const messages = {
        win: { title: 'You got the job! 🤩💖', sub: 'All that effort paid off.' },
        'lose-hope': { title: 'You lost hope... 🥹🫂', sub: 'The search was too much.' },
        'lose-savings': { title: 'Out of money... 🥹🫂', sub: 'You couldn\'t afford to keep going.' }
    };

    const msg = messages[type] || messages['lose-hope'];

    const title = document.createElement('div');
    title.className = 'end-title';
    title.textContent = msg.title;

    const sub = document.createElement('div');
    sub.className = 'end-sub';
    sub.textContent = msg.sub;

    const statsDiv = document.createElement('div');
    statsDiv.className = 'end-stats';
    statsDiv.innerHTML =
        'Day ' + dayState.day +
        '&nbsp;&nbsp;|&nbsp;&nbsp;Hope ' + Math.round(stats.hope) +
        '&nbsp;&nbsp;|&nbsp;&nbsp;Skill ' + Math.round(stats.skill) +
        '&nbsp;&nbsp;|&nbsp;&nbsp;Progress ' + Math.round(stats.offerProgress);

    const btn = document.createElement('button');
    btn.className = 'end-btn';
    btn.textContent = 'Play Again';
    btn.addEventListener('click', () => location.reload());

    endScreenEl.appendChild(title);
    endScreenEl.appendChild(sub);
    endScreenEl.appendChild(statsDiv);
    endScreenEl.appendChild(btn);
    container.appendChild(endScreenEl);
}

function checkGameOver() {
    if (dayState.gameOver) return;
    if (stats.hope <= 0) {
        showEndScreen('lose-hope');
    } else if (stats.savings <= 0) {
        showEndScreen('lose-savings');
    }
}
