import './styles.css';
import Phaser from 'phaser';
import Game from './scenes/Game';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "app",
    width: 1280,
    height: 720,
    render: {
      antialias: false,
    },
    scale: {
      mode: Phaser.Scale.ENVELOP,
    },
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