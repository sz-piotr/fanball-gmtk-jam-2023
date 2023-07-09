import { clamp } from "../../utils/clamp";
import { Input } from "../input/inputSystem";
import { Sector } from "../types";

export function updateSector(sector: Sector, input: Input, deltaTime: number) {
  if (input.isPressed(`sector${sector.id}`)) {
    if (input.isPressed("boo")) {
      sector.isCheering = false;
      sector.isBooing = true;

      sector.energy -= 20 * deltaTime;
    } else {
      sector.isCheering = true;
      sector.isBooing = false;

      sector.energy -= 10 * deltaTime;
    }
  } else {
    sector.isCheering = false;
    sector.isBooing = false;

    sector.energy += sector.energyRegeneration * deltaTime;
  }

  sector.energy = clamp(sector.energy, 0, 100);
  if (sector.energy === 0) {
    sector.isCheering = false;
    sector.isBooing = false;
  }
}
