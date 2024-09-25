import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { MinesWeeperGameService } from '../../../services/mines-weeper-game.service';
import { MultiplayerService } from '../../../services/multiplayer-mode.service';
import { GameConfigComponent } from '../game-config/game-config.component';
import { ASSET_CONSTANTS } from '../../../constants/asset.constants';

@Component({
  selector: 'app-multiplayer-mode',
  templateUrl: './multiplayer-mode.component.html',
  styleUrls: ['./multiplayer-mode.component.scss']
})
export class MultiplayerModeComponent implements OnInit {
  @Input() minasLeft: number = 0;

  @ViewChild('tableroPlayerOne') tableroPlayerOne!: BoardComponent;
  @ViewChild('configPlayerOne') configPlayerOne!: GameConfigComponent;
  @ViewChild('tableroPlayerTwo') tableroPlayerTwo!: BoardComponent;
  @ViewChild('configPlayerTwo') configPlayerTwo!: GameConfigComponent;

  filas: number = 10;
  columnas: number = 10;
  minas: number = 5;
  turnoJugador: number = 1;
  minasRestantesNumber1: number = this.minas;
  minasRestantesNumber2: number = this.minas;
  gameStatus1: string = 'playing';
  gameStatus2: string = 'playing';
  player1Board!: any[][];
  player2Board!: any[][];
  player1Config = { filas: 10, columnas: 10, minas: 5 };
  player2Config = { filas: 10, columnas: 10, minas: 5 };
  showModal: boolean = false;
  gameStatusMessage: string = '';

  constructor(private multiplayerService: MultiplayerService, private gameService: MinesWeeperGameService) {}

  ngOnInit(): void {
    this.multiplayerService.playerBoards$.subscribe(boards => {
      this.player1Board = boards.player1;
      this.player2Board = boards.player2;
    });
  }

  iniciarNuevoJuegoPlayer1(config: { filas: number, columnas: number, minas: number }) {
    this.configPlayerOne.timerDisplay = '00:00';
    this.configPlayerOne.elapsedTime = 0;
    this.turnoJugador = 1;
    this.player1Config = config;

    if (this.tableroPlayerOne) {
      this.bloquearTableros();
      this.tableroPlayerOne.nuevoJuego(config);
      this.configPlayerOne.startTimer();
    }


  }

  iniciarNuevoJuegoPlayer2(config: { filas: number, columnas: number, minas: number }, turno?: number) {
    this.configPlayerTwo.timerDisplay = '00:00';
    this.configPlayerTwo.elapsedTime = 0;

    this.player2Config = this.player1Config;
    this.turnoJugador = turno ?? 2;

    if (this.tableroPlayerTwo) {
      this.configPlayerTwo.startTimer();
      this.tableroPlayerTwo.nuevoJuego(this.player2Config);
    }
    this.bloquearTableros();
  }

  minasRestantes1(event: number) {
    this.minasRestantesNumber1 = event;
  }

  minasRestantes2(event: number) {
    this.minasRestantesNumber2 = event;
  }

  gameStatusEventReceiver1(event: string ) {
    this.gameStatus1 = event;
    if (event === 'lost' || event === 'won') {
      this.cambiarTurno();
    }
  }

  gameStatusEventReceiver2(event: string ) {
    this.gameStatus2 = event;
    if (event === 'lost' || event === 'won') {
      this.showWinner();
    }
  }

  showWinner() {
    const player1Lost = this.gameStatus1 === 'lost';
    const player2Lost = this.gameStatus2 === 'lost';


    if (player1Lost && player2Lost ) {
      this.gameStatusMessage = 'Ambos jugadores han perdido. ¡Empate!';
    } else if (player1Lost) {
      this.gameStatusMessage = 'El jugador 2 es el ganador.';
    } else if (player2Lost) {
      this.gameStatusMessage = 'El jugador 1 es el ganador.';
    } else {
      this.gameStatusMessage = 'Ambos jugadores ganaron esta ronda.';
    }

    return this.showModal = true;
  }

  closeModal() {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);
    this.showModal = false;
  }
  cambiarTurno() {
    this.turnoJugador = this.turnoJugador === 1 ? 2 : 1;
    this.bloquearTableros();
    this.iniciarNuevoJuegoPlayer2(this.player2Config);
  }

  bloquearTableros() {
  if (this.turnoJugador === 1) {
    this.tableroPlayerOne.enJuego = true;
    this.tableroPlayerTwo.enJuego = false;
  } else {
    this.tableroPlayerOne.enJuego = false;
    this.tableroPlayerTwo.enJuego = true;
  }
}

}
