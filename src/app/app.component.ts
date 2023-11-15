import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { Translations } from '../services/translations/translations.service';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { GameComponent } from './game/game.component';

declare var electron: any;

export const exitApplication = () => {
  if (electron) {
    electron.ipcRenderer.send('app:exit');
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MainMenuComponent,
    WelcomeScreenComponent,
    HowToPlayComponent,
    GameComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Translations],
})
export class AppComponent {}
