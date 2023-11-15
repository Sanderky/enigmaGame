import { Routes } from '@angular/router';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  { path: '', component: WelcomeScreenComponent },
  { path: 'mainMenu', component: MainMenuComponent },
  { path: 'howToPlay', component: HowToPlayComponent },
  { path: 'game', component: GameComponent },
];
