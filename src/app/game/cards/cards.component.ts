import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { Card } from '../game.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent {
  @Input() cards: Card[] = [];
  @Input() selectedCard = 0;
}
