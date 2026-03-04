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
    dayState.lastActionTime = 0;

    clampStats();
    updateHud();

    // popup feedback message
    let msg = 'Day ' + dayState.day + ' — Hope −' + hopeDrain + ', Savings −' + DAILY_SAVINGS_DRAIN;
    if (stats.pendingApplications > 0) {
        msg += ' (' + stats.pendingApplications + ' pending)';
    }
    showFeedback(msg);

    checkGameOver();
}

// returns true if there's actions left, false otherwise
function useAction() {
    if (dayState.gameOver) return false;
    if (dayState.actionsLeft <= 0) {
        showFeedback('No actions left today.');
        return false;
    }
    dayState.actionsLeft -= 1;
    dayState.lastActionTime = dayState.dayTimer;
    return true;
}

function applyForJob() {
    if (!useAction()) return;

    dayState.consecutiveApplies += 1;

    // check burnout trigger: 4 consecutive applies
    if (dayState.consecutiveApplies >= BURNOUT_THRESHOLD && dayState.burnoutRemaining === 0) {
        dayState.burnoutRemaining = BURNOUT_PENALTY_COUNT;
        dayState.consecutiveApplies = 0;
        stats.hope -= BURNOUT_HOPE_COST;
        clampStats();
        updateHud();
        showFeedback("You're burning out. Hope −" + BURNOUT_HOPE_COST + ". Your next 3 applications won't be your best work. Take a break — work out, talk to a friend.", 'burnout');
        checkGameOver();
        return;
    }

    // progress formula: base + skill bonus + hope bonus (capped at 120)
    let progressGain = 5 + (0.05 * stats.skill) + (0.03 * Math.min(stats.hope, 120));

    // burnout penalty
    let wasBurnedOut = false;
    if (dayState.burnoutRemaining > 0) {
        progressGain *= BURNOUT_PROGRESS_MULT;
        dayState.burnoutRemaining -= 1;
        wasBurnedOut = true;
    }

    stats.offerProgress += progressGain;
    stats.hope -= 5;
    stats.pendingApplications += 1;
    clampStats();
    updateHud();

    // burnout feedback
    if (wasBurnedOut && dayState.burnoutRemaining > 0) {
        showFeedback('Still burned out... Your application felt rushed. (' + dayState.burnoutRemaining + ' remaining)');
    } else if (wasBurnedOut && dayState.burnoutRemaining === 0) {
        showFeedback('Feeling better. Back to full strength.');
    } else {
        showFeedback('Applied! Progress +' + Math.round(progressGain) + ', Hope −5');
    }
    checkGameOver();
}

function checkEmail() {
    if (!useAction()) return;
    //dayState.consecutiveApplies = 0;
    if (stats.pendingApplications <= 0) {
        showFeedback('Inbox empty.');
        return;
    }

    stats.pendingApplications -= 1;

    if (stats.offerProgress >= OFFER_PROGRESS_MAX) {
        showEndScreen('win');
    } else {
        // rejection
        stats.hope -= 3;
        clampStats();
        updateHud();
        showFeedback('Rejection... Hope −3');
        checkGameOver();
    }
}

function practiceSkills() {
    if (!useAction()) return;
    dayState.consecutiveApplies = 0;
    stats.skill += 6;
    stats.hope -= 2;
    clampStats();
    updateHud();
    showFeedback('Practiced skills! Skill +6, Hope −2');
    checkGameOver();
}

function workout() {
    if (!useAction()) return;
    dayState.consecutiveApplies = 0;
    stats.hope += 6;
    clampStats();
    updateHud();
    showFeedback('Worked out! Hope +6');
}

function talkToFriend() {
    if (!useAction()) return;
    dayState.consecutiveApplies = 0;
    stats.hope += 8;
    clampStats();
    updateHud();
    showFeedback('Talked to a friend! Hope +8');
}
