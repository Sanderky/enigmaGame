import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translations } from '../../services/translations/translations.service';
import {
  Difficulty,
  SettingsService,
} from '../../services/settings/settings.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { exitApplication } from '../app.component';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {
  translate = this.translations.getTranslate;
  getCurrentLanguage = this.translations.getCurrentLang;
  setNextLang = this.translations.setNextLang;
  exitGame = exitApplication;

  difficultySubscription: Subscription;
  listAnimationSubscription: Subscription;

  difficulty: Difficulty;
  listAnimation!: boolean;

  onDifficultyChange = () => {
    this.settingsService.changeDifficulty();
  };

  onListAnimationToggle = () => {
    this.settingsService.toggleListAnimation();
  };

  getDifficulty = () => {
    let result: string | undefined;
    switch (this.difficulty) {
      case 'easy':
        result = this.translate('easy');
        break;
      case 'medium':
        result = this.translate('medium');
        break;
      case 'hard':
        result = this.translate('hard');
        break;
    }
    return result;
  };

  goToHowToPlay = () => {
    this.router.navigate(['/howToPlay']);
  };

  startGame = () => {
    this.router.navigate(['/game']);
  };

  constructor(
    private translations: Translations,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.difficultySubscription = settingsService.difficulty$.subscribe(
      (difficulty) => {
        this.difficulty = difficulty;
      }
    );

    this.listAnimationSubscription = settingsService.listAnimation$.subscribe(
      (listAnim) => {
        this.listAnimation = listAnim;
      }
    );
  }

  ngOnDestroy() {
    this.difficultySubscription.unsubscribe();
    this.listAnimationSubscription.unsubscribe();
  }
}
