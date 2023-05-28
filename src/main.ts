import Phaser from 'phaser';
import Example from './scenes/Example';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: Example
};

export default new Phaser.Game(config);