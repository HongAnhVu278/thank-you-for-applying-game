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
    this.load.tilemapTiledJSON('office', 'assets/office.json');
    this.load.image('floors-walls', 'assets/A5 Office Floors & Walls_48x48.png');
    this.load.spritesheet('office-tiles', 'assets/Office Tileset All 48x48.png', {
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

    const interactiveObjects = map.getObjectLayer('Interactive').objects;
    interactiveObjects.forEach(obj => {
        if (obj.gid) {
            const frame = obj.gid - 129;
            const sprite = this.add.sprite(obj.x + obj.width / 2, obj.y - obj.height / 2, 'office-tiles', frame);
        }
    });
}

function update() {
}
