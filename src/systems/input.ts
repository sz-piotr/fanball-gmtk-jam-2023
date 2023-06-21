import { KeyboardInput } from "../input/KeyboardInput";
import { MappedInput } from "../input/MappedInput";

export type Actions = "left" | "right" | "up" | "down";
export type Input = MappedInput<Actions>;

export function initInput() {
  const keyboardInput = new KeyboardInput();
  const mapping: Record<Actions, string> = {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
  };
  const mappedInput = new MappedInput(keyboardInput, mapping);

  keyboardInput.startListening();

  return {
    keyboardInput,
    mappedInput,
  };
}

export function updateInput(keyboardInput: KeyboardInput) {
  keyboardInput.clearRecentEvents();
}
