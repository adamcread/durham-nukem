export default class TitleScreen extends Phaser.Scene {
   constructor() {
       super('TitleScreen');
   }

   preload() {
       this.load.image('title', "title screen/assets/title_image.png");
   }

   create() {
        this.add.image(20, 20, 'title');
        this.add.text(20, 20, "Loading game..."); 
        setTimeout(() => {
            this.scene.start('BillBryson')
          }, 5000);
   }
}