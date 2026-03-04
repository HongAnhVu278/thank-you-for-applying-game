function preload() {
    this.load.tilemapTiledJSON('office', 'assets/new_office.json');
    this.load.image('floors-walls', 'assets/A5 Office Floors & Walls_48x48.png');
    this.load.spritesheet('office-tiles', 'assets/Office Tileset All 48x48.png', {
        frameWidth: TILE_SIZE,
        frameHeight: TILE_SIZE
    });
    this.load.spritesheet('character', 'assets/Basic Charakter Spritesheet.png', {
        frameWidth: TILE_SIZE,
        frameHeight: TILE_SIZE
    });
}

function create() {
    const map = this.make.tilemap({ key: 'office' });

    const fwTileset = map.addTilesetImage('A5 Office Floors & Walls_48x48', 'floors-walls');
    const objTileset = map.addTilesetImage('Office Tileset All 48x48', 'office-tiles');
    const tilesets = [fwTileset, objTileset];

    map.createLayer('Floor', tilesets);
    const wallLayer = map.createLayer('Wall', tilesets);
    const decoLayer = map.createLayer('Decoration', tilesets);

    wallLayer.setCollisionByExclusion([-1, 0]);
    decoLayer.setCollisionByExclusion([-1, 0]);

    // interactive objects from Tiled
    this.interactiveGroup = this.physics.add.staticGroup();
    this.interactiveObjects = [];

    const interactiveObjects = map.getObjectLayer('Interactive').objects;
    interactiveObjects.forEach(obj => {
        if (obj.gid) {
            const frame = obj.gid - OFFICE_TILESET_FIRST_GID;
            const x = obj.x + obj.width / 2;
            const y = obj.y - obj.height / 2;

            let zoneType = null;
            if (obj.properties) {
                const typeProp = obj.properties.find(p => p.name === 'type');
                if (typeProp) zoneType = typeProp.value;
            }

            let sprite;
            if (zoneType) {
                sprite = this.interactiveGroup.create(x, y, 'office-tiles', frame);
                sprite.setImmovable(true);
                sprite.body.setSize(obj.width, obj.height);
            } else {
                sprite = this.add.sprite(x, y, 'office-tiles', frame);
            }

            this.interactiveObjects.push({
                sprite: sprite,
                x: x,
                y: y,
                width: obj.width,
                height: obj.height,
                zoneType: zoneType
            });
        }
    });

    // walking animations
    const directions = [
        { key: 'walk-down',  start: 0,  end: 3 },
        { key: 'walk-up',    start: 4,  end: 7 },
        { key: 'walk-left',  start: 8,  end: 11 },
        { key: 'walk-right', start: 12, end: 15 }
    ];
    directions.forEach(dir => {
        this.anims.create({
            key: dir.key,
            frames: this.anims.generateFrameNumbers('character', { start: dir.start, end: dir.end }),
            frameRate: 10,
            repeat: -1
        });
    });

    // load player
    this.player = this.physics.add.sprite(
        GAME_WIDTH / 2, MAP_HEIGHT / 2, 'character', 0
    );
    this.player.setScale(PLAYER_SCALE);
    this.player.setDepth(1000);
    this.player.body.setSize(8, 8);

    // add collisions to wall, decorative objs and zones
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, decoLayer);
    this.physics.add.collider(this.player, this.interactiveGroup);

    this.cursors = this.input.keyboard.createCursorKeys();

    createPopup();
    createHud();

    const container = document.getElementById('game-container');
    const playBtn = document.createElement('button');
    playBtn.id = 'play-btn';
    playBtn.className = 'play-btn';
    playBtn.textContent = 'Play';
    container.appendChild(playBtn);
    playBtn.addEventListener('click', () => {
        dayState.gameStarted = true;
        playBtn.remove();
    });
}

function update(time, delta) {
    if (!dayState.gameStarted || dayState.gameOver) {
        this.player.setVelocity(0);
        this.player.anims.stop();
        return;
    }

    // day timer — delta is in ms, convert to seconds
    dayState.dayTimer += delta / 1000;
    if (dayState.dayTimer >= DAY_LENGTH) {
        advanceDay();
    }

    // stillness check: no action for 6 s while actions remain
    if (dayState.actionsLeft > 0 &&
        dayState.dayTimer - dayState.lastActionTime >= STILLNESS_TIMEOUT) {
        dayState.lastActionTime = dayState.dayTimer; // reset so it can trigger again in 6s
        stats.hope -= STILLNESS_HOPE_COST;
        clampStats();
        updateHud();
        showFeedback('Time is passing... Hope −' + STILLNESS_HOPE_COST);
        checkGameOver();
    }

    this.player.setVelocity(0);
    let moving = false;

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-PLAYER_SPEED);
        this.player.play('walk-left', true);
        moving = true;
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(PLAYER_SPEED);
        this.player.play('walk-right', true);
        moving = true;
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-PLAYER_SPEED);
        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player.play('walk-up', true);
        }
        moving = true;
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(PLAYER_SPEED);
        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player.play('walk-down', true);
        }
        moving = true;
    }

    if (!moving) {
        this.player.anims.stop();
    }

    // proximity check for popup
    let nearestTypedObj = null;
    let nearestTypedDist = INTERACTION_DISTANCE;

    this.interactiveObjects.forEach(obj => {
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y, obj.x, obj.y
        );
        if (obj.zoneType && distance < nearestTypedDist) {
            nearestTypedDist = distance;
            nearestTypedObj = obj;
        }
    });

    if (nearestTypedObj) {
        showPopup(nearestTypedObj.zoneType);
    } else {
        hidePopup();
    }

    updateHud();
}

// initialize game after functions are defined
const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    backgroundColor: "#2b2b2b",
    scene: { preload, create, update }
});
