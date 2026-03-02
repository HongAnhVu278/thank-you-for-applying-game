const ZONE_ACTIONS = {
    work: [
        { label: 'Apply for Job', stat: 'Hope −5', action: applyForJob },
        { label: 'Check Email', stat: '', action: checkEmail },
        { label: 'Practice Skills', stat: 'Skill +6, Hope −2', action: practiceSkills }
    ],
    gym: [
        { label: 'Workout', stat: 'Hope +6', action: workout }
    ],
    play: [
        { label: 'Talk to Friend', stat: 'Hope +8', action: talkToFriend }
    ]
};

function applyForJob() { console.log('Apply for Job triggered'); }
function checkEmail() { console.log('Check Email triggered'); }
function practiceSkills() { console.log('Practice Skills triggered'); }
function workout() { console.log('Workout triggered'); }
function talkToFriend() { console.log('Talk to Friend triggered'); }
