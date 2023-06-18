import Status from './Status';
import Controls from '../utils/Controls';
import Player from '../entities/Player';
import Client from '../utils/Client';

import WorldTiles from '../assets/world-tiles.png';
import PlayerPNG from '../assets/player.png';
import PlayerJSON from '../assets/player.json';
import { Command, CommandType, PlayerData, SnapshotData } from '../utils/Commands';
import { Mode } from '../utils/constants';

export default class Game extends Phaser.Scene {
  public controls: Controls;
  public client: Client;
  public currentPlayer: Player;
  public players: Map<string, Player>;

  private snapshot: SnapshotData;

  constructor() {
    super('game');
    this.players = new Map<string, Player>();
  }

  init({ client, snapshot }: { client: Client; snapshot: SnapshotData }) {
    this.client = client;
    this.snapshot = snapshot;

    // Start in normal mode
    this.game.registry.set('mode', Mode.Normal);

  }

  preload() {
    this.load.image("world-tiles", WorldTiles);
    this.load.atlas("player", PlayerPNG, PlayerJSON);
  }

  create() {
    // When loading a CSV map, make sure to specify the tileWidth and tileHeight!
    const map = this.make.tilemap({ data: this.snapshot.map.data, tileWidth: 16, tileHeight: 16 });
    const tileset = map.addTilesetImage("world-tiles");
    map.createLayer(0, tileset, 0, 0); // layer index, tileset, x, y

    // Setup animations
    this.#setupAnimations();

    for (const p of this.snapshot.players) {
      const player = new Player(
        this.physics.add.sprite(0, 0, "player"),
        new Phaser.Math.Vector2(p.x, p.y),
      );

      this.players.set(p.id, player);

      if (p.id === this.client.id) {
        this.currentPlayer = player;
      }
    }

    // Setup controls
    this.controls = new Controls(this);

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    const camera = this.cameras.main;
    camera.roundPixels = true;
    camera.startFollow(this.currentPlayer.sprite);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setViewport(0, 0, this.game.scale.width, this.game.scale.height - Status.DefaultHeight);

    this.scale.addListener(Phaser.Scale.Events.RESIZE, (gameSize: Phaser.Structs.Size) => {
      camera.setViewport(0, 0, gameSize.width, gameSize.height - Status.DefaultHeight);
    });

    // Add additional scenes
    this.scene.add("status", Status, true, { currentPlayer: this.currentPlayer });
  }

  update(_: number, delta: number) {
    for (const cmd of this.client.commands()) {
      this.#handleCommand(cmd)
    }

    if (this.mode === Mode.Normal) {
      // TODO: we should use events rather than update every time
      this.input.enabled = true;
      this.controls.update();
    } else {
      // TODO: we should use events rather than update every time
      this.input.enabled = false;
    }

    for (const player of this.players.values()) {
      player.update(delta);
    }
  }

  #handleCommand(cmd: Command) {
    switch(cmd.type) {
      case CommandType.AddPlayer: {
        const data = <PlayerData>cmd.data;
        const player = new Player(
          this.physics.add.sprite(0, 0, "player"),
          new Phaser.Math.Vector2(data.x, data.y),
        );
        this.players.set(data.id, player);
      } break;
      case CommandType.RemovePlayer: {
        const data = <PlayerData>cmd.data;
        const player = this.players.get(data.id);

        if (player) {
          this.players.delete(data.id);
          player.destroy();
        }
      } break;
      case CommandType.MovePlayer: {
        const data = <PlayerData>cmd.data;
        const player = this.players.get(data.id)

        if (player) {
          player.moveTo(data.x, data.y);
        }
      } break;
    }
  }

  // TODO: animations should live with the entity itself
  #setupAnimations() {
    const anims = this.anims;

    // player animations
    anims.create({
      key: "player-walk-left",
      frames: anims.generateFrameNames("player", { prefix: "walk/left/", start: 1, end: 6, zeroPad: 0 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "player-walk-right",
      frames: anims.generateFrameNames("player", { prefix: "walk/right/", start: 1, end: 6, zeroPad: 0 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "player-walk-up",
      frames: anims.generateFrameNames("player", { prefix: "walk/up/", start: 1, end: 6, zeroPad: 0 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "player-walk-down",
      frames: anims.generateFrameNames("player", { prefix: "walk/down/", start: 1, end: 6, zeroPad: 0 }),
      frameRate: 10,
      repeat: -1
    });
  }

  private get mode(): Mode {
    return this.game.registry.get('mode');
  }
}