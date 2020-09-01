export default class EndScreen extends Phaser.Scene {
    constructor() {
        super('EndScreen');
    }

    create() {
        this.add.text(20, 20, "Thanks for playing!");
        this.add.text(20, 40, "Credits:"); 
        this.add.text(20, 60, "Everything - Haris Ahmad"); 
    }
}