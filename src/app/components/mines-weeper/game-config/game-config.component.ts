import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MinesWeeperGameService } from '../../../services/mines-weeper-game.service';
import { ASSET_CONSTANTS } from '../../../constants/asset.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-config',
  templateUrl: './game-config.component.html',
  styleUrls: ['./game-config.component.scss'],
})
export class GameConfigComponent implements OnDestroy, OnChanges, OnInit {
  @Input() isMultiplayerMode: boolean = false;
  @Input() isPrincipalGameConfig: boolean = false;
  @Output() configUpdated = new EventEmitter<{ filas: number; columnas: number; minas: number }>();

  // VARS NO SERVICE:
  @Input() filas2: number = 0;
  @Input() columnas2: number = 0;
  @Input() minas2: number = 0;
  @Output() nuevoJuego = new EventEmitter<{ filas: number, columnas: number, minas: number }>();
  @Input() playerNumber!: 1 | 2;
  @Input() minasRestantes: number = 0;
  @Input() gameStatusFromBoard: string = 'playing';

  filas: number = 10;
  columnas: number = 10;
  minas: number = 5;
  showSettings = false;
  timerDisplay: string = '00:00';
  private timerInterval: any;
  elapsedTime: number = 0;
  selectedDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
  startDate: Date = new Date();

  constructor(private gameService: MinesWeeperGameService, private router: Router) {
    const config = this.gameService.returnCurrentGameConfig();
    this.filas = config.filas;
    this.columnas = config.columnas;
    this.minas = config.minas;
  }
  ngOnInit(): void {
    this.gameService.minesLeft$.subscribe((minesLeft) => {
      this.minasRestantes = minesLeft;
    })
  }
  ngOnChanges(): void {
    if (this.gameStatusFromBoard === 'lost' || this.gameStatusFromBoard === 'won') {
      console.log('GUARDAMOS PROGRESO??')
      this.stopTimer();
      this.gameService.saveGameResult(
        this.startDate,
        new Date(),
        this.selectedDifficulty,
        this.elapsedTime,
        this.gameStatusFromBoard
      );
    }
  }
  ngOnDestroy(): void {
    this.stopTimer();
  }



  setDifficulty(level: 'easy' | 'medium' | 'hard') {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);

    this.selectedDifficulty = level;
    switch (level) {
      case 'easy':
        this.filas2 = 10;
        this.columnas2 = 10;
        this.minas2 = 5;
        break;
      case 'medium':
        this.filas2 = 12;
        this.columnas2 = 12;
        this.minas2 = 10;
        break;
      case 'hard':
        this.filas2 = 15;
        this.columnas2 = 15;
        this.minas2 = 15;
        break;
    }

    this.updateConfig();
  }

  updateConfig() {
    if (this.minas2 > this.filas2 * this.columnas2) {
      this.minas2 =Math.floor(this.filas2 * this.columnas2 * 0.1);
    }
  }

  toggleSettings() {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);

    this.showSettings = !this.showSettings;
  }

  saveSettings() {
    this.startNewGame();
    this.showSettings = false;
  }

  cancelSettings() {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);

    this.showSettings = false;
  }

  startNewGame(isPrincipalGameConfig: boolean = false) {
    this.startDate = new Date();
    this.gameStatusFromBoard = 'playing';
    this.minasRestantes = this.minas2;
    this.elapsedTime = 0;
    this.startTimer();

    this.nuevoJuego.emit({
      filas: this.filas2,
      columnas: this.columnas2,
      minas: this.minas2,
    });
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
      this.updateTimerDisplay2();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  resetTimer() {
    this.elapsedTime = 0;
    this.updateTimerDisplay2();
    this.startTimer();
  }

  updateTimerDisplay2() {
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = this.elapsedTime % 60;

    this.timerDisplay = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  saveGame() {
    this.gameService.saveGameProgress( this.elapsedTime, this.gameService.isTimerRunning, this.startDate, this.minasRestantes);
    this.showSettings = false;
  }

  loadGame() {
    this.gameService.loadGameProgress();
    this.elapsedTime = this.gameService.elapsedTime;

    if (this.gameService.isTimerRunning) {
      this.startTimer();
    } else {
      this.updateTimerDisplay2();
    }

    this.showSettings = false;
  }

  goToMultiplayerMode() {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);
    this.router.navigate(['/multiplayer-mode']);
  }

  goToOneplayerMode() {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);
    this.router.navigate(['/minesweeper']);
  }

  goToScoresList() {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);
    this.router.navigate(['/scores']);
  }
}
