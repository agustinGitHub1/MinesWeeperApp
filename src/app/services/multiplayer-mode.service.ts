import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MinesWeeperGameService } from './mines-weeper-game.service';

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {
  private playerBoardsSubject = new BehaviorSubject<{ player1: any[][]; player2: any[][] }>({
    player1: [],
    player2: [],
  });

  playerBoards$ = this.playerBoardsSubject.asObservable();

  private player1State = { timer: 0, minas: 5 };
  private player2State = { timer: 0, minas: 5 };

  // Example methods to manage individual states
  setPlayer1Mines(minas: number) {
    this.player1State.minas = minas;
  }

  getPlayer1Mines() {
    return this.player1State.minas;
  }

  setPlayer2Mines(minas: number) {
    this.player2State.minas = minas;
  }

  getPlayer2Mines() {
    return this.player2State.minas;
  }

  // Similarly, handle timers for each player
  setPlayer1Timer(timer: number) {
    this.player1State.timer = timer;
  }

  getPlayer1Timer() {
    return this.player1State.timer;
  }

  setPlayer2Timer(timer: number) {
    this.player2State.timer = timer;
  }

  getPlayer2Timer() {
    return this.player2State.timer;
  }
}
