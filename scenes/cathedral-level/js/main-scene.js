import Player from "../../../js/player.js";
import Boss from "./boss.js";

export default class Cathedral extends Phaser.Scene {
    constructor () {
        super("Cathedral")
    }

    preload ()
    {
        this.load.tilemapTiledJSON('cathedral-map', './scenes/cathedral-level/assets/tilemaps/cathedral-map.json');
        this.load.image('tiles', './scenes/cathedral-level/assets/tilesets/Tiny Platform Quest Tiles.png'); 
        
        this.load.image('cathedral', './scenes/cathedral-level/assets/images/cathedral-pixelated.png'); 

        this.load.spritesheet('dude', 
            './scenes/cathedral-level/assets/spritesheets/eyelander.png',
            { frameWidth: 32, frameHeight: 32 }
        );
    }

    create ()
    {
        this.add.image(400, 176, 'cathedral')

        this.hitboxes = this.cache.json.get('hitboxes');
        const map = this.make.tilemap({ key: 'cathedral-map' });
        const tileset = map.addTilesetImage('Tiny Platform Quest Tiles', 'tiles');
        const platformLayer = map.createStaticLayer('Ground Layer', tileset, 0, 0);
        const skyLayer = map.createStaticLayer('Sky Layer', tileset, 0, 0);
        const treeLayer = map.createStaticLayer('Tree Layer', tileset, 0, 0);
        const platformsLayer = map.createStaticLayer('Platforms Layer', tileset, 0, 0);

        platformsLayer.setCollisionByProperty({ collides: true });
        platformLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(platformsLayer);
        this.matter.world.convertTilemapLayer(platformLayer);

        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.x = 300
        this.y = 300
        this.player = new Player(this, this.x, this.y);
        this.player.health = this.player.spawnHealth;

        this.boss = new Boss(this, 408 , 168);
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

        if (this.player.health <= 0) {
            this.player.sprite.setPosition(this.x, this.y);
            this.boss.health = 10;
            this.player.health = 3;
        }

        if (this.boss.health <= 0) {
            this.scene.start('EndScreen')
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
}