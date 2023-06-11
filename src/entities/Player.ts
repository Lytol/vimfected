import { Direction, TILE_SIZE } from '../utils/constants';

const tileToScreen = (pos: Phaser.Math.Vector2) => new Phaser.Math.Vector2(
  pos.x * TILE_SIZE + (TILE_SIZE / 2),
  pos.y * TILE_SIZE + TILE_SIZE,
);

export default class Player {
  static readonly SPEED = TILE_SIZE * 4;

  private moving: Direction = Direction.None;

  constructor(
    public sprite: Phaser.GameObjects.Sprite,
    public position: Phaser.Math.Vector2,
  ) {
    this.sprite.setOrigin(0.5, 1);

    const coords = tileToScreen(position);

    this.sprite.setPosition(
      coords.x,
      coords.y,
    );

    this.sprite.setFrame("static/down");
  }

  destroy() {
    this.sprite.destroy(true);
  }

  update(delta: number): void {
    if (this.moving === Direction.None) return;

    let stopMoving = false;

    const current = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    const target = tileToScreen(this.position);
    const diff = new Phaser.Math.Vector2(target.x, target.y).subtract(current);
    const movement = new Phaser.Math.Vector2(diff.x, diff.y).normalize().scale(Player.SPEED * (delta / 1000));

    if (movement.length() >= diff.length()) {
      this.sprite.setPosition(target.x, target.y);
      stopMoving = true;
    } else {
      this.sprite.x += movement.x;
      this.sprite.y +=  movement.y;
    }

    if (stopMoving) {
      this.sprite.anims.stop();
      this.sprite.setFrame(`static/${this.moving}`)
      this.moving = Direction.None;
    }
  }

  moveTo(x: number, y: number) {
    const currentX = this.position.x;
    const currentY = this.position.y;

    if (x === currentX && y === currentY) {
      return;
    }

    switch(true) {
      case x < currentX:
        this.moving = Direction.Left;
        this.sprite.anims.play("player-walk-left", true);
        break;
      case x > currentX:
        this.moving = Direction.Right;
        this.sprite.anims.play("player-walk-right", true);
        break;
      case y < currentY:
        this.moving = Direction.Up;
        this.sprite.anims.play("player-walk-up", true);
        break;
      case y > currentY:
        this.moving = Direction.Down;
        this.sprite.anims.play("player-walk-down", true);
        break;
    }

    this.position.x = x;
    this.position.y = y;
  }

  isMoving(): boolean {
    return this.moving !== Direction.None;
  }
}