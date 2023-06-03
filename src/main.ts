import Phaser from 'phaser';
import Menu from './scenes/Menu';
import Game from './scenes/Game';

import './styles.css';

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
    scene: [
      Menu,
      Game,
    ]
};

export default new Phaser.Game(config);