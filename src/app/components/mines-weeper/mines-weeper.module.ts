import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MineSweeperComponent } from './mines-weeper.component';
import { BoardComponent } from './board/board.component';
import { GameConfigComponent } from './game-config/game-config.component';
import { FormsModule } from '@angular/forms';
import { PlayersScoreListComponent } from './players-score-list/app-players-score-list.component';
import { MineSweeperRoutingModule } from './mines-weeper-routing.module';
import { MultiplayerModeComponent } from './multiplayer-mode/multiplayer-mode.component';

@NgModule({
  declarations: [
    MineSweeperComponent,
    BoardComponent,
    GameConfigComponent,
    PlayersScoreListComponent,
    MultiplayerModeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MineSweeperRoutingModule
  ],
  exports: [
    MineSweeperComponent
  ]
})
export class MineSweeperModule { }
