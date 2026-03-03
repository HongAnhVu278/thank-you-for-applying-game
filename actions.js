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

function applyForJob() {
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
    stats.skill += 6;
    stats.hope -= 2;
    clampStats();
    updateHud();
    showFeedback('Practiced skills! Skill +6, Hope −2');
}

function workout() {
    stats.hope += 6;
    clampStats();
    updateHud();
    showFeedback('Worked out! Hope +6');
}

function talkToFriend() {
    stats.hope += 8;
    clampStats();
    updateHud();
    showFeedback('Talked to a friend! Hope +8');
}
