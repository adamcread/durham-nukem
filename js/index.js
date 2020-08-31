// load scenes
import Preload from "./preload.js"
import TitleScreen from "../scenes/title-screen/index.js";
import BillBryson from "../scenes/bill-bryson/js/main-scene.js";
import Cathedral from "../scenes/cathedral-level/js/main-scene.js";
import EndScreen from "../scenes/end screen/index.js";

// create engine
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    backgroundColor: "#000c1f",
    parent: "game-container",
    scene: [Preload, TitleScreen, BillBryson, Cathedral, EndScreen],
    pixelArt: true,
    physics: { 
        default: "matter",
    },
    plugins: {
        scene: [{
            plugin: PhaserMatterCollisionPlugin,
            key: "matterCollision", 
            mapping: "matterCollision"
        }]
    }
};


const game = new Phaser.Game(config);