import { Fan, Player } from "../types";
import svgToMiniDataURI from "mini-svg-data-uri";

import bodySvg from "../../images/body.svg?raw";
import hairSvg from "../../images/hair.svg?raw";
import legBentSvg from "../../images/legBent.svg?raw";
import legStraightSvg from "../../images/legStraight.svg?raw";
import Handlebars from "handlebars";

const bodyTemplate = Handlebars.compile(bodySvg);
const hairTemplate = Handlebars.compile(hairSvg);
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
    skin: "#C79864",
    skinOutline: "#845D31",
    shirt: "#325BC7",
    shirtOutline: "#4332AD",
    socks: "#325BC7",
    socksOutline: "#4332AD",
    pants: "#D9D9D9",
    pantsOutline: "#777777",
    shoe: "#242424",
    shoeOutline: "#000000",
    hair: "#F3F65D",
    hairOutline: "#CFC249",
  };

  if (player.team === "red") {
    colors.shirt = "#CD2015";
    colors.shirtOutline = "#6F0C06";
    colors.socks = "#CD2015";
    colors.socksOutline = "#6F0C06";
  }

  if (Math.random() < 0.3) {
    colors.skin = "#61401B";
    colors.skinOutline = "#3C2206";
  }

  if (Math.random() < 0.1) {
    colors.shoe = "#D9D9D9";
    colors.shoeOutline = "#777777";
  }

  const assets = {
    body: makeImage(bodyTemplate(colors)),
    hair: makeImage(hairTemplate(colors)),
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
    skin: "#C79864",
    skinOutline: "#845D31",
    shirt: "#325BC7",
    shirtOutline: "#4332AD",
    hair: "#F3F65D",
    hairOutline: "#CFC249",
  };

  if (Math.random() < 0.3) {
    colors.skin = "#61401B";
    colors.skinOutline = "#3C2206";
  }

  const assets = {
    body: makeImage(bodyTemplate(colors)),
    hair: makeImage(hairTemplate(colors)),
  };
  fanCache[fan.id] = assets;
  return assets;
}
