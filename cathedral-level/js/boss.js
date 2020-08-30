export default class Boss {
    constructor(scene, x, y) {
        this.scene = scene;
        this.boss = scene.matter.add.sprite(x, y, 'dude');

        this.boss
            .setSensor(true)
            .setIgnoreGravity(true)
            .setFixedRotation()
            .setScale(2.0)
            .setVelocityY(-3);
            
        this.scene.events.on("update", this.update, this);
    }

    update(time) {
        if (this.boss.y < (42)) {
            this.boss.setVelocityY(3);
        } else if (this.boss.y > (294)) {
            this.boss.setVelocityY(-3);
        } 
        
        
    }
}