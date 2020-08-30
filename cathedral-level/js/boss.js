export default class Boss {
    constructor(scene, x, y) {
        this.scene = scene;
        this.boss = scene.matter.add.sprite(x, y, 'dude');

        this.boss
            .setSensor(false)
            .setIgnoreGravity(true)
            .setFixedRotation();
    
        this.scene.events.on("update", this.update, this);
    }

    update(time) { 
        if (time % 10000 < 5000) {
            this.boss.setVelocityX(-2)
        } else {
            this.boss.setVelocityX(2)
        }
    }
}