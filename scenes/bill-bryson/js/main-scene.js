import Player from "../../../js/player.js";
import Boss from "./boss.js"

export default class BillBryson extends Phaser.Scene {
    constructor () {
        super("BillBryson")
    }

    preload () {
        // load maps and boss
        this.load.tilemapTiledJSON("bill-bryson-map", "./scenes/bill-bryson/assets/tileset/library-map5.json");
        this.load.image("bill-bryson-tileset", "./scenes/bill-bryson/assets/tileset/tileset.png");
        this.load.image("bill-bryson-bg", "./scenes/bill-bryson/assets/images/library.png");
        this.load.image("disciple", "./scenes/bill-bryson/assets/images/disciple/disciple-0.png");
    }

    create () {
        // get player hitbox
        this.hitboxes = this.cache.json.get('hitboxes');

        // add background and map
        this.add.image(0, 0,'bill-bryson-bg').setOrigin(0, 0);
        const map = this.make.tilemap({ key: "bill-bryson-map" });
        const tileset = map.addTilesetImage("ttt", "bill-bryson-tileset");
        
        // create Tiler layers 
        const spikeLayer = map.createStaticLayer("spikes", tileset, 0, 0);
        const platformLayer = map.createStaticLayer("platforms", tileset, 0, 0);
        map.createStaticLayer("bookshelves", tileset, 0, 0);

        // add collision to tiles and convert layer to a matter body
        spikeLayer.setCollisionByProperty({ collides: true });
        platformLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(spikeLayer);
        this.matter.world.convertTilemapLayer(platformLayer);

        // set world bounds
        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // initialise text displaying player death count
        this.deathText = this.add.text(16, 30, 'Deaths: 0', { fontSize: '32px', fill: '#000' });

        // define player spawn and initialise player with spawn health
        this.spawn = { x: 50, y: 300 };
        this.player = new Player(this, this.spawn.x, this.spawn.y);
        this.player.health = this.player.spawnHealth;

        // initialise boss with boss health
        this.boss = new Boss(this, 700, 300);
        this.boss.health = this.boss.spawnHealth;

        // initialise scene variables
        this.playerCanDamage = true;
        this.bossCanDamage = true;
        this.deaths = 0;

        // create collision detection for player sprite
        this.matterCollision.addOnCollideActive({
            objectA: this.player.sprite,
            callback: this.playerCollision,
            context: this
        });
    }

    update() {
        // create collision detection for all projectiles currently in scene
        this.matterCollision.addOnCollideStart({
            objectA: this.player.projectiles.concat(this.boss.projectiles),
            callback: this.bulletCollision,
            context: this
        });

        // if player dies
        if (this.player.health <= 0) {
            // add death to death counter and reset scene
            this.deathText.setText('Deaths: ' + ++this.deaths);
            this.player.sprite.setPosition(this.spawn.x, this.spawn.y);
            this.boss.health = this.boss.spawnHealth;
            this.player.health = this.player.spawnHealth;
        }

        // if boss dies
        if (this.boss.health <= 0) {
            // change scene to cathedral
            this.scene.start("Cathedral");
        }
    }

    bulletCollision ({ gameObjectA, gameObjectB }) {
        // if bullet hits boss and player can damage
        if (gameObjectB == this.boss.sprite && this.playerCanDamage) {
            this.boss.health -= 1
            
            this.playerCanDamage = false;
            this.time.addEvent({
                delay: 250,
                callback: () => (this.playerCanDamage = true)
            });
        } 
        
        // if bullet hits player and boss can damage
        if (gameObjectB == this.player.sprite && this.bossCanDamage) {
            this.player.health -= 1
            
            this.bossCanDamage = false;
            this.time.addEvent({
                delay: 250,
                callback: () => (this.bossCanDamage = true)
            });  
        }
        
        // destroy bullet as it has collided with an object
        gameObjectA.destroy()
    }

    playerCollision ({ gameObjectB }) {
        // if player has collided with a tile
        if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
    
        const tile = gameObjectB;

        // if tile has property isLethal kill player
        if (tile.properties.isLethal) {
            this.player.health = 0;
        }
    }
}