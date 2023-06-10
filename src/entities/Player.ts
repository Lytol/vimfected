import { Direction, TILE_SIZE } from '../utils/constants';

export default class Player {
  static readonly SPEED = TILE_SIZE*4;

  private movement: Direction = Direction.None;
  private pixelsMoved: number = 0;

  constructor(
    public sprite: Phaser.GameObjects.Sprite,
    public position: Phaser.Math.Vector2,
  ) {
    const offsetX = TILE_SIZE / 2;
    const offsetY = TILE_SIZE;

    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      this.position.x * TILE_SIZE + offsetX,
      this.position.y * TILE_SIZE + offsetY
    );

    this.sprite.setFrame("static/down");
  }

  update(delta: number): void {
    if (this.movement === Direction.None) return;

    let stopMoving = false;
    let positionChange = delta / 1000 * Player.SPEED;

    if (this.pixelsMoved + positionChange >= TILE_SIZE) {
      positionChange = TILE_SIZE - this.pixelsMoved;
      stopMoving = true;
    }

    switch (this.movement) {
      case Direction.Left:
        this.sprite.x -= positionChange;
        break;
      case Direction.Right:
        this.sprite.x += positionChange;
        break;
      case Direction.Up:
        this.sprite.y -= positionChange;
        break;
      case Direction.Down:
        this.sprite.y += positionChange;
        break;
    }

    if (stopMoving) {
      this.sprite.anims.stop();
      this.sprite.setFrame(`static/${this.movement}`)
      this.movement = Direction.None;
    } else {
      this.pixelsMoved += positionChange;
    }
  }

  move(direction: Direction): void {
    if (this.movement !== Direction.None) {
      return;
    }

    this.movement = direction;
    this.pixelsMoved = 0;

    switch (this.movement) {
      case Direction.Left:
        this.position.x -= 1;
        this.sprite.anims.play("player-walk-left", true);
        break;
      case Direction.Right:
        this.position.x += 1;
        this.sprite.anims.play("player-walk-right", true);
        break;
      case Direction.Up:
        this.position.y -= 1;
        this.sprite.anims.play("player-walk-up", true);
        break;
      case Direction.Down:
        this.position.y += 1;
        this.sprite.anims.play("player-walk-down", true);
        break;
    }
  }
}