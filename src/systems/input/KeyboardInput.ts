export class KeyboardInput {
  private pressedKeys = new Set<string>();
  private justPressedKeys = new Set<string>();
  private justReleasedKeys = new Set<string>();

  startListening() {
    const onPressed = (e: KeyboardEvent) => {
      this.pressedKeys.add(e.code);
      this.justPressedKeys.add(e.code);
    };
    window.addEventListener("keydown", onPressed);
    const onReleased = (e: KeyboardEvent) => {
      this.pressedKeys.delete(e.code);
      this.justReleasedKeys.add(e.code);
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
