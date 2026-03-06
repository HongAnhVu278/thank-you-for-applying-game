# Thank You for Applying

A browser game about the emotional grind of job searching. Manage your hope, skills, and savings while trying to land an offer before you burn out.

<p align="center">
  <img width="676" height="589" alt="Screenshot 2026-03-04 at 12 10 43 AM" src="https://github.com/user-attachments/assets/1b351e18-fff0-40eb-b97e-375a2869e461" /><br>
  <em>Walk to a zone. Choose your action.</em>
</p>

<p align="center">
  <img width="662" height="474" alt="Screenshot 2026-03-04 at 12 14 39 AM" src="https://github.com/user-attachments/assets/fa8cf0b5-c74c-467c-a444-076c745b3c35" /><br>
  <em>Land the offer before you run out of hope.</em>
</p>

## [▶ Play it here](https://honganhvu278.github.io/thank-you-for-applying-game/)

## The Game

You’ve just been laid off. Each day provides:

- **6 actions**
- **25 seconds** on the clock

Move through the office and choose between three zones:

- **Work** — Apply for jobs, check email, practice skills  
- **Gym** — Restore Hope  
- **Lounge** — Recover Hope through social interaction  

### Core Resources

- **Savings** decrease daily  
- **Hope** decays over time and is affected by outcomes
- **Skill** increases through practice and improves job progress probability   
- **Job Progress** increases through applications  

Rejections reduce Hope. Consecutive applications trigger a burnout penalty. Inactivity causes passive Hope loss.

Job offers are only resolved when you check email. Sustained progress requires balancing high-yield actions with recovery to avoid resource depletion.

## Design Decisions

### Hope Soft Cap

Hope can reach **200**, but only the first **120** points affect the job-progress formula.  
Values above 120 act as a buffer. This prevents recovery actions from becoming the dominant strategy.

### Burnout Mechanic

Burnout tracks **consecutive applications only**.  
Non-application actions reset the streak counter. This discourages repetitive Apply spam without penalizing productive variety.

### Inactivity Penalty

After **6 seconds** without an action, Hope decreases.  
This prevents passive waiting as an optimal strategy and maintains gameplay tension.

### Email Resolution Requirement

Reaching maximum progress does not automatically grant an offer.  
The player must explicitly check email to resolve pending applications.

### Email Resolution Pressure

Pending applications/emails reduce Hope if left unresolved.  
Checking email clears applications and resolves outcomes, preventing ongoing Hope decay.

## Architecture

- Static deployment (no build step required)
- Vanilla JavaScript + Phaser 3 via CDN
- No external state libraries

**Design goals:** Minimal setup. Transparent control flow. Easy to inspect and modify.

**5 files, loaded in order.** `config.js` → `actions.js` → `popup.js` → `hud.js` → `scene.js`. Each file references globals from earlier ones. `scene.js` initializes the game. This keeps the codebase understandable without introducing build complexity.

**DOM for all UI.** Popups, HUD, feedback toasts, and overlays are DOM elements positioned inside the Phaser container. Easier to style and iterate on than Phaser's built in text objects.

**Tiled for level design.** The office map is authored in Tiled Map Editor. Interactive zones use a custom `type` property (`work`, `gym`, `play`). The game reads these at runtime to wire up collisions and actions.

## Run Locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Origin

Job searching can be both difficult and emotionally demanding. I noticed that I often focused heavily on grinding while neglecting other parts of my life.

This game is a structured reflection of my experience. It models the tension between sustained effort and recovery. Burnout reduces effectiveness, and neglecting the rest of life can make the search harder over time.

The mechanics are inspired by lessons learned about balancing sustained job search effort with personal well-being.

[Read more about the process here!](https://debuggingmy20s.substack.com/p/what-i-learned-and-did-after-being-e98)

