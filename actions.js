const ZONE_ACTIONS = {
    work: [
        { label: 'Apply for Job', stat: 'Hope −5', action: applyForJob },
        { label: 'Check Email', stat: () => stats.pendingApplications > 0 ? stats.pendingApplications + ' pending' : 'No mail', action: checkEmail },
        { label: 'Practice Skills', stat: 'Skill +6, Hope −2', action: practiceSkills }
    ],
    gym: [
        { label: 'Workout', stat: 'Hope +6', action: workout }
    ],
    play: [
        { label: 'Talk to Friend', stat: 'Hope +8', action: talkToFriend }
    ]
};

function advanceDay() {
    // daily baseline drain
    let hopeDrain = DAILY_HOPE_DRAIN;

    // hope drain if there are pending emails
    hopeDrain += stats.pendingApplications * PENDING_APP_HOPE_DRAIN;

    stats.hope -= hopeDrain;
    stats.savings -= DAILY_SAVINGS_DRAIN;

    // reset day
    dayState.day += 1;
    dayState.actionsLeft = ACTIONS_PER_DAY;
    dayState.dayTimer = 0;

    clampStats();
    updateHud();

    // popup feedback message
    let msg = 'Day ' + dayState.day + ' — Hope −' + hopeDrain + ', Savings −' + DAILY_SAVINGS_DRAIN;
    if (stats.pendingApplications > 0) {
        msg += ' (' + stats.pendingApplications + ' pending)';
    }
    showFeedback(msg);
}

// returns true if there's actions left, false otherwise
function useAction() {
    if (dayState.actionsLeft <= 0) {
        showFeedback('No actions left today.');
        return false;
    }
    dayState.actionsLeft -= 1;
    return true;
}

function applyForJob() {
    if (!useAction()) return;
    // progress formula: base + skill bonus + hope bonus (capped at 120)
    const progressGain = 5 + (0.05 * stats.skill) + (0.03 * Math.min(stats.hope, 120));
    stats.offerProgress += progressGain;
    stats.hope -= 5;
    stats.pendingApplications += 1;
    clampStats();
    updateHud();
    showFeedback('Applied! Progress +' + Math.round(progressGain) + ', Hope −5');
}

function checkEmail() {
    if (!useAction()) return;
    if (stats.pendingApplications <= 0) {
        showFeedback('Inbox empty.');
        return;
    }

    stats.pendingApplications -= 1;

    if (stats.offerProgress >= OFFER_PROGRESS_MAX) {
        // WIN
        showFeedback('YOU GOT THE JOB!');
        // TODO: trigger win screen
    } else {
        // rejection
        stats.hope -= 3;
        clampStats();
        updateHud();
        showFeedback('Rejection... Hope −3');
    }
}

function practiceSkills() {
    if (!useAction()) return;
    stats.skill += 6;
    stats.hope -= 2;
    clampStats();
    updateHud();
    showFeedback('Practiced skills! Skill +6, Hope −2');
}

function workout() {
    if (!useAction()) return;
    stats.hope += 6;
    clampStats();
    updateHud();
    showFeedback('Worked out! Hope +6');
}

function talkToFriend() {
    if (!useAction()) return;
    stats.hope += 8;
    clampStats();
    updateHud();
    showFeedback('Talked to a friend! Hope +8');
}
