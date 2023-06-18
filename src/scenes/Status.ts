import Player from "../entities/Player";
import { TILE_SIZE } from '../utils/constants';

export default class Status extends Phaser.Scene {
  currentPlayer: Player;
  position: Phaser.GameObjects.Text;

  static readonly DefaultHeight = TILE_SIZE;

  init({ currentPlayer }: { currentPlayer: Player }) {
    this.currentPlayer = currentPlayer;
  }

  preload() {

  }

  create() {
    const { width, height } = this.game.scale;

    const background = new Phaser.GameObjects.Rectangle(this, 0, 0, width, Status.DefaultHeight, 0x40513B, 1.0);
    background.setOrigin(0, 0);

    this.position = new Phaser.GameObjects.Text(this, width, 0, 'Position: 0, 0', {
      fontSize: '12px',
      color: '#EDF1D6',
      padding: {
        right: 10,
      },
    })
    this.position.setOrigin(1, 0);

    const container = this.add.container(0, height - Status.DefaultHeight, [
      background,
      this.position,
    ]);

    this.scale.addListener(Phaser.Scale.Events.RESIZE, (gameSize: Phaser.Structs.Size) => {
      background.setSize(gameSize.width, Status.DefaultHeight);
      this.position.setX(gameSize.width);
      container.setPosition(0, gameSize.height - Status.DefaultHeight);
    });
  }

  update() {
    this.position.setText(this.positionText);
  }

  private get positionText(): string {
    return `x: ${this.currentPlayer.position.x}, y: ${this.currentPlayer.position.y}`;
  }
}