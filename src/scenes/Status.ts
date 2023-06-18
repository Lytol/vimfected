import Player from "../entities/Player";
import { Mode, TILE_SIZE } from '../utils/constants';

const isPrintable = (keyCode: number): boolean => {
  return keyCode == 32 ||               // space
    (keyCode > 47 && keyCode < 58)   || // number keys
    (keyCode > 64 && keyCode < 91)   || // letter keys
    (keyCode > 95 && keyCode < 112)  || // numpad keys
    (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
    (keyCode > 218 && keyCode < 223);   // [\]' (in order)
};

export default class Status extends Phaser.Scene {
  private currentPlayer: Player;
  private commandInput: string = '';
  private text: Phaser.GameObjects.Text;

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

    this.text = new Phaser.GameObjects.Text(this, 0, 0, '', {
      fontSize: '12px',
      color: '#EDF1D6',
      padding: {
        left: 10,
      },
    })
    this.text.setOrigin(0, 0);

    const container = this.add.container(0, height - Status.DefaultHeight, [
      background,
      this.text,
    ]);

    this.scale.addListener(Phaser.Scale.Events.RESIZE, (gameSize: Phaser.Structs.Size) => {
      background.setSize(gameSize.width, Status.DefaultHeight);
      container.setPosition(0, gameSize.height - Status.DefaultHeight);
    });

    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      // TODO: keyCode is deprecated, but handling it correctly is going to be annoying

      // If printable, add to command input
      if (isPrintable(event.keyCode)) {
        this.commandInput += event.key;
      }

      // Backspace
      if (event.keyCode === 8) {
        this.commandInput = this.commandInput.slice(0, -1);
      }

      // Escape clears the command input and returns to normal mode
      if (event.keyCode === 27) {
        this.commandInput = '';
        this.game.registry.set('mode', Mode.Normal);
      }

      // Enter should execute the command
      if (event.keyCode === 13) {
        // TODO: give user feedback on success/error of command
        this.executeInputCommand(this.commandInput);
        this.commandInput = '';
        this.game.registry.set('mode', Mode.Normal);
      }
    });
  }

  update() {
    // TODO: we should use events rather than update every time
    if (this.mode === Mode.Command) {
      this.input.keyboard.enabled = true;
    } else {
      this.input.keyboard.enabled = false;
    }

    this.text.setText(this.currentStatusText);
  }

  private get currentStatusText(): string {
    switch (this.mode) {
      case Mode.Normal:
        return `--NORMAL-- x: ${this.currentPlayer.position.x} y: ${this.currentPlayer.position.y}`;
      case Mode.Command:
        return `--COMMAND-- :${this.commandInput}`;
      default:
        return `--UNKNOWN--`;
    }
  }

  private get mode(): Mode {
    return <Mode>this.game.registry.get('mode');
  }

  private executeInputCommand(input: string): boolean {
    const [command, ...args] = input.split(' ');

    switch (command) {
      case 'chat':
        // TODO: handle chat command
        console.log("Send chat command: ", args.join(' '));
        return true;
    }

    return false;
  }
}