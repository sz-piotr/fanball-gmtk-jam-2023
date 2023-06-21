import { KeyboardInput } from "./KeyboardInput";

export class MappedInput<T extends string> {
  constructor(
    private readonly keyboardInput: KeyboardInput,
    private readonly mapping: Record<T, string>
  ) {}

  isPressed(key: T) {
    return this.keyboardInput.isPressed(this.mapping[key]);
  }

  isJustPressed(key: T) {
    return this.keyboardInput.isJustPressed(this.mapping[key]);
  }

  isJustReleased(key: T) {
    return this.keyboardInput.isJustReleased(this.mapping[key]);
  }
}
