import Stats from "stats.js";

export function initStats() {
  const FPS_PANEL = 0;
  const stats = new Stats();
  stats.showPanel(FPS_PANEL);
  document.body.appendChild(stats.dom);
  return stats;
}

export function updateStatsBegin(stats: Stats) {
  stats.begin();
}

export function updateStatsEnd(stats: Stats) {
  stats.end();
}
