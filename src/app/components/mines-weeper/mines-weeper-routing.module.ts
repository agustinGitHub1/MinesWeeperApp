// minesweeper-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MineSweeperComponent } from './mines-weeper.component';
import { BoardComponent } from './board/board.component';
import { GameConfigComponent } from './game-config/game-config.component';
import { PlayersScoreListComponent } from './players-score-list/app-players-score-list.component';
import { MultiplayerModeComponent } from './multiplayer-mode/multiplayer-mode.component';

const routes: Routes = [
  { path: '', component: MineSweeperComponent },
  { path: 'game', component: BoardComponent },
  { path: 'config', component: GameConfigComponent },
  { path: 'scores', component: PlayersScoreListComponent },
  { path: 'multiplayer-mode', component: MultiplayerModeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MineSweeperRoutingModule { }
