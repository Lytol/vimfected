import Controls from '../utils/Controls';
import Player from '../entities/Player';
import Client from '../utils/Client';

import WorldTiles from '../assets/world-tiles.png';
import PlayerPNG from '../assets/player.png';
import PlayerJSON from '../assets/player.json';
import { Command, CommandType, PlayerData, SnapshotData } from '../utils/Commands';

export default class Game extends Phaser.Scene {
  private player: Player;
  private controls: Controls;
  private client: Client;
  private snapshot: SnapshotData;
  private debug: Phaser.GameObjects.Text;

  constructor() {
    super('game');
  }

  init({ client, snapshot }: { client: Client; snapshot: SnapshotData }) {
    this.client = client;
    this.snapshot = snapshot;
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

    // TODO: Handle other player
    for (const p of this.snapshot.players) {
      if (p.id === this.client.id) {
        this.player = new Player(
          this.physics.add.sprite(0, 0, "player"),
          new Phaser.Math.Vector2(p.x, p.y),
        );
      }
    }

    // Setup controls
    this.controls = new Controls(this.input, this.client, this.player);

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    const camera = this.cameras.main;
    camera.roundPixels = true;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Debug text
    this.debug = this.add.text(5, 5, "", { fontSize: '12px', color: '#fff' });
    this.debug.setScrollFactor(0);
  }

  update(_: number, delta: number) {
    // TODO: process events from client
    for (const cmd of this.client.commands()) {
      this.#handleCommand(cmd)
    }

    // TODO: send events from controls
    this.controls.update();

    // TODO: Update game objects accordingly
    this.player.update(delta);

    // DEBUG
    this.debug.setText(`${this.client.id} x:${this.player.position.x} y:${this.player.position.y}`);
  }

  #handleCommand(cmd: Command) {
    switch(cmd.type) {
      case CommandType.MovePlayer:
        const data = <PlayerData>cmd.data;
        // TODO: this only moves the current player
        if (data.id === this.client.id) {
          this.player.moveTo(data.x, data.y);
        }
        break;
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
}