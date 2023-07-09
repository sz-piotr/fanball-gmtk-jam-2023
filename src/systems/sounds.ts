import { Howl } from "howler";
import { randomChoice } from "../utils/random";

import crowdMp3 from "../audio/crowd.mp3";
import kickMp3 from "../audio/kick.mp3";
import whistleMp3 from "../audio/whistle.mp3";
import cheeringMp3 from "../audio/cheering.mp3";
import { clamp } from "../utils/clamp";

const crowdAmbiance = new Howl({
  src: [crowdMp3],
  html5: true,
  loop: true,
});

const crowdCheering = new Howl({
  src: [cheeringMp3],
  html5: true,
  loop: true,
});

export const kickSound = new Howl({
  src: [kickMp3],
});

export const whistle = new Howl({
  src: [whistleMp3],
  sprite: {
    short1: [800, 1000],
    short2: [9500, 1000],
    short3: [15500, 1000],
    long1: [3500, 1000],
    long2: [18500, 1000],
  },
});

export function playLongWhistle() {
  whistle.play(randomChoice(["long1", "long2"]));
}

export function playShortWhistle() {
  whistle.play(randomChoice(["short1", "short2", "short3"]));
}

// Howler.volume(0);

let cheerVolume = 0;
const VOLUME_SPEED = 0.01;

export function cheer(level: number) {
  const targetVolume = Math.sqrt(clamp(level, 0, 6) / 6);
  if (cheerVolume < targetVolume) {
    cheerVolume += VOLUME_SPEED;
  } else if (cheerVolume > targetVolume) {
    cheerVolume -= VOLUME_SPEED;
  }

  cheerVolume = clamp(cheerVolume, 0, 1);

  crowdCheering.volume(cheerVolume);
}

export function initMusic() {
  crowdCheering.volume(0);
  crowdAmbiance.volume(0.5);
  kickSound.volume(0.5);
  whistle.volume(1);

  crowdAmbiance.play();
  crowdCheering.play();
}
