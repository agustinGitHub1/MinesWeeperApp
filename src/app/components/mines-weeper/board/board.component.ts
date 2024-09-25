import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ASSET_CONSTANTS } from '../../../constants/asset.constants';
import { MinesWeeperGameService } from '../../../services/mines-weeper-game.service';

interface Cell {
  valor: number;
  estado?: 'descubierto' | 'marcado' | 'perdido' | 'bomba' | 'bomba-marcada' | 'victoria' | 'bomba-victoria' | 'descubierto-victoria';
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() filas2!: number;
  @Input() columnas2!: number;
  @Input() minas2!: number;
  @Output() minesLeft = new EventEmitter<number>();
  @Output() gameStatus = new EventEmitter<'playing' | 'lost' | 'won'>();
  filas = 10;
  columnas = 10;
  minas = 5;
  marcas = 0;
  enJuego = true;
  juegoIniciado = false;
  tablero: any[] = [];

  constructor(private gameService: MinesWeeperGameService) {
    const config = this.gameService.returnCurrentGameConfig();
    this.filas = config.filas;
    this.columnas = config.columnas;
    this.minas = config.minas;
  }

  ngOnInit() {
    this.gameService.newGame$.subscribe(({ isNewGame }) => {
      this.gameService.stopTimer();
      this.gameService.startTimer();

      if (!isNewGame) {
            if (this.gameService.tablero && this.gameService.tablero.length > 0) {
                this.tablero = this.gameService.tablero;
            }
        }
    });
  }

  nuevoJuego(config?: any) {
    if (config) {
      this.gameStatus.emit('playing');
      this.filas2 = config.filas;
      this.columnas2 = config.columnas;
      this.minas2 = config.minas;
    }

    this.gameService.stopTimer();
    this.gameService.playSound(ASSET_CONSTANTS.NEW_GAME_SOUND);
    this.gameService.startTimer();
    this.reiniciarVariables();
    this.gameService.updateMinesLeft(this.minas2);
    this.generarTableroJuego();
    this.refrescarTablero();

    const table = document.querySelector('table');
    if (table) {
      table.classList.remove('perdido');
    }
  }

  reiniciarVariables() {
    this.marcas = 0;
    this.enJuego = true;
    this.juegoIniciado = false;
  }

  generarTableroJuego() {
    if (this.columnas2 > 25) this.columnas2 = 25;
    if (this.filas2 > 25) this.filas2 = 25;
    const nuevoTablero = Array.from({ length: this.columnas2 }, () => Array(this.filas2).fill(null));
    this.ponerMinas(nuevoTablero);
    this.contadoresMinas(nuevoTablero);
    this.tablero = nuevoTablero;
  }

  ponerMinas(tablero: Cell[][]) {
      for (let i = 0; i < this.minas2; i++) {
      let c: number;
      let f: number;
      do {
        c = Math.floor(Math.random() * this.columnas2);
        f = Math.floor(Math.random() * this.filas2);
      } while (tablero[c][f]);

      tablero[c][f] = { valor: -1 };
    }
  }

  contadoresMinas(tablero: Cell[][]) {
    for (let f = 0; f < this.filas2; f++) {
      for (let c = 0; c < this.columnas2; c++) {
        if (!tablero[c][f]) {
          let contador = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              if (tablero[c + i]?.[f + j]?.valor === -1) {
                contador++;
              }
            }
          }
          tablero[c][f] = { valor: contador };
        }
      }
    }
  }

  refrescarTablero() {
    this.verificarGanador();
    this.verificarPerdedor();
  }

  verificarGanador() {
    for (let f = 0; f < this.filas2; f++) {
      for (let c = 0; c < this.columnas2; c++) {
        if (this.tablero[c][f]?.estado !== 'descubierto' && this.tablero[c][f]?.valor !== -1) {
          return;
        }
      }
    }

    // Cambiar todas las celdas a estado de victoria
    for (let f = 0; f < this.filas2; f++) {
      for (let c = 0; c < this.columnas2; c++) {
        const cell = this.tablero[c][f];

        if (cell?.valor === -1) {
          if (cell.estado === 'marcado') {
            cell.estado = 'bomba-marcada';
          } else {
            cell.estado = 'bomba-victoria';
          }
        } else if (cell?.estado === 'marcado') {
          cell.estado = 'marcado';
        } else if (cell?.estado === 'descubierto') {
          cell.estado = 'descubierto-victoria';
        } else {
          if (cell.estado = 'bomba-victoria') return;
          cell.estado = 'victoria';
        }
      }
    }

    this.enJuego = false;

    this.gameStatus.emit('won');
    this.gameService.playSound(ASSET_CONSTANTS.WIN_SOUND);
  }



  verificarPerdedor() {
    for (let f = 0; f < this.filas2; f++) {
      for (let c = 0; c < this.columnas2; c++) {
        if (this.tablero[c][f]?.valor === -1 && this.tablero[c][f]?.estado === 'descubierto') {
          this.gameService.playSound(ASSET_CONSTANTS.BOMB_SELECTED_SOUND);
          this.mostrarMinas();

          this.enJuego = false;
          this.gameStatus.emit('lost');

          this.gameService.playSound(ASSET_CONSTANTS.GAME_OVER_SOUND);
        }
      }
    }
  }

  mostrarMinas() {
    for (let f = 0; f < this.filas2; f++) {
      for (let c = 0; c < this.columnas2; c++) {
        const cell = this.tablero[c][f];

        if (cell?.valor === -1) {
          if (cell.estado === 'marcado') {
            cell.estado = 'bomba-marcada';
          } else {
            cell.estado = 'bomba';
          }
        }
        else if (cell?.estado === 'marcado') {
          cell.estado = 'marcado';
        }
        else if (cell?.estado === 'descubierto') {
          cell.estado = 'descubierto';
        }
        else {
          cell.estado = 'perdido';
        }
      }
    }

    const table = document.querySelectorAll('td.descubierto');
    table.forEach((td) => {
      td.classList.add('perdido');
    });
  }


  handleCellClick(event: MouseEvent, c: number, f: number) {
    if (!this.enJuego) return;
    // Clic izquierdo
    if (event.button === 0) {
      if (this.tablero[c][f]?.estado === 'marcado' || this.tablero[c][f]?.estado === 'descubierto') return;

      if (!this.juegoIniciado) {
        while (!this.juegoIniciado && this.tablero[c][f].valor === -1) {
          this.generarTableroJuego();
        }
        this.juegoIniciado = true;
      }

      if (this.tablero[c][f].valor != -1) this.gameService.playSound(ASSET_CONSTANTS.CELL_SELECTED_SOUND);

      this.tablero[c][f].estado = 'descubierto';

      if (this.tablero[c][f].valor === 0) {
        this.gameService.playSound(ASSET_CONSTANTS.UNLOCK_CELLS_SOUND);
        this.abrirArea(c, f);
      }

      this.verificarPerdedor();

    } else if (event.button === 2) { // Clic derecho
      if (this.tablero[c][f]?.estado === 'descubierto') return;
      this.toggleMarkCell(c, f);
    }

    this.refrescarTablero();
    this.gameService.setTablero(this.tablero);
  }

  toggleMarkCell(c: number, f: number) {
    if (this.tablero[c][f]?.estado === 'marcado') {
      this.tablero[c][f].estado = undefined;
      this.marcas--;
    } else {
      this.tablero[c][f].estado = 'marcado';
      this.marcas++;
    }

    let minasRestantes = this.minas2 - this.marcas;
    this.gameService.setTablero(this.tablero);
    this.minesLeft.emit(minasRestantes);
  }

  abrirArea(c: number, f: number) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newC = c + i;
        const newF = f + j;

        if (newC >= 0 && newC < this.columnas2 && newF >= 0 && newF < this.filas2) {
          if (this.tablero[newC][newF]?.estado !== 'descubierto' && this.tablero[newC][newF]?.estado !== 'marcado') {
            this.tablero[newC][newF].estado = 'descubierto';
            if (this.tablero[newC][newF].valor === 0) {
              this.abrirArea(newC, newF);
            }
          }
        }
      }
    }
  }
}
