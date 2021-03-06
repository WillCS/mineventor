export class Vec2 {
  private _x: number;
  private _y: number;

  private lastLength: number = 0;
  private lengthChanged: boolean = true;

  public set x(value: number) {
    this.lengthChanged = true;
    this._x = value;
  }

  public get x(): number {
    return this._x;
  }

  public set y(value: number) {
    this.lengthChanged = true;
    this._y = value;
  }

  public get y(): number {
    return this._y;
  }

  public constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public multiply(n: number): Vec2 {
    return new Vec2(this.x * n, this.y * n);
  }

  public divide(n: number): Vec2 {
    return new Vec2(this.x / n, this.y / n);
  }

  public add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  public subtract(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  public dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  public get lengthSquared(): number {
    return this.dot(this);
  }

  public get length(): number {
    if (this.lengthChanged) {
      this.lastLength = Math.sqrt(this.lengthSquared);
      this.lengthChanged = false;
    }

    return this.lastLength;
  }

  public normalize(): Vec2 {
    return this.divide(this.length);
  }

  public negate(): Vec2 {
    return this.multiply(-1);
  }

  public toArray(): number[] {
    return [this.x, this.y];
  }

  public static fromArray(vec: number[]): Vec2 {
    return new Vec2(vec[0], vec[1]);
  }

  public toVec3(z: number = 0): Vec3 {
    return new Vec3(this.x, this.y, z);
  }

  public toVec4(z: number = 0, w: number = 0): Vec4 {
    return new Vec4(this.x, this.y, z, w);
  }

  public copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  public static one(): Vec2 {
    return new Vec2(1, 1);
  }

  public static zero(): Vec2 {
    return new Vec2(0, 0);
  }
}

export class Vec3 {
  private _x: number;
  private _y: number;
  private _z: number;

  private lastLength: number = 0;
  private lengthChanged: boolean = true;

  public set x(value: number) {
    this.lengthChanged = true;
    this._x = value;
  }

  public get x(): number {
    return this._x;
  }

  public set y(value: number) {
    this.lengthChanged = true;
    this._y = value;
  }

  public get y(): number {
    return this._y;
  }

  public set z(value: number) {
    this.lengthChanged = true;
    this._z = value;
  }

  public get z(): number {
    return this._z;
  }

  public constructor(x: number, y: number, z: number) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  public multiply(n: number): Vec3 {
    return new Vec3(this.x * n, this.y * n, this.z * n);
  }

  public divide(n: number): Vec3 {
    return new Vec3(this.x / n, this.y / n, this.z / n);
  }

  public add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  public subtract(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  public dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  public cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  public triple(v1: Vec3, v2: Vec3): Vec3 {
    return this.cross(v1.cross(v2));
  }

  public get lengthSquared(): number {
    return this.dot(this);
  }

  public get length(): number {
    if (this.lengthChanged) {
      this.lastLength = Math.sqrt(this.lengthSquared);
      this.lengthChanged = false;
    }

    return this.lastLength;
  }

  public normalize(): Vec3 {
    return this.divide(this.length);
  }

  public negate(): Vec3 {
    return this.multiply(-1);
  }

  public toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  public static fromArray(vec: number[]): Vec3 {
    return new Vec3(vec[0], vec[1], vec[2]);
  }

  public toVec4(w: number = 0): Vec4 {
    return new Vec4(this.x, this.y, this.z, w);
  }

  public copy(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  public static one(): Vec3 {
    return new Vec3(1, 1, 1);
  }

  public static zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }
}

export class Vec4 {
  private _x: number;
  private _y: number;
  private _z: number;
  private _w: number;

  private lastLength: number = 0;
  private lengthChanged: boolean = true;

  public set x(value: number) {
    this.lengthChanged = true;
    this._x = value;
  }

  public get x(): number {
    return this._x;
  }

  public set y(value: number) {
    this.lengthChanged = true;
    this._y = value;
  }

  public get y(): number {
    return this._y;
  }

  public set z(value: number) {
    this.lengthChanged = true;
    this._z = value;
  }

  public get z(): number {
    return this._z;
  }

  public set w(value: number) {
    this._w = value;
    this.lengthChanged = true;
  }

  public get w(): number {
    return this._w;
  }

  public constructor(x: number, y: number, z: number, w: number = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  public multiply(n: number): Vec4 {
    return new Vec4(this.x * n, this.y * n, this.z * n, this.w * n);
  }

  public divide(n: number): Vec4 {
    return new Vec4(this.x / n, this.y / n, this.z / n, this.w / n);
  }

  public add(v: Vec4): Vec4 {
    return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
  }

  public subtract(v: Vec4): Vec4 {
    return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
  }

  public dot(v: Vec4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  public get lengthSquared(): number {
    return this.dot(this);
  }

  public get length(): number {
    if (this.lengthChanged) {
      this.lastLength = Math.sqrt(this.lengthSquared);
      this.lengthChanged = false;
    }

    return this.lastLength;
  }

  public normalize(): Vec4 {
    return this.divide(this.length);
  }

  public negate(): Vec4 {
    return this.multiply(-1);
  }

  public toArray(): number[] {
    return [this.x, this.y, this.z, this.w];
  }

  public static fromArray(vec: number[]): Vec4 {
    return new Vec4(vec[0], vec[1], vec[2], vec[3]);
  }

  public toVec3(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  public copy(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  public static one(): Vec4 {
    return new Vec4(1, 1, 1, 1);
  }

  public static zero(): Vec4 {
    return new Vec4(0, 0, 0, 0);
  }
}
