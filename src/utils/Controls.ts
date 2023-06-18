import Game from "../scenes/Game";

import { Direction } from "./constants";
import { MovePlayerInputCommand } from "./Commands";
import { Mode } from "./constants";

const { KeyCodes } = Phaser.Input.Keyboard; 

const DefaultKeyBindings = {
  MOVE_LEFT: KeyCodes.H,
  MOVE_DOWN: KeyCodes.J,
  MOVE_UP:   KeyCodes.K,
  MOVE_RIGHT: KeyCodes.L,

  COMMAND_MODE: KeyCodes.SEMICOLON,
};

interface KeyBindings {
  MOVE_LEFT: Phaser.Input.Keyboard.Key;
  MOVE_DOWN: Phaser.Input.Keyboard.Key;
  MOVE_UP:   Phaser.Input.Keyboard.Key;
  MOVE_RIGHT: Phaser.Input.Keyboard.Key;

  COMMAND_MODE: Phaser.Input.Keyboard.Key;
}

export default class Controls {
  keys: KeyBindings;

  constructor(
    public scene: Game,
  ) {
    this.keys = scene.input.keyboard.addKeys(DefaultKeyBindings) as KeyBindings;
  }

  update() {
    const { client, currentPlayer } = this.scene;
    const { MOVE_LEFT, MOVE_DOWN, MOVE_UP, MOVE_RIGHT, COMMAND_MODE } = this.keys;

    // Player movement
    if (!currentPlayer.isMoving()) {
      if (MOVE_LEFT.isDown) {
        client.send(new MovePlayerInputCommand(client.id, { direction: Direction.Left }));
      } else if (MOVE_DOWN.isDown) {
        client.send(new MovePlayerInputCommand(client.id, { direction: Direction.Down }));
      } else if (MOVE_UP.isDown) {
        client.send(new MovePlayerInputCommand(client.id, { direction: Direction.Up }));
      } else if (MOVE_RIGHT.isDown) {
        client.send(new MovePlayerInputCommand(client.id, { direction: Direction.Right }));
      }
    }

    // TODO: hacky way to check for colon with shift key
    if (COMMAND_MODE.isDown && COMMAND_MODE.shiftKey) {
      this.scene.game.registry.set('mode', Mode.Command);
    }
  }
}