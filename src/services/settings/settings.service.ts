import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Difficulty = 'easy' | 'medium' | 'hard' | undefined;

// time in seconds
export const DIFFICULTY_SETTINGS_TIMES = {
  easy: 20,
  medium: 15,
  hard: 10,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private difficultySource = new BehaviorSubject<Difficulty>('easy');
  private listAnimationSource = new BehaviorSubject<boolean>(true);

  difficulty$ = this.difficultySource.asObservable();
  listAnimation$ = this.listAnimationSource.asObservable();

  changeDifficulty = () => {
    const difficulty = this.difficultySource.getValue();

    switch (difficulty) {
      case 'easy':
        this.difficultySource.next('medium');
        break;
      case 'medium':
        this.difficultySource.next('hard');
        break;
      case 'hard':
        this.difficultySource.next('easy');
        break;
    }
  };

  getDifficultyTimeSeconds = () => {
    const difficulty = this.difficultySource.getValue();
    if (difficulty) {
      return DIFFICULTY_SETTINGS_TIMES[difficulty];
    } else {
      return DIFFICULTY_SETTINGS_TIMES.easy;
    }
  };

  toggleListAnimation = () => {
    const temp = this.listAnimationSource.getValue();
    this.listAnimationSource.next(!temp);
  };
}
