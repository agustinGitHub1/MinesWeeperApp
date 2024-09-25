import { Component } from '@angular/core';
import { ASSET_CONSTANTS } from '../../../constants/asset.constants';
import { Router } from '@angular/router';
import { MinesWeeperGameService } from '../../../services/mines-weeper-game.service';

@Component({
  selector: 'app-players-score-list',
  templateUrl: './app-players-score-list.component.html',
  styleUrls: ['./app-players-score-list.component.scss']
})
export class PlayersScoreListComponent {
  games: any[] = [];

  // Juegos por defecto
  defaultGames = [
    {
      startTime: new Date('2024-09-15T10:00:00'),
      endTime: new Date('2024-09-15T10:20:00'),
      difficulty: 'Easy',
      totalTimeSpent: 1200, // en segundos
      status: 'Won',
    },
    {
      startTime: new Date('2024-09-16T12:00:00'),
      endTime: new Date('2024-09-16T12:40:00'),
      difficulty: 'Medium',
      totalTimeSpent: 2400,
      status: 'Won',
    },
    {
      startTime: new Date('2024-09-17T14:00:00'),
      endTime: new Date('2024-09-17T14:50:00'),
      difficulty: 'Hard',
      totalTimeSpent: 3000,
      status: 'Lost',
    }
  ];

  constructor(private gameService: MinesWeeperGameService, private router: Router) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    const storedGames = localStorage.getItem('playerGames');
    const realGames = storedGames ? JSON.parse(storedGames) : [];

    this.games = [...realGames, ...this.defaultGames];

    this.games.sort((a, b) => {
      const difficultyOrder = ['hard', 'medium', 'easy'];
      const difficultyComparison = difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);

      if (difficultyComparison === 0) {
        return a.totalTimeSpent - b.totalTimeSpent;
      }
      return difficultyComparison;
    });

    this.games = this.games.slice(0, 10);
  }

  formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { hour12: true, month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleString('en-US', options);
  }

  goToMultiplayerMode() {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);
    this.router.navigate(['/multiplayer-mode']);
  }

  goToOneplayerMode() {
    this.gameService.playSound(ASSET_CONSTANTS.MENU_BUTTON_SOUND);
    this.router.navigate(['/minesweeper']);
  }
}
