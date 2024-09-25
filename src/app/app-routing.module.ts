import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'minesweeper', loadChildren: () => import('./components/mines-weeper/mines-weeper.module').then(m => m.MineSweeperModule) },
  { path: '', redirectTo: '/minesweeper', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
