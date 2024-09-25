import { Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GameConfigComponent } from '../components/mines-weeper/game-config/game-config.component';

interface GameConfig {
  filas: number;
  columnas: number;
  minas: number;
}

interface GameState {
  tablero: Cell[][];
  elapsedTime: number;
  fechaInicio: Date;
}

export interface Cell {
  estado: any;
  valor: any;
  isDiscovered: boolean;
  isFlagged: boolean;
  isMine: boolean;
  surroundingMines: number;
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class MinesWeeperGameService {
  playerOneConfig!: GameConfig;
  playerTwoConfig!: GameConfig;
  private defaultConfig: GameConfig = { filas: 10, columnas: 10, minas: 5 };
  private gameConfig = new BehaviorSubject<GameConfig>(this.defaultConfig);
  gameConfig$ = this.gameConfig.asObservable();
  private newGameSubject = new Subject<{ isNewGame: boolean }>();
  newGame$ = this.newGameSubject.asObservable();
  private minesLeftSubject = new BehaviorSubject<number>(0);
  minesLeft$ = this.minesLeftSubject.asObservable();
  private startTimerSubject = new Subject<void>();
  startTimer$ = this.startTimerSubject.asObservable();
  private stopTimerSubject = new Subject<void>();
  stopTimer$ = this.stopTimerSubject.asObservable();
  tablero: Cell[][] = [];
  elapsedTime: any;
  isTimerRunning: any;

  returnCurrentGameConfig() {
    return this.gameConfig.getValue();
  }

  updateGameConfig(newConfig: GameConfig) {
    this.gameConfig.next(newConfig);
  }

  updateMinesLeft(minas: number) {
    this.minesLeftSubject.next(minas);
  }

  startTimer() {
    this.startTimerSubject.next();
  }

  stopTimer() {
    this.stopTimerSubject.next();
  }

  playSound(rutaSonido: string) {
    const audio = new Audio(rutaSonido);
    audio.play();
  }

  saveGameProgress(
    elapsedTime: number,
    isTimerRunning: boolean,
    startDate: Date,
    minesLeft: number,
    player: number = 0,
  ) {
    const gameState = {
      config: this.gameConfig.getValue(),
      minesLeft: minesLeft,
      tablero: this.tablero.map((row) =>
        row.map((cell) => ({
          valor: cell.valor,
          estado: cell.estado,
        }))
      ),
      elapsedTime: elapsedTime,
      isTimerRunning: isTimerRunning,
      startDate: startDate,
    };

    localStorage.setItem(
      `minesweeperGamePlayer${player}`,
      JSON.stringify(gameState)
    );
  }

  loadGameProgress() {
    const savedGame = localStorage.getItem('minesweeperGamePlayer0');
    if (savedGame) {
      const { minesLeft, tablero, elapsedTime, isTimerRunning } =
        JSON.parse(savedGame);

      this.updateMinesLeft(minesLeft);

      this.tablero = tablero.map((row: any[]) =>
        row.map((cell) => ({
          valor: cell.valor,
          estado: cell.estado,
        }))
      );

      this.elapsedTime = elapsedTime;
      this.isTimerRunning = isTimerRunning;

      if (this.isTimerRunning) {
        this.startTimer();
      }

      this.newGameSubject.next({ isNewGame: false });
    }
  }

  saveGameResult(
    startTime: Date,
    endTime: Date,
    difficulty: string,
    totalTimeSpent: number,
    status: string,
  ) {
    const storedGames = localStorage.getItem('playerGames');
    const games = storedGames ? JSON.parse(storedGames) : [];

    const gameResult = {
      startTime: startTime,
      endTime: endTime,
      difficulty: difficulty,
      totalTimeSpent: totalTimeSpent,
      status: status
    };

    games.push(gameResult);

    localStorage.setItem('playerGames', JSON.stringify(games));
  }

  setTablero(tablero: Cell[][]) {
    this.tablero = tablero;
  }

  updatePlayerConfig(
    player: number,
    config: { filas: number; columnas: number; minas: number }
  ) {
    if (player === 1) {
      this.playerOneConfig = config;
    } else if (player === 2) {
      this.playerTwoConfig = config;
    }
  }

  getPlayerConfig(player: number) {
    return player === 1 ? this.playerOneConfig : this.playerTwoConfig;
  }
}
