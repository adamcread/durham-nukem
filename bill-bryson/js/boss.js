export default class Boss {
    constructor(scene, x, y, shapes) {
        this.hitboxes = shapes
        this.scene = scene;
        this.sprite = scene.matter.add.sprite(x, y, "disciple").setFlipX(true).setSensor(true);
        this.healthbar = scene.matter.add.sprite(x, y, "healthbar").setScale(0.1).setSensor(true);

        this.projectiles = []

        console.log(this.sprite.x)
        this.sprite
            .setScale(1.5)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(x, y)
            .setIgnoreGravity(true);
        
        this.health = 25;
        this.scene.events.on("update", this.update, this);
    }

    update(time) {
        this.healthbar.setScale(0.1*(this.health/25), 0.1)
        this.healthbar.setPosition(this.sprite.x, this.sprite.y-40)

        if (time % 5500 < 2750) {
            this.sprite.setVelocityY(-1)
        } else {
            this.sprite.setVelocityY(1)
        }

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
                for (let i = 0; i < 8; i++) {
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
        

        for (let i = 0; i < this.projectiles.length; i++) {
            if (this.projectiles[i].scene == undefined) {
                this.projectiles.splice(i, 1)
            }
        }
    }
}