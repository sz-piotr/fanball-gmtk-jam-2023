import { Sector, World } from "../types";

import blueGoalPng from "../../images/banners/blueGoal.png";
import blueOutPng from "../../images/banners/blueOut.png";
import redGoalPng from "../../images/banners/redGoal.png";
import redOutPng from "../../images/banners/redOut.png";
import gmtkPng from "../../images/banners/gmtk.png";
import gameJamPng from "../../images/banners/gameJam.png";
import halfTimePng from "../../images/banners/halfTime.png";
import youLosePng from "../../images/banners/youLose.png";
import youWinPng from "../../images/banners/youWin.png";
import maskPng from "../../images/banners/mask.png";

const blueGoalBanner = new Image();
blueGoalBanner.src = blueGoalPng;

const blueOutBanner = new Image();
blueOutBanner.src = blueOutPng;

const redGoalBanner = new Image();
redGoalBanner.src = redGoalPng;

const redOutBanner = new Image();
redOutBanner.src = redOutPng;

const gmtkBanner = new Image();
gmtkBanner.src = gmtkPng;

const gameJamBanner = new Image();
gameJamBanner.src = gameJamPng;

const halfTimeBanner = new Image();
halfTimeBanner.src = halfTimePng;

const youLoseBanner = new Image();
youLoseBanner.src = youLosePng;

const youWinBanner = new Image();
youWinBanner.src = youWinPng;

const maskBanner = new Image();
maskBanner.src = maskPng;

const bannerMapping = {
  "blue-goal": blueGoalBanner,
  "blue-out": blueOutBanner,
  "red-goal": redGoalBanner,
  "red-out": redOutBanner,
  "you-win": youWinBanner,
  "you-lose": youLoseBanner,
  "half-time": halfTimeBanner,
};

export function renderBanners(ctx: CanvasRenderingContext2D, world: World) {
  if (world.banner.image === undefined) {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    for (const sector of world.sectors) {
      drawBanner(ctx, maskBanner, sector);
    }
    ctx.restore();
  } else if (world.banner.image === "gmtk") {
    for (const sector of world.sectors) {
      drawBanner(ctx, sector.id % 2 === 0 ? gmtkBanner : gameJamBanner, sector);
    }
  } else {
    const banner = bannerMapping[world.banner.image];
    for (const sector of world.sectors) {
      drawBanner(ctx, banner, sector);
    }
  }
}

function drawBanner(
  ctx: CanvasRenderingContext2D,
  banner: HTMLImageElement,
  sector: Sector
) {
  ctx.drawImage(
    banner,
    sector.displayArea.position.x,
    sector.displayArea.position.y,
    sector.displayArea.size.x,
    sector.displayArea.size.y
  );
}
