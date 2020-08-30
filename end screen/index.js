export default class EndScreen extends Phaser.Scene {
    constructor() {
        super('EndScreen');
    }

    create() {
            this.add.text(20, 20, "Thanks for playing!"); 
            setTimeout(() => {
                this.scene.start('TitleScreen')
            }, 3000);
    }
}