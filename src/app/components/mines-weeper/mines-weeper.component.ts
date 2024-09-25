import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component'; // Asegúrate de que la ruta sea correcta
import { MinesWeeperGameService } from '../../services/mines-weeper-game.service';

@Component({
  selector: 'app-mines-weeper',
  templateUrl: './mines-weeper.component.html',
  styleUrls: ['./mines-weeper.component.scss']
})
export class MineSweeperComponent {
  filas: number = 10;
  columnas: number = 10;
  minas: number = 5;
  minasRestantesNumber: number = this.minas;

  player1Config = { filas: 10, columnas: 10, minas: 5 };

  @ViewChild('tablero') tablero!: BoardComponent;
  gameStatus: string = 'playing';

  constructor(private gameService: MinesWeeperGameService) { }

  iniciarNuevoJuegoPlayer1(config: { filas: number, columnas: number, minas: number }) {
    this.player1Config = config;

    if (this.tablero) {
      this.tablero.nuevoJuego(this.player1Config);
    }
  }

  minasRestantes(event: number) {
    this.minasRestantesNumber = event;
  }

  gameStatusEventReceiver(event: string ) {
    this.gameStatus = event;
  }

}
