import { clamp } from "../utils/clamp";

export interface Vector2Like {
  x: number;
  y: number;
}

export class Vector2 {
  constructor(public x: number, public y: number) {}

  clone() {
    return new Vector2(this.x, this.y);
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

  equals(vector: Vector2Like): boolean;
  equals(x: number, y: number): boolean;
  equals(a: Vector2Like | number, b?: number) {
    if (typeof a === "number") {
      return this.x === a && (this.y === b ?? a);
    } else {
      return this.x === a.x && this.y === a.y;
    }
  }

  set(vector: Vector2Like): this;
  set(scalar: number): this;
  set(x: number, y: number): this;
  set(a: Vector2Like | number, b?: number) {
    if (typeof a === "number") {
      this.x = a;
      this.y = b ?? a;
    } else {
      this.x = a.x;
      this.y = a.y;
    }
    return this;
  }

  add(vector: Vector2Like): this;
  add(scalar: number): this;
  add(x: number, y: number): this;
  add(a: Vector2Like | number, b?: number) {
    if (typeof a === "number") {
      this.x += a;
      this.y += b ?? a;
    } else {
      this.x += a.x;
      this.y += a.y;
    }
    return this;
  }

  sub(vector: Vector2Like): this;
  sub(scalar: number): this;
  sub(x: number, y: number): this;
  sub(a: Vector2Like | number, b?: number) {
    if (typeof a === "number") {
      this.x -= a;
      this.y -= b ?? a;
    } else {
      this.x -= a.x;
      this.y -= a.y;
    }
    return this;
  }

  mul(vector: Vector2Like): this;
  mul(scalar: number): this;
  mul(x: number, y: number): this;
  mul(a: Vector2Like | number, b?: number) {
    if (typeof a === "number") {
      this.x *= a;
      this.y *= b ?? a;
    } else {
      this.x *= a.x;
      this.y *= a.y;
    }
    return this;
  }

  div(vector: Vector2Like): this;
  div(scalar: number): this;
  div(x: number, y: number): this;
  div(a: Vector2Like | number, b?: number) {
    if (typeof a === "number") {
      this.x /= a;
      this.y /= b ?? a;
    } else {
      this.x /= a.x;
      this.y /= a.y;
    }
    return this;
  }

  mulAdd(vector: Vector2Like, scalar: number) {
    this.x += vector.x * scalar;
    this.y += vector.y * scalar;
    return this;
  }

  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newX = this.x * cos - this.y * sin;
    const newY = this.x * sin + this.y * cos;
    this.x = newX;
    this.y = newY;
    return this;
  }

  normalize() {
    const length = this.length();
    if (length === 0) {
      this.x = 0;
      this.y = 0;
      return this;
    }
    this.x /= length;
    this.y /= length;
    return this;
  }

  clamp(min: Vector2, max: Vector2) {
    this.clampX(min.x, max.x);
    this.clampY(min.y, max.y);
    return this;
  }

  clampX(min: number, max: number) {
    this.x = clamp(this.x, min, max);
  }

  clampY(min: number, max: number) {
    this.y = clamp(this.y, min, max);
  }

  static distance(a: Vector2Like, b: Vector2Like) {
    return Math.sqrt(Vector2.distance2(a, b));
  }

  static distance2(a: Vector2Like, b: Vector2Like) {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return x * x + y * y;
  }

  length() {
    return Math.sqrt(this.length2());
  }

  length2() {
    return this.x * this.x + this.y * this.y;
  }

  toFixed(n: number) {
    this.x = parseFloat(this.x.toFixed(n));
    this.y = parseFloat(this.y.toFixed(n));
    return this;
  }
}
