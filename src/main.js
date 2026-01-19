import { StartScene } from './scenes/startScene.js';
import { GameScene } from './scenes/gameScene.js';
import { LevelCompleteScene } from './scenes/LevelCompleteScene.js';
import { GameWinScene } from './scenes/GameWinScene.js';

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [StartScene, GameScene, LevelCompleteScene, GameWinScene]
};

new Phaser.Game(config);
