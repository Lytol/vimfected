import Phaser from 'phaser';
import Menu from './scenes/Menu';
import Game from './scenes/Game';

import './styles.css';

const ZoomFactor = 2;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "app",
    mode: Phaser.Scale.NONE,
    width: window.innerWidth / ZoomFactor,
    height: window.innerHeight / ZoomFactor,
    zoom: ZoomFactor,
    render: {
      antialias: false,
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

const game = new Phaser.Game(config)

window.addEventListener("resize", () => {
  game.scale.resize(
    window.innerWidth / ZoomFactor,
    window.innerHeight / ZoomFactor
    );
});

export default game;