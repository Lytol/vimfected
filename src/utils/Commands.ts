export enum CommandType {
  Register = "register",
  Snapshot = "snapshot",
};

export class Command {
  constructor(
    public type: CommandType,
    public data: object
  ) {}

  static parse(raw: string) {
    const { type, data } = JSON.parse(raw);

    return new Command(
      type,
      data,
    )
  }

  toJSON() {
    return JSON.stringify({
      type: this.type,
      data: this.data,
    });
  }
}