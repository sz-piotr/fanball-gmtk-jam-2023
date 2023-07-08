import { Vector2 } from "./Vector2";

export class Rect {
  constructor(public position: Vector2, public size: Vector2) {}

  clone() {
    return new Rect(this.position.clone(), this.size.clone());
  }

  contains(vector: Vector2) {
    return (
      vector.x >= this.position.x &&
      vector.x <= this.position.x + this.size.x &&
      vector.y >= this.position.y &&
      vector.y <= this.position.y + this.size.y
    );
  }
}
