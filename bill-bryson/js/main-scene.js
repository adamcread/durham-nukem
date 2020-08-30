import Player from "./player.js";
import Boss from "./boss.js"

export default class MainScene extends Phaser.Scene {
    preload () {
        this.load.tilemapTiledJSON("map", "assets/library-map.json");
        this.load.image("tileset", "assets/tileset.png");

        this.load.image("background", "assets/library.png");
        this.load.image("bullet", "assets/bullet.png");
        this.load.image("disciple", "assets/disciple/disciple-0.png")

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
        console.log(map)

        spikeLayer.setCollisionByProperty({ collides: true });
        platformLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(spikeLayer);
        this.matter.world.convertTilemapLayer(platformLayer);

        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player = new Player(this, 300, 300, shapes);

        this.boss = new Boss(this, 700, 300, shapes);
        this.playerCanDamage = true;
        this.bossCanDamage = true;
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
}