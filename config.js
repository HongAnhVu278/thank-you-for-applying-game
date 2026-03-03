const GAME_WIDTH = 672;       // 14 tiles × 48px
const MAP_HEIGHT = 480;       // 10 tiles × 48px
const HUD_HEIGHT = 120;       // bottom panel for HUD + popup
const GAME_HEIGHT = MAP_HEIGHT + HUD_HEIGHT; // 600 total
const PLAYER_SPEED = 150;
const PLAYER_SCALE = 2.5;
const INTERACTION_DISTANCE = 60;
const TILE_SIZE = 48;
const OFFICE_TILESET_FIRST_GID = 129;

// stat bounds
const HOPE_MAX = 200;
const HOPE_MIN = 0;
const SKILL_MAX = 150;
const SKILL_MIN = 0;
const OFFER_PROGRESS_MAX = 140;
const OFFER_PROGRESS_MIN = 0;
const SAVINGS_MIN = 0;

// day/time constants
const DAY_LENGTH = 30; // seconds per day
const ACTIONS_PER_DAY = 6;
const DAILY_HOPE_DRAIN = 2;
const DAILY_SAVINGS_DRAIN = 20;
const PENDING_APP_HOPE_DRAIN = 1; // per pending app per day

// day/time state
const dayState = {
    day: 1,
    actionsLeft: ACTIONS_PER_DAY,
    dayTimer: 0  // track how many seconds have passed
};

// game stats
const stats = {
    hope: 100,
    skill: 70,
    savings: 500,
    offerProgress: 0,
    pendingApplications: 0
};

function clampStats() {
    stats.hope = Math.max(HOPE_MIN, Math.min(HOPE_MAX, stats.hope));
    stats.skill = Math.max(SKILL_MIN, Math.min(SKILL_MAX, stats.skill));
    stats.offerProgress = Math.max(OFFER_PROGRESS_MIN, Math.min(OFFER_PROGRESS_MAX, stats.offerProgress));
    stats.savings = Math.max(SAVINGS_MIN, stats.savings);
}
