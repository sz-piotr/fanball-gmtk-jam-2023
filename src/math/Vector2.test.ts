import { describe, expect, it } from "vitest";
import { Vector2 } from "./Vector2";

describe(Vector2.name, () => {
  it("can be constructed", () => {
    const v = new Vector2(1, 2);
    expect(v.x).toEqual(1);
    expect(v.y).toEqual(2);
  });

  it("can be cloned", () => {
    const v1 = new Vector2(1, 2);
    const v2 = v1.clone();

    v1.x = 3;
    v1.y = 4;

    expect(v1.x).toEqual(3);
    expect(v1.y).toEqual(4);

    expect(v2.x).toEqual(1);
    expect(v2.y).toEqual(2);
  });

  describe(Vector2.prototype.set, () => {
    it("works with vectors", () => {
      const v = new Vector2(1, 2).set(new Vector2(3, 4));
      expect(v).toEqual(new Vector2(3, 4));
    });

    it("works with one scalar", () => {
      const v = new Vector2(1, 2).set(3);
      expect(v).toEqual(new Vector2(3, 3));
    });

    it("works with two scalars", () => {
      const v = new Vector2(1, 2).set(3, 4);
      expect(v).toEqual(new Vector2(3, 4));
    });
  });

  describe(Vector2.prototype.add, () => {
    it("works with vectors", () => {
      const v = new Vector2(1, 2).add(new Vector2(3, 4));
      expect(v).toEqual(new Vector2(4, 6));
    });

    it("works with one scalar", () => {
      const v = new Vector2(1, 2).add(3);
      expect(v).toEqual(new Vector2(4, 5));
    });

    it("works with two scalars", () => {
      const v = new Vector2(1, 2).add(3, 4);
      expect(v).toEqual(new Vector2(4, 6));
    });
  });

  describe(Vector2.prototype.mul, () => {
    it("works with vectors", () => {
      const v = new Vector2(1, 2).sub(new Vector2(3, 4));
      expect(v).toEqual(new Vector2(-2, -2));
    });

    it("works with one scalar", () => {
      const v = new Vector2(1, 2).sub(3);
      expect(v).toEqual(new Vector2(-2, -1));
    });

    it("works with two scalars", () => {
      const v = new Vector2(1, 2).sub(3, 4);
      expect(v).toEqual(new Vector2(-2, -2));
    });
  });

  describe(Vector2.prototype.mul, () => {
    it("works with vectors", () => {
      const v = new Vector2(1, 2).mul(new Vector2(3, 4));
      expect(v).toEqual(new Vector2(3, 8));
    });

    it("works with one scalar", () => {
      const v = new Vector2(1, 2).mul(3);
      expect(v).toEqual(new Vector2(3, 6));
    });

    it("works with two scalars", () => {
      const v = new Vector2(1, 2).mul(3, 4);
      expect(v).toEqual(new Vector2(3, 8));
    });
  });

  describe(Vector2.prototype.div, () => {
    it("works with vectors", () => {
      const v = new Vector2(1, 2).div(new Vector2(3, 4));
      expect(v).toEqual(new Vector2(1 / 3, 2 / 4));
    });

    it("works with one scalar", () => {
      const v = new Vector2(1, 2).div(3);
      expect(v).toEqual(new Vector2(1 / 3, 2 / 3));
    });

    it("works with two scalars", () => {
      const v = new Vector2(1, 2).div(3, 4);
      expect(v).toEqual(new Vector2(1 / 3, 2 / 4));
    });
  });

  describe(Vector2.prototype.rotate, () => {
    it("90 degrees", () => {
      const v = new Vector2(1, 2).rotate(Math.PI / 2);
      expect(v.toFixed(6)).toEqual(new Vector2(-2, 1));
    });

    it("180 degrees", () => {
      const v = new Vector2(1, 2).rotate(Math.PI);
      expect(v.toFixed(6)).toEqual(new Vector2(-1, -2));
    });

    it("360 degrees", () => {
      const v = new Vector2(1, 2).rotate(Math.PI * 2);
      expect(v.toFixed(6)).toEqual(new Vector2(1, 2));
    });
  });

  it(Vector2.prototype.length, () => {
    const v = new Vector2(3, 4);
    expect(v.length()).toEqual(5);
  });

  it(Vector2.prototype.length2, () => {
    const v = new Vector2(3, 4);
    expect(v.length2()).toEqual(25);
  });

  it(Vector2.prototype.normalize, () => {
    const v = new Vector2(10, 0).normalize();
    expect(v).toEqual(new Vector2(1, 0));
  });
});
