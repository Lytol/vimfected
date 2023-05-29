import WorldTiles from '../assets/world-tiles.png';
import WorldMap from '../assets/map.csv?url';
import PlayerPNG from '../assets/player.png';
import PlayerJSON from '../assets/player.json';

export default class Game extends Phaser.Scene {
  controls: Phaser.Cameras.Controls.FixedKeyControl;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

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

    // Setup player
    this.player = this.physics.add.sprite(400, 350, "player", "static/down");

    // Set up the arrows to control the camera
    this.cursors = this.input.keyboard.createCursorKeys();

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // players animations
    const anims = this.anims;
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

  update(time, delta) {
    const speed = 100;

    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    if (this.cursors.left.isDown) {
      this.player.anims.play("player-walk-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("player-walk-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("player-walk-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("player-walk-down", true);
    } else {
      this.player.anims.stop();

      // If we were moving, pick and idle frame to use
      // if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
      // else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
      // else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
      // else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
    }
  }
}