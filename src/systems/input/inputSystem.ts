import { KeyboardInput } from "./KeyboardInput";
import { MappedInput } from "./MappedInput";

const mapping = {
  left: "ArrowLeft",
  right: "ArrowRight",
  up: "ArrowUp",
  down: "ArrowDown",
};

export type Actions = keyof typeof mapping;
export type Input = MappedInput<Actions>;

export function initInput() {
  const keyboardInput = new KeyboardInput();
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
