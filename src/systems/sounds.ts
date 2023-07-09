import { Howl } from "howler";
import { randomChoice } from "../utils/random";
import { clamp } from "../utils/clamp";

import crowdMp3 from "../audio/crowd.mp3";
import kickMp3 from "../audio/kick.mp3";
import whistleMp3 from "../audio/whistle.mp3";
import cheeringMp3 from "../audio/cheering.mp3";
import booingMp3 from "../audio/booing.mp3";
import goalMp3 from "../audio/goal.mp3";

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

const crowdBooing = new Howl({
  src: [booingMp3],
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

export const goalSound = new Howl({
  src: [goalMp3],
  sprite: {
    goal: [5500, 8000],
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

let booVolume = 0;

export function boo(level: number) {
  const targetVolume = Math.sqrt(clamp(level, 0, 6) / 6);
  if (booVolume < targetVolume) {
    booVolume += VOLUME_SPEED;
  } else if (booVolume > targetVolume) {
    booVolume -= VOLUME_SPEED;
  }

  booVolume = clamp(booVolume, 0, 1);

  crowdBooing.volume(booVolume);
}

export function initMusic() {
  crowdCheering.volume(0);
  crowdAmbiance.volume(0.5);
  kickSound.volume(0.5);
  whistle.volume(1);

  crowdAmbiance.play();
  crowdCheering.play();
  crowdBooing.play();
}
