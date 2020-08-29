export default class Boss {
    constructor(scene, x, y) {
        this.scene = scene;
        this.boss = scene.matter.add.sprite(x, y, 'dude');

        this.boss
            .setSensor(true)
            .setIgnoreGravity(true)
            .setFixedRotation();

        this.scene.events.on("update", this.update, this);
    }

    update() {
        const boss = this.boss;
        boss.setVelocityX(0);
    }
}