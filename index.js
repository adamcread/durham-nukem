import BillBryson from "./bill-bryson/js/main-scene.js";
import Cathedral from "./cathedral-level/js/main-scene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    backgroundColor: "#000c1f",
    parent: "game-container",
    scene: [TitleScreen, BillBryson, Cathedral],
    pixelArt: true,
    physics: { 
        default: "matter",
        matter: {
            debug: true
        }
    },
    plugins: {
        scene: [{
            plugin: PhaserMatterCollisionPlugin, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
        }]
    }
};


const game = new Phaser.Game(config);