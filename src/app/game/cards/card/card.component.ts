import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() topPattern: number = 1;
  @Input() bottomPattern: number = 1;
  @Input() selected: boolean = false;
  @Input() label: string = '01';

  getPatternPath = (top: boolean) => {
    if (top) {
      return 'assets/patterns/' + this.topPattern + '.svg';
    } else {
      return 'assets/patterns/' + this.bottomPattern + '.svg';
    }
  };
}
