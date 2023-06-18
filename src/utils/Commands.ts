import { Direction } from "./constants";

export enum CommandType {
  Any = "*",
  Register = "register",
  Snapshot = "snapshot",
  AddPlayer = "add_player",
  RemovePlayer = "remove_player",
  MovePlayer = "move_player",
  MovePlayerInput = "move_player_input",
  ClearPlayerInput = "clear_player_input",
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
  x: number,
  y: number,
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

export class AddPlayerCommand extends Command {
  declare data: PlayerData;

  constructor(id: string, data: PlayerData) {
    super(CommandType.AddPlayer, id, data);
  }
}

export class RemovePlayerCommand extends Command {
  declare data: PlayerData;

  constructor(id: string, data: PlayerData) {
    super(CommandType.RemovePlayer, id, data);
  }
}

export class MovePlayerCommand extends Command {
  declare data: PlayerData;

  constructor(id: string, data: PlayerData) {
    super(CommandType.MovePlayer, id, data);
  }
}

export interface MovePlayerInputData {
  direction: Direction;
}

export class MovePlayerInputCommand extends Command {
  constructor(id: string, data: MovePlayerInputData) {
    super(CommandType.MovePlayerInput, id, data);
  }
}

export class ClearPlayerInputCommand extends Command {
  constructor(id: string) {
    super(CommandType.ClearPlayerInput, id, {});
  }
}