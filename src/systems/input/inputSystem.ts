import { KeyboardInput } from "./KeyboardInput";
import { MappedInput } from "./MappedInput";

const mapping = {
  sector1: "KeyQ",
  sector2: "KeyW",
  sector3: "KeyE",
  sector4: "KeyR",
  sector5: "KeyT",
  sector6: "KeyY",
  boo: "ShiftLeft",
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
