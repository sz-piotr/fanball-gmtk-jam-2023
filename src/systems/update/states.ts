import { Player } from "../types";

export interface PlayingState {
  type: "Playing";
  startingPlayer?: Player;
}

export interface StartingState {
  type: "Starting";
  startingPlayer: Player;
  timeRemaining: number;
}

export interface GoalkeeperKickState {
  type: "GoalkeeperKick";
  startingPlayer: Player;
  timeRemaining: number;
}

export interface OutKickState {
  type: "OutKick";
  startingPlayer: Player;
  timeRemaining: number;
}

export type GameState =
  | PlayingState
  | StartingState
  | GoalkeeperKickState
  | OutKickState;
