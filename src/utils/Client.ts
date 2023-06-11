import { Command, CommandType, RegisterCommand } from './Commands';

export default class Client {
  static readonly PROTOCOL = "vimfected";

  public id: string;

  private _commands: Array<Command>;
  private ws: WebSocket;

  constructor(server: string, id: string) {
    this.id = id;
    this._commands = [];

    this.ws = new WebSocket(server, Client.PROTOCOL);
    this.ws.addEventListener("error", this.onError.bind(this));
    this.ws.addEventListener("open", this.register.bind(this));
    this.ws.addEventListener("message", this.handle.bind(this));
  }

  register(): void {
    this.send(new RegisterCommand(this.id));
  }

  onError(event: Event) {
    console.log("client error: ", event);
  }

  handle(event: MessageEvent) {
    const cmd = Command.parse(event.data);
    this._commands.push(cmd);
  }

  send(command: Command) {
    this.ws.send(command.toJSON());
  }

  get(ct: CommandType = CommandType.Any): Command {
    let idx

    if (ct == CommandType.Any) {
      idx = this._commands.length == 0 ? -1 : 0;
    } else {
      idx = this._commands.findIndex(cmd => cmd.type == ct);
    }

    if (idx === -1) {
      return null;
    }

    const cmd = this._commands[idx];
    this._commands.splice(idx, 1);
    return cmd;
  }

  *commands() {
    while(true) {
      const cmd = this.get();
      if (cmd !== null) {
        yield cmd;
      } else {
        return
      }
    }
  }
}