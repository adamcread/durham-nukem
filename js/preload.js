// scene to preload assets used globally

export default class Preload extends Phaser.Scene {
    constructor() {
        super("Preload")
    }

    preload() {
        this.load.image("bullet", "./assets/images/bullet.png");
        this.load.image("heart", "./assets/images/heart.png")
        this.load.image("healthbar", "./assets/images/healthbar.png")

        // hitboxes and sprite sheet for player
        this.load.atlas('sheet', './assets/spritesheet/datasprite.png', 'assets/spritesheet/datasprite.json');
        this.load.json('hitboxes', './assets/spritesheet/player-hitbox.json');
    }

    create() {
        this.scene.start('TitleScreen')
    }
}