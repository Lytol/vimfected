import { Direction } from "./constants";
import Client from "./Client";
import { Command, CommandType } from "./Commands";

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
    input: Phaser.Input.InputPlugin,
    private client: Client,
  ) {
    this.keys = input.keyboard.addKeys(KEY_BINDINGS);
  }

  update() {
    const { MOVE_LEFT, MOVE_DOWN, MOVE_UP, MOVE_RIGHT } = this.keys;

    if (MOVE_LEFT.isDown) {
      this.client.send(new Command(CommandType.Move, this.client.id, { direction: Direction.Left }));
    } else if (MOVE_DOWN.isDown) {
      this.client.send(new Command(CommandType.Move, this.client.id, { direction: Direction.Down }));
    } else if (MOVE_UP.isDown) {
      this.client.send(new Command(CommandType.Move, this.client.id, { direction: Direction.Up }));
    } else if (MOVE_RIGHT.isDown) {
      this.client.send(new Command(CommandType.Move, this.client.id, { direction: Direction.Right }));
    }
  }
}