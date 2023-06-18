import Game from "../scenes/Game";

import { ClearPlayerInputCommand, MovePlayerInputCommand } from "./Commands";
import { Direction } from "./constants";

export default class Controls {
  private current: InputCommand = null;

  constructor(
    public scene: Game,
  ) {
    scene.input.keyboard.on('keydown', this.#onKeyDown, this);
  }

  #onKeyDown(event: KeyboardEvent) {
    if (this.current === null && event.key !== 'Escape') {
      this.current = new InputCommand();
    }

    switch (event.key) {
      case 'h':
        this.current.motion = Motion.Left;
        break;
      case 'j':
        this.current.motion = Motion.Down;
        break;
      case 'k':
        this.current.motion = Motion.Up;
        break;
      case 'l':
        this.current.motion = Motion.Right;
        break;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.current.updateCount(parseInt(event.key));
        break;

      case 'Escape':
        if (this.current) {
          this.current = null;
        } else {
          this.current = new InputCommand();
          this.current.operator = Operator.Clear;
          this.current.motion = Motion.Noop;
        }
        break;
    }

    if (this.current?.motion) {
      this.current.execute(this);
      this.current = null;
    }
  }
}

enum Operator {
  Move = "move",
  Destroy = "destroy",
  Clear = "clear",
}

enum Motion {
  Left = "left",
  Right = "right",
  Up = "up",
  Down = "down",
  Noop = "noop",
}

class InputCommand {
  public count: number = 0;
  public operator: Operator = Operator.Move;
  public motion: Motion = null;

  static motionToDirection(motion: Motion): Direction {
    switch(motion) {
      case Motion.Left:
        return Direction.Left;
      case Motion.Right:
        return Direction.Right;
      case Motion.Up:
        return Direction.Up;
      case Motion.Down:
        return Direction.Down;
      default:
        throw new Error(`Invalid motion: ${motion}`);
    }
  }

  constructor() {}

  execute(controls: Controls) {
    const { client } = controls.scene;

    if (this.count <= 0) {
      this.count = 1;
    }

    switch (this.operator) {
      case Operator.Clear: {
          client.send(new ClearPlayerInputCommand(client.id));
        break;
      }
      case Operator.Move: {
        const direction = InputCommand.motionToDirection(this.motion);
        for (let i = 0; i < this.count; i++) {
          client.send(new MovePlayerInputCommand(client.id, { direction }));
        }
        break;
      }
    }
  }

  updateCount(n: number) {
    this.count = this.count * 10 + n;
  }
}