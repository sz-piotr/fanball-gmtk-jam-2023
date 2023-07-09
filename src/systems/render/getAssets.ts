import { Fan, Player } from "../types";
import svgToMiniDataURI from "mini-svg-data-uri";
import Handlebars from "handlebars";

import hairBaldSvg from "../../images/hairBald.svg?raw";
import hairShortSvg from "../../images/hairShort.svg?raw";
import hairSpikySvg from "../../images/hairSpiky.svg?raw";
import hairHelmetSvg from "../../images/hairHelmet.svg?raw";
import hairStripedSvg from "../../images/hairStriped.svg?raw";
import hairCurlySvg from "../../images/hairCurly.svg?raw";

import bodySvg from "../../images/body.svg?raw";
import legBentSvg from "../../images/legBent.svg?raw";
import legStraightSvg from "../../images/legStraight.svg?raw";
import { randomWeightedChoice } from "../../utils/random";
import { assert } from "../../utils/assert";

const hairBaldTemplate = Handlebars.compile(hairBaldSvg);
const hairShortTemplate = Handlebars.compile(hairShortSvg);
const hairSpikyTemplate = Handlebars.compile(hairSpikySvg);
const hairHelmetTemplate = Handlebars.compile(hairHelmetSvg);
const hairStripedTemplate = Handlebars.compile(hairStripedSvg);
const hairCurlyTemplate = Handlebars.compile(hairCurlySvg);

const hairTemplates = [
  { weight: 3, value: hairBaldTemplate },
  { weight: 2, value: hairSpikyTemplate },
  { weight: 1, value: hairStripedTemplate },
  { weight: 4, value: hairHelmetTemplate },
  { weight: 10, value: hairCurlyTemplate },
  { weight: 20, value: hairShortTemplate },
];

const hairColors = [
  { weight: 20, value: { hair: "#F3F65D", hairOutline: "#CFC249" } },
  { weight: 20, value: { hair: "#815522", hairOutline: "#482C0B" } },
  { weight: 20, value: { hair: "#242424", hairOutline: "#000000" } },
  { weight: 10, value: { hair: "#CB901E", hairOutline: "#986709" } },
  { weight: 2, value: { hair: "#F77171", hairOutline: "#B91D1D" } },
  { weight: 2, value: { hair: "#AB29CB", hairOutline: "#5A0C6D" } },
];

const skinColors = [
  { weight: 1, value: { skin: "#FFE8CE", skinOutline: "#C7B097" } },
  { weight: 1, value: { skin: "#F8CB9A", skinOutline: "#CD8C43" } },
  { weight: 1, value: { skin: "#C79864", skinOutline: "#845D31" } },
  { weight: 1, value: { skin: "#61401B", skinOutline: "#3C2206" } },
  { weight: 1, value: { skin: "#412F1B", skinOutline: "#1C1105" } },
];

const fanShirtColors = [
  { weight: 15, value: { shirt: "#325BC7", shirtOutline: "#4332AD" } },
  { weight: 15, value: { shirt: "#597EDD", shirtOutline: "#4F41A5" } },
  { weight: 3, value: { shirt: "#D9D9D9", shirtOutline: "#777777" } },
  { weight: 3, value: { shirt: "#242424", shirtOutline: "#000000" } },
];

function getRandomHair() {
  const random = randomWeightedChoice(hairTemplates);
  assert(random, "No hair!");
  return random;
}

function getRandomHairColor() {
  const random = randomWeightedChoice(hairColors);
  assert(random, "No hair!");
  return random;
}

function getRandomSkinColor() {
  const random = randomWeightedChoice(skinColors);
  assert(random, "No skin!");
  return random;
}

function getRandomFanShirtColor() {
  const random = randomWeightedChoice(fanShirtColors);
  assert(random, "No shirt!");
  return random;
}

const bodyTemplate = Handlebars.compile(bodySvg);
const legBentTemplate = Handlebars.compile(legBentSvg);
const legStraightTemplate = Handlebars.compile(legStraightSvg);

export interface PlayerAssets {
  body: HTMLImageElement;
  hair: HTMLImageElement;
  legStraight: HTMLImageElement;
  legBent: HTMLImageElement;
}

export interface FanAssets {
  body: HTMLImageElement;
  hair: HTMLImageElement;
}

const playerCache: Record<string, PlayerAssets> = {};
const fanCache: Record<string, FanAssets> = {};

export function getPlayerAssets(player: Player): PlayerAssets {
  const cached = playerCache[player.id];
  if (cached) {
    return cached;
  }

  const colors = {
    shirt: "#325BC7",
    shirtOutline: "#4332AD",
    socks: "#325BC7",
    socksOutline: "#4332AD",
    pants: "#D9D9D9",
    pantsOutline: "#777777",
    shoe: "#242424",
    shoeOutline: "#000000",
    ...getRandomSkinColor(),
    ...getRandomHairColor(),
  };

  if (player.team === "red") {
    colors.shirt = "#CD2015";
    colors.shirtOutline = "#6F0C06";
    colors.socks = "#CD2015";
    colors.socksOutline = "#6F0C06";
  }

  if (Math.random() < 0.1) {
    colors.shoe = "#D9D9D9";
    colors.shoeOutline = "#777777";
  }

  const assets = {
    body: makeImage(bodyTemplate(colors)),
    hair: makeImage(getRandomHair()(colors)),
    legStraight: makeImage(legStraightTemplate(colors)),
    legBent: makeImage(legBentTemplate(colors)),
  };
  playerCache[player.id] = assets;
  return assets;
}

function makeImage(svg: string) {
  const uri = svgToMiniDataURI(svg);
  const image = new Image();
  image.src = uri;
  return image;
}

export function getFanAssets(fan: Fan) {
  const cached = fanCache[fan.id];
  if (cached) {
    return cached;
  }

  const colors = {
    ...getRandomFanShirtColor(),
    ...getRandomSkinColor(),
    ...getRandomHairColor(),
  };

  const assets = {
    body: makeImage(bodyTemplate(colors)),
    hair: makeImage(getRandomHair()(colors)),
  };
  fanCache[fan.id] = assets;
  return assets;
}
