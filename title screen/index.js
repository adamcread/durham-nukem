export default class TitleScreen extends Phaser.Scene {
   constructor() {
       super('TitleScreen');
   }

   preload() {
       this.load.image('titlescreen', 'title screen/assets/title_image.png');
   }

   create() {
        this.add.image(0, 0, 'tilescreen').setOrigin(0, 0);
        // this.add.text(20, 20, "Loading game...");
   }
}