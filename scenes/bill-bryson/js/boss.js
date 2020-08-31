export default class Boss {
    constructor(scene, x, y) {
        this.scene = scene;
        // add healthbar sprite
        this.healthbar = scene.matter.add.sprite(x, y, "healthbar").setScale(0.1).setSensor(true);

        // add boss sprite
        this.sprite = scene.matter.add.sprite(x, y, "disciple")
            .setFlipX(true)
            .setSensor(true)
            .setIgnoreGravity(true)
            .setScale(1.5)
            .setFixedRotation()
            .setPosition(x, y);
        
        // initialise boss variables
        this.projectiles = [];
        this.movement = 1;
        this.spawnHealth = 25;

        // run this.update when scene updates occur
        scene.events.on("update", this.update, this);
    }

    update() {
        // create boss movement 
        if (this.sprite.y < 75) {
            this.movement = 1
        } else if (this.sprite.y > 375) {
            this.movement = -1
        }
        this.sprite.setPosition(this.sprite.x, this.sprite.y+this.movement)

        // scale healthbar dependent on the current health of the boss
        // reposition healthbar to follow boss
        this.healthbar.setScale(0.1*(this.health / this.spawnHealth), 0.1)
        this.healthbar.setPosition(this.sprite.x, this.sprite.y-40)

        // define boss fight phases based on current boss health
        // on each update there is a 3% chance of boss firing 
        // all projectiles are added to a projectiles list which tracks all boss bullets currently on screen
        if (this.health > 15) {
            if (Phaser.Math.FloatBetween(0, 1.0) < 0.03) {
                this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x-100, this.sprite.y-3, 
                    'bullet')
                    .setScale(0.2)
                    .setVelocityX(-10)
                    .setIgnoreGravity(true));
            }
        } else if (this.health > 7) {
            if (Phaser.Math.FloatBetween(0, 1.0) < 0.03) {
                for (let i = 0; i < 3; i++) {
                    this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x-100, this.sprite.y-5 + i*20, 
                        'bullet')
                        .setScale(0.2)
                        .setVelocityX(-10-i*Phaser.Math.FloatBetween(0, 3.0))
                        .setIgnoreGravity(true));
                }
            }
        } else {
            if (Phaser.Math.FloatBetween(0, 1.0) < 0.03) {
                for (let i = 0; i < 3; i++) {
                    this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x-100, this.sprite.y-5 + i*50, 
                        'bullet')
                        .setScale(0.5)
                        .setVelocityX(-10-i*Phaser.Math.FloatBetween(0, 3.0))
                        .setIgnoreGravity(true));
                }
            }
        }

        // remove destroyed bullets from projectiles list
        for (let i = 0; i < this.projectiles.length; i++) {
            if (this.projectiles[i].scene == undefined) {
                this.projectiles.splice(i, 1)
            }
        }
    }
}