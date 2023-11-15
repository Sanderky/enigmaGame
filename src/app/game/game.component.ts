import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translations } from '../../services/translations/translations.service';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CardsComponent } from './cards/cards.component';
import { CardSelectorComponent } from './card-selector/card-selector.component';
import { shuffle } from 'lodash';
import { Subject } from 'rxjs';
import { SettingsService } from '../../services/settings/settings.service';
import { Router } from '@angular/router';

const CODE_CARDS_COUNT = 7;
export const SELECTOR_CARDS_COUNT = 9; // must be odd number

const getRandomPattern = () => Math.floor(Math.random() * 23 + 1); //random number from 1 to 23

const getCodeCards = () => {
  const cards: Card[] = [];
  for (let i = 0; i < CODE_CARDS_COUNT; i++) {
    cards[i] = {
      topPattern: getRandomPattern(),
      bottomPattern: getRandomPattern(),
    };
  }
  return cards;
};

const getSelectorRows = (cards: Card[]) => {
  const topRow: number[] = [];
  const bottomRow: number[] = [];
  const randomPatternsToAdd = SELECTOR_CARDS_COUNT - CODE_CARDS_COUNT;

  cards.forEach((card) => {
    topRow.push(card.topPattern);
    bottomRow.push(card.bottomPattern);
  });
  for (let i = 0; i < randomPatternsToAdd; i++) {
    topRow.push(getRandomPattern());
    bottomRow.push(getRandomPattern());
  }

  return {
    topRow: shuffle(topRow),
    bottomRow: shuffle(bottomRow),
  } as SelectorRows;
};

const checkCardWithSelector = (card: Card, selector: Selector) => {
  if (
    card.topPattern === selector.topPattern &&
    card.bottomPattern === selector.bottomPattern
  ) {
    return true;
  } else {
    return false;
  }
};

type GameStatus = 'gameOver' | 'inGame' | 'gameWin';

export interface Card {
  topPattern: number;
  bottomPattern: number;
}

export interface Selector {
  topPattern: number;
  bottomPattern: number;
}

interface SelectorRows {
  topRow: number[];
  bottomRow: number[];
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    ProgressBarComponent,
    CardsComponent,
    CardSelectorComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  translate = this.translations.getTranslate;
  difficultyTimeSeconds: number;

  gameStatus: GameStatus = 'inGame';
  cards: Card[];
  selectorRows: SelectorRows;
  selectedCodeCardIndex = 0;

  isInGame = () => this.gameStatus === 'inGame';

  isGameWin = () => this.gameStatus === 'gameWin';

  isGameOver = () => this.gameStatus === 'gameOver';

  onTimeLeft = () => this.gameOver();

  checkUserSelection = (selector: Selector) => {
    if (
      checkCardWithSelector(this.cards[this.selectedCodeCardIndex], selector)
    ) {
      this.selectNextCard();
    } else {
      this.gameOver();
    }
  };

  gameWin = () => {
    this.gameStatus = 'gameWin';
  };

  gameOver = () => {
    this.gameStatus = 'gameOver';
  };

  restartGame = () => {
    this.gameStatus = 'inGame';
    this.selectedCodeCardIndex = 0;
    this.cards = getCodeCards();
    this.selectorRows = getSelectorRows(this.cards);
    this.restartTimer();
  };

  goToMainMenu = () => {
    this.router.navigate(['/mainMenu']);
  };

  selectNextCard = () => {
    if (this.selectedCodeCardIndex < CODE_CARDS_COUNT - 1) {
      this.selectedCodeCardIndex += 1;
      this.restartTimer();
    } else {
      this.gameWin();
    }
  };

  restartTimerEvent: Subject<void> = new Subject<void>();

  restartTimer() {
    this.restartTimerEvent.next();
  }

  constructor(
    private translations: Translations,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.cards = getCodeCards();
    this.selectorRows = getSelectorRows(this.cards);
    this.difficultyTimeSeconds =
      this.settingsService.getDifficultyTimeSeconds();
  }
}
