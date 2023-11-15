import { pl, en, LanguageI } from './langs';
import { Injectable } from '@angular/core';

const TRANSLATIONS = {
  pl,
  en,
};

@Injectable({
  providedIn: 'root',
})
export class Translations {
  private currentLanguage;

  constructor() {
    const langFromLocalStorage = localStorage.getItem('lang');

    if (langFromLocalStorage) {
      this.currentLanguage =
        TRANSLATIONS[langFromLocalStorage as keyof typeof TRANSLATIONS] ??
        TRANSLATIONS.pl;
    } else {
      this.currentLanguage = TRANSLATIONS.pl;
    }
  }

  setNextLang = () => {
    const entries = Object.entries(TRANSLATIONS);
    const currIndex = entries.findIndex(
      ([_, val]) => val === this.currentLanguage
    );
    entries.forEach((_, index) => {
      if (index === currIndex) {
        if (index + 1 === entries.length) {
          // no more languages in list so set first
          this.currentLanguage = entries[0][1];
          localStorage.setItem('lang', entries[0][0]);
        } else {
          this.currentLanguage = entries[index + 1][1];
          localStorage.setItem('lang', entries[index + 1][0]);
        }
      }
    });
  };

  getCurrentLang = () => this.currentLanguage.name;

  getTranslate = (key: string) => {
    let result;
    if (key) {
      result = this.currentLanguage[key as keyof LanguageI] ?? key;
    }
    return result;
  };
}
