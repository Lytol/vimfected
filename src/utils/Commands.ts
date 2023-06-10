export enum CommandType {
  Register = "register",
  Snapshot = "snapshot",
  Move = "move",
};

export class Command {
  constructor(
    public type: CommandType,
    public id: string,
    public data: object
  ) {}

  static parse(raw: string) {
    const { type, id, data } = JSON.parse(raw);

    return new Command(
      type,
      id,
      data,
    )
  }

  toJSON() {
    return JSON.stringify({
      type: this.type,
      id: this.id,
      data: this.data,
    });
  }
}

export class RegisterCommand extends Command {
  constructor(id: string) {
    super(CommandType.Register, id, null);
  }
}

export interface PlayerData {
  id: string,
}

export interface MapData {
  data: Array<Array<number>>
}

export interface SnapshotData {
  players: Array<PlayerData>,
  map: MapData,
}

export class SnapshotCommand extends Command {
  declare data: SnapshotData;

  constructor(id: string, data: SnapshotData) {
    super(CommandType.Snapshot, id, data);
  }
}

export interface MoveData {

}

export class MoveCommand extends Command {
  constructor(id: string, data: MoveData) {
    super(CommandType.Snapshot, id, data);
  }
}