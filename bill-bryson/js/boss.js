export default class Boss {
    constructor(scene, x, y, shapes) {
        this.hitboxes = shapes
        this.scene = scene;
        this.sprite = scene.matter.add.sprite(x, y, "disciple").setFlipX(true);
        console.log(this.sprite)
        this.projectiles = []

        console.log(this.sprite.x)
        this.sprite
            .setScale(1.5)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(x, y)
            .setIgnoreGravity(true);
        
        this.scene.events.on("update", this.update, this);
    }

    update(time) {
        if (time % 10000 < 5000) {
            this.sprite.setVelocityY(-1)
        } else {
            this.sprite.setVelocityY(1)
        }

        if (time % 1000 < 10) {
            // console.log("projectile")
            this.projectiles.push(this.scene.matter.add.sprite(this.sprite.x-100, this.sprite.y-3, 
                'bullet')
                .setScale(0.2)
                .setVelocityX(-10)
                .setIgnoreGravity(true));
        }

        this.projectiles.forEach(projectile => 
            this.scene.matterCollision.addOnCollideStart({
                objectA: projectile,
                callback: this.deleteProjectile,
                context: projectile
            })
        );
    }

    deleteProjectile() {
        this.destroy()
    }
}