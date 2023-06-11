import { Direction } from "./constants";
import Client from "./Client";
import { MovePlayerInputCommand } from "./Commands";
import Player from "../entities/Player";

const { KeyCodes } = Phaser.Input.Keyboard; 

const KEY_BINDINGS = {
  MOVE_LEFT: KeyCodes.H,
  MOVE_DOWN: KeyCodes.J,
  MOVE_UP:   KeyCodes.K,
  MOVE_RIGHT: KeyCodes.L,
};

interface KeyBindings {
  MOVE_LEFT: Phaser.Input.Keyboard.Key;
  MOVE_DOWN: Phaser.Input.Keyboard.Key;
  MOVE_UP:   Phaser.Input.Keyboard.Key;
  MOVE_RIGHT: Phaser.Input.Keyboard.Key;
}

export default class Controls {
  keys: KeyBindings;

  constructor(
    input: Phaser.Input.InputPlugin,
    private client: Client,
    private player: Player,
  ) {
    this.keys = input.keyboard.addKeys(KEY_BINDINGS) as KeyBindings;
  }

  update() {
    const { MOVE_LEFT, MOVE_DOWN, MOVE_UP, MOVE_RIGHT } = this.keys;

    if (!this.player.isMoving()) {
      if (MOVE_LEFT.isDown) {
        this.client.send(new MovePlayerInputCommand(this.client.id, { direction: Direction.Left }));
      } else if (MOVE_DOWN.isDown) {
        this.client.send(new MovePlayerInputCommand(this.client.id, { direction: Direction.Down }));
      } else if (MOVE_UP.isDown) {
        this.client.send(new MovePlayerInputCommand(this.client.id, { direction: Direction.Up }));
      } else if (MOVE_RIGHT.isDown) {
        this.client.send(new MovePlayerInputCommand(this.client.id, { direction: Direction.Right }));
      }
    }
  }
}