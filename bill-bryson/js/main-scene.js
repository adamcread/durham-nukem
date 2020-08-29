import Player from "./player.js";

export default class MainScene extends Phaser.Scene {
    preload () {
        this.load.tilemapTiledJSON("map", "assets/library-map.json");
        this.load.image("tileset", "assets/tileset.png");
        this.load.image("background", "assets/library.png");

        // Load sprite sheet generated with TexturePacker
        this.load.atlas('sheet', 'assets/datasprite.png', 'assets/datasprite.json');

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', 'assets/player-hitbox.json');
    }

    create () {
        const shapes = this.cache.json.get('shapes');
        this.add.image(0, 0,'background').setOrigin(0, 0);

        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("ttt", "tileset");
        
        const spikeLayer = map.createStaticLayer("spikes", tileset, 0, 0);
        const platformLayer = map.createStaticLayer("platforms", tileset, 0, 0);
        map.createStaticLayer("bookshelves", tileset, 0, 0);

        spikeLayer.setCollisionByProperty({ collides: true });
        platformLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(spikeLayer);
        this.matter.world.convertTilemapLayer(platformLayer);

        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player = new Player(this, 300, 300, shapes, platformLayer);
    }

    update() {}
}