import Player from "./player.js";

export default class MainScene extends Phaser.Scene {
    preload ()
    {
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/cathedral-map.json');
        this.load.image('tiles', 'assets/tilesets/Tiny Platform Quest Tiles.png'); 
        
        this.load.image('cathedral', 'assets/images/cathedral-pixelated.png'); 

        // Load sprite sheet generated with TexturePacker
        this.load.atlas('sheet', 'assets/datasprite.png', 'assets/datasprite.json');

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', 'assets/player-hitbox.json');
    }

    create ()
    {
        this.add.image(400, 176, 'cathedral')

        const shapes = this.cache.json.get('shapes');
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('Tiny Platform Quest Tiles', 'tiles');
        const groundLayer = map.createStaticLayer('Ground Layer', tileset, 0, 0);
        const skyLayer = map.createStaticLayer('Sky Layer', tileset, 0, 0);
        const treeLayer = map.createStaticLayer('Tree Layer', tileset, 0, 0);
        const platformsLayer = map.createStaticLayer('Platforms Layer', tileset, 0, 0);

        platformsLayer.setCollisionByProperty({ collides: true });
        groundLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(platformsLayer);
        this.matter.world.convertTilemapLayer(groundLayer);

        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.player = new Player(this, 300, 300, shapes, groundLayer);
    }

    update ()
    {
    }
}