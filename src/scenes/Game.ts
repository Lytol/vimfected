import Controls from '../utils/Controls';
import Player from '../entities/Player';

import WorldTiles from '../assets/world-tiles.png';
import WorldMap from '../assets/map.csv?url';
import PlayerPNG from '../assets/player.png';
import PlayerJSON from '../assets/player.json';

export default class Game extends Phaser.Scene {
  player: Player;
  controls: Controls;

  constructor() {
    super();
  }

  preload() {
    this.load.image("world-tiles", WorldTiles);
    this.load.tilemapCSV("map", WorldMap);
    this.load.atlas("player", PlayerPNG, PlayerJSON);
  }

  create() {
    // When loading a CSV map, make sure to specify the tileWidth and tileHeight!
    const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
    const tileset = map.addTilesetImage("world-tiles");
    const layer = map.createLayer(0, tileset, 0, 0); // layer index, tileset, x, y

    // Setup animations
    this.#setupAnimations();

    // Setup player
    this.player = new Player(
      this.physics.add.sprite(0, 0, "player"),
      new Phaser.Math.Vector2(25, 25),
    );

    // Setup controls
    this.controls = new Controls(this.input, this.player);
    this.controls.create();

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    const camera = this.cameras.main;
    camera.roundPixels = true;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update(time: number, delta: number) {
    this.controls.update();
    this.player.update(delta);
    console.log(`x: ${this.player.position.x} / y: ${this.player.position.y}`)
  }

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