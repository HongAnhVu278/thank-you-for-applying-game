const config = {
    type: Phaser.AUTO,
    width: 672,   // 14 tiles × 48px
    height: 480,  // 10 tiles × 48px
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },  // top-down, no gravity
            debug: true          // shows collision boxes while testing
        }
    },
    backgroundColor: "#2b2b2b",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('office', 'assets/new_office.json');
    this.load.image('floors-walls', 'assets/A5 Office Floors & Walls_48x48.png');
    this.load.spritesheet('office-tiles', 'assets/Office Tileset All 48x48.png', {
        frameWidth: 48,
        frameHeight: 48
    });

    // load character spritesheet: 4x4 grid (48x48 pixel)
    this.load.spritesheet('character', 'assets/Basic Charakter Spritesheet.png', {
        frameWidth: 48,
        frameHeight: 48
    });
}

function create() {
    // tile layers: Floor, Wall(collide), Decoration(collide), Interactive(object)
    const map = this.make.tilemap({ key: 'office' });

    const fwTileset = map.addTilesetImage('A5 Office Floors & Walls_48x48', 'floors-walls');
    const objTileset = map.addTilesetImage('Office Tileset All 48x48', 'office-tiles');
    const tilesets = [fwTileset, objTileset];

    map.createLayer('Floor', tilesets);
    const wallLayer = map.createLayer('Wall', tilesets);
    const decoLayer = map.createLayer('Decoration', tilesets);

    wallLayer.setCollisionByExclusion([-1, 0]);
    decoLayer.setCollisionByExclusion([-1, 0]);

    // store interactive objects for proximity detection
    this.interactiveObjects = [];
    const interactiveObjects = map.getObjectLayer('Interactive').objects;
    interactiveObjects.forEach(obj => {
        if (obj.gid) {
            const frame = obj.gid - 129;
            const sprite = this.add.sprite(obj.x + obj.width / 2, obj.y - obj.height / 2, 'office-tiles', frame);
            
            // Store object data for interaction
            this.interactiveObjects.push({
                sprite: sprite,
                x: obj.x + obj.width / 2,
                y: obj.y - obj.height / 2,
                width: obj.width,
                height: obj.height
            });
        }
    });

    // walking animation
    this.anims.create({
        key: 'walk-down',
        frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'walk-up',
        frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    // add player, scale bigger
    this.player = this.physics.add.sprite(336, 240, 'character', 0);
    this.player.setScale(2.5);
    this.player.setDepth(1000);
    
    // set collision body instead of the scaled size
    this.player.body.setSize(8, 8);
    
    // set up collision to wall + deco layer
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, decoLayer);
    

    this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    //handle movement
    const speed = 150;

    this.player.setVelocity(0);
    let moving = false;
    
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-speed);
        this.player.play('walk-left', true);
        moving = true;
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(speed);
        this.player.play('walk-right', true);
        moving = true;
    }
    
    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-speed);
        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player.play('walk-up', true);
        }
        moving = true;
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(speed);
        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player.play('walk-down', true);
        }
        moving = true;
    }
    
    if (!moving) {
        this.player.anims.stop();
    }
    
    // check proximity to interactive objects
    const interactionDistance = 60; 
    let nearestObject = null;
    let nearestDistance = interactionDistance;
    
    this.interactiveObjects.forEach(obj => {
        const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            obj.x,
            obj.y
        );
        
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestObject = obj;
        }
    });
    
    // trigger interaction if near an object
    if (nearestObject) {
        nearestObject.sprite.setTint(0xffff00); 
    } else {
        this.interactiveObjects.forEach(obj => {
            obj.sprite.clearTint();
        });
    }
}
