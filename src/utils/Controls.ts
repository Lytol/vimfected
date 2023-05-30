import Player from "../entities/Player";
import { Direction } from "../utils/constants";

const { KeyCodes } = Phaser.Input.Keyboard; 

const KEY_BINDINGS = {
  MOVE_LEFT: KeyCodes.H,
  MOVE_DOWN: KeyCodes.J,
  MOVE_UP:   KeyCodes.K,
  MOVE_RIGHT: KeyCodes.L,
};

export default class Controls {
  keys: object;

  constructor(
    private input: Phaser.Input.InputPlugin,
    private player: Player,
  ) {}

  create() {
    this.keys = this.input.keyboard.addKeys(KEY_BINDINGS);
  }

  update() {
    const { MOVE_LEFT, MOVE_DOWN, MOVE_UP, MOVE_RIGHT } = this.keys;

    if (MOVE_LEFT.isDown) {
      this.player.move(Direction.LEFT)
    } else if (MOVE_DOWN.isDown) {
      this.player.move(Direction.DOWN)
    } else if (MOVE_UP.isDown) {
      this.player.move(Direction.UP)
    } else if (MOVE_RIGHT.isDown) {
      this.player.move(Direction.RIGHT)
    }
  }
}