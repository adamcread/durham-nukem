export default class TitleScreen extends Phaser.Scene {
   constructor() {
       super('TitleScreen');
   }

   create() {
        this.add.text(20, 20, "Loading game..."); 
        setTimeout(() => {
            this.scene.start('BillBryson')
          }, 2000);
   }
}