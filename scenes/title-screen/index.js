export default class TitleScreen extends Phaser.Scene {
   constructor() {
       super('TitleScreen');
   }

   preload() {
       this.load.image('title', "./scenes/title-screen/assets/title_image.png");
   }

   create() {
        this.add.image(0, 0, 'title').setOrigin(0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();
   }
   
    update () {
        if (this.cursors.up.isDown) {
            this.scene.start('BillBryson')
        }        
    }
}