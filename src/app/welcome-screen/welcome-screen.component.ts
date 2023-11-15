import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translations } from '../../services/translations/translations.service';
import { Router } from '@angular/router';
import { exitApplication } from '../app.component';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss',
})
export class WelcomeScreenComponent {
  translate = this.translations.getTranslate;
  isLoading = false;
  exitGame = exitApplication;

  onStart = () => {
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigate(['/mainMenu']);
    }, 2000);
  };

  constructor(private translations: Translations, private router: Router) {}
}
