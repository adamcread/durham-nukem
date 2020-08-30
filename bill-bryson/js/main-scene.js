import Player from "./player.js";
import Boss from "./boss.js"

export default class BillBryson extends Phaser.Scene {
    constructor () {
        super("BillBryson")
    }

    preload () {
        this.load.tilemapTiledJSON("map", "./bill-bryson/assets/tileset/library-map4.json");
        this.load.image("tileset", "bill-bryson/assets/tileset/tileset.png");

        this.load.image("background", "bill-bryson/assets/images/library.png");
        this.load.image("bullet", "bill-bryson/assets/images/bullet.png");
        this.load.image("disciple", "bill-bryson/assets/images/disciple/disciple-0.png")
        this.load.image("heart", "bill-bryson/assets/images//heart.png")
        this.load.image("healthbar", "bill-bryson/assets/images/healthbar.png")

        // Load sprite sheet generated with TexturePacker
        this.load.atlas('sheet', 'bill-bryson/assets/spriteset/datasprite.png', 'bill-bryson/assets/spriteset/datasprite.json');

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', 'bill-bryson/assets/spriteset/player-hitbox.json');
    }

    create () {
        const shapes = this.cache.json.get('shapes');
        this.add.image(0, 0,'background').setOrigin(0, 0);

        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("ttt", "tileset");
        
        this.spikeLayer = map.createStaticLayer("spikes", tileset, 0, 0);
        const platformLayer = map.createStaticLayer("platforms", tileset, 0, 0);
        map.createStaticLayer("bookshelves", tileset, 0, 0);
        console.log(map)

        this.spikeLayer.setCollisionByProperty({ collides: true });
        platformLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(this.spikeLayer);
        this.matter.world.convertTilemapLayer(platformLayer);

        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // this.cameras.main.setBounds(0, 0, map.widthInPixels, 352);

        this.x = 100
        this.y = 300
        this.player = new Player(this, this.x, this.y, shapes);
        // this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

        this.boss = new Boss(this, 700, 210, shapes);
        this.playerCanDamage = true;
        this.bossCanDamage = true;
        
        // console.log(this.spikeLayer)

        this.matterCollision.addOnCollideActive({
            objectA: this.player.sprite,
            callback: this.playerSpikesCollision,
            context: this
        })
        
    }

    update() {

        // console.log(this.player.projectiles)
        this.matterCollision.addOnCollideStart({
            objectA: this.player.projectiles,
            callback: this.playerBulletCollision,
            context: this
        })

        this.matterCollision.addOnCollideStart({
            objectA: this.boss.projectiles,
            callback: this.bossBulletCollision,
            context: this
        })

        if (this.player.health <= 0) {
            this.player.sprite.setPosition(this.x, this.y);
            this.boss.health = 25;
            this.player.health = 3;
        }

        if (this.boss.health <= 0) {
            this.scene.start("Cathedral")
            // this.scene.start('EndScreen')
        }
    }

    playerBulletCollision ({ bodyA, bodyB, pair }) {
        if ((pair.gameObjectA == this.boss.sprite || pair.gameObjectA == this.boss.sprite) && this.playerCanDamage) {
            this.boss.health -= 1
            console.log("boss", this.boss.health)
            
            this.playerCanDamage = false;
            this.time.addEvent({
                delay: 250,
                callback: () => (this.playerCanDamage = true)
            });  
        } 

        if (this.player.projectiles.includes(pair.gameObjectA)) {
            pair.gameObjectA.destroy()
        } else {
            pair.gameObjectB.destroy()
        }
    }

    bossBulletCollision ({ bodyA, bodyB, pair }) {
        if ((pair.gameObjectA == this.player.sprite || pair.gameObjectA == this.player.sprite) && this.bossCanDamage) {
            this.player.health -= 1
            console.log("player", this.player.health)
            
            this.bossCanDamage = false;
            this.time.addEvent({
                delay: 250,
                callback: () => (this.bossCanDamage = true)
            });   
        } 

        if (this.boss.projectiles.includes(pair.gameObjectA)) {
            pair.gameObjectA.destroy()
        } else {
            pair.gameObjectB.destroy()
        }
    }

    playerSpikesCollision ({ gameObjectB }) {
        if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
    
        const tile = gameObjectB;

        if (tile.properties.isLethal) {
            this.player.health = 0
        }
      }
}