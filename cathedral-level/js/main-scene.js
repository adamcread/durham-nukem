import Player from "../../bill-bryson/js/player.js";
import Boss from "./boss.js";

export default class Cathedral extends Phaser.Scene {
    constructor () {
        super("Cathedral")
    }

    preload ()
    {
        this.load.tilemapTiledJSON('cathedral-map', './cathedral-level/assets/tilemaps/cathedral-map.json');
        this.load.image('tiles', './cathedral-level/assets/tilesets/Tiny Platform Quest Tiles.png'); 
        
        this.load.image('cathedral', './cathedral-level/assets/images/cathedral-pixelated.png'); 
        this.load.image("bullet", "/bill-bryson/assets/bullet.png");

        // Load sprite sheet generated with TexturePacker
        this.load.atlas('sheet', '/bill-bryson/assets/datasprite.png', '/bill-bryson/assets/datasprite.json');

        // Load body shapes from JSON file generated using PhysicsEditor
        this.load.json('shapes', '/bill-bryson/assets/player-hitbox.json');

        this.load.spritesheet('dude', 
            './cathedral-level/assets/spritesheets/eyelander.png',
            { frameWidth: 32, frameHeight: 32 }
        );
    }

    create ()
    {
        this.add.image(400, 176, 'cathedral')

        const shapes = this.cache.json.get('shapes');
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
        this.player = new Player(this, this.x, this.y, shapes, platformLayer);

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