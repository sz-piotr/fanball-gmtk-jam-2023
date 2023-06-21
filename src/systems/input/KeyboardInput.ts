export class KeyboardInput {
  private pressedKeys = new Set<string>();
  private justPressedKeys = new Set<string>();
  private justReleasedKeys = new Set<string>();

  startListening() {
    const onPressed = (e: KeyboardEvent) => {
      console.debug(this.constructor.name, "onPressed", e.key);
      this.pressedKeys.add(e.key);
      this.justPressedKeys.add(e.key);
    };
    window.addEventListener("keydown", onPressed);
    const onReleased = (e: KeyboardEvent) => {
      console.debug(this.constructor.name, "onReleased", e.key);
      this.pressedKeys.delete(e.key);
      this.justReleasedKeys.add(e.key);
    };
    window.addEventListener("keyup", onReleased);

    return {
      stopListening: () => {
        window.removeEventListener("keydown", onPressed);
        window.removeEventListener("keyup", onReleased);
      },
    };
  }

  clearRecentEvents() {
    this.justPressedKeys.clear();
    this.justReleasedKeys.clear();
  }

  isPressed(key: string) {
    return this.pressedKeys.has(key);
  }

  isJustPressed(key: string) {
    return this.justPressedKeys.has(key);
  }

  isJustReleased(key: string) {
    return this.justReleasedKeys.has(key);
  }
}
