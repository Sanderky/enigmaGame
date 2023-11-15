import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translations } from '../../services/translations/translations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-how-to-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-to-play.component.html',
  styleUrl: './how-to-play.component.scss',
})
export class HowToPlayComponent {
  translate = this.translations.getTranslate;

  goToMainMenu = () => {
    this.router.navigate(['/mainMenu']);
  };

  constructor(private translations: Translations, private router: Router) {}
}
