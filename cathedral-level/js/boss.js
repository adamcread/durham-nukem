export default class Boss {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.matter.add.sprite(x, y, 'dude');
        this.projectiles = [];
        this.health = 10;

        this.sprite
            .setSensor(true)
            .setIgnoreGravity(true)
            .setFixedRotation()
            .setScale(2.0)
            .setVelocityY(-3);
            
        this.scene.events.on("update", this.update, this);
    }

    update(time) {
        if (this.sprite.y < (42)) {
            this.sprite.setVelocityY(3);
        } else if (this.sprite.y > (294)) {
            this.sprite.setVelocityY(-3);
        } 

        if (time % 1000 < 10) {
            this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x-32, this.sprite.y+Phaser.Math.Between(-32, 32), 
                'bullet')
                .setScale(0.2)
                .setVelocityX(-5)
                .setIgnoreGravity(true));
            this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x+32, this.sprite.y+Phaser.Math.Between(-32, 32), 
                'bullet')
                .setScale(0.2)
                .setVelocityX(5)
                .setIgnoreGravity(true));
        }

        for (let i = 0; i < this.projectiles.length; i++) {
            if (this.projectiles[i].scene == undefined) {
                this.projectiles.splice(i, 1)
            }
        }
    }

    deleteProjectile() {
        this.destroy()
    }
}