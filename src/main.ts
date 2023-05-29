import Phaser from 'phaser';
import Game from './scenes/Game';

const config = {
    type: Phaser.AUTO,
    width: 1200 ,
    height: 800,
    parent: "app",
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: Game
};

export default new Phaser.Game(config);