import {
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { Selector } from '../game.component';
import { SettingsService } from '../../../services/settings/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-selector.component.html',
  styleUrl: './card-selector.component.scss',
  animations: [
    trigger('arrowLeft', [
      transition('closed <=> open', [
        animate(
          '200ms',
          keyframes([
            style({ marginRight: '0px' }),
            style({ marginRight: '10px' }),
            style({ marginRight: '0px' }),
          ])
        ),
      ]),
    ]),
    trigger('arrowRight', [
      transition('closed <=> open', [
        animate(
          '200ms',
          keyframes([
            style({ marginLeft: '0px' }),
            style({ marginLeft: '10px' }),
            style({ marginLeft: '0px' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class CardSelectorComponent {
  @Input() topRow: number[] = [];
  @Input() bottomRow: number[] = [];
  @Output() selectPatternsEvent = new EventEmitter<Selector>();
  @ViewChild('topList') topListElement!: ElementRef<HTMLDivElement>;
  @ViewChild('bottomList') bottomListElement!: ElementRef<HTMLDivElement>;

  patternsTopRow: number[] = [];
  patternsBottomRow: number[] = [];

  listAnimationSubscription: Subscription;
  arrowLeftAnimationState = false;
  arrowRightAnimationState = false;
  selectorPosition: boolean = true; // true = up, false = down

  ngOnInit() {
    this.patternsTopRow = [...this.topRow];
    this.patternsBottomRow = [...this.bottomRow];
  }

  selectNextPattern = () => {
    const list = this.selectorPosition
      ? this.patternsTopRow
      : this.patternsBottomRow;
    const tempFirst = list[0];
    list.push(tempFirst);
    list.shift();
  };

  selectPrevPattern = () => {
    const list = this.selectorPosition
      ? this.patternsTopRow
      : this.patternsBottomRow;
    const tempLast = list[list.length - 1];
    list.unshift(tempLast);
    list.pop();
  };

  onSelectorAccept = () => {
    const midIndex = Math.floor(this.topRow.length / 2);
    const top = this.patternsTopRow[midIndex];
    const bottom = this.patternsBottomRow[midIndex];

    const selector: Selector = { topPattern: top, bottomPattern: bottom };
    this.selectPatternsEvent.emit(selector);
  };

  getPath = (patternNumber: number) => {
    return 'assets/patterns/' + patternNumber + '.svg';
  };

  moveListRight: () => void = () => {};
  moveListLeft: () => void = () => {};

  positionX = 0;
  keystrokeCounter = 0;
  isMovingRight = false;
  isMovingLeft = false;
  holdListMovingTimer: ReturnType<typeof setTimeout> = setTimeout(() => {});

  constructor(private settingsService: SettingsService) {
    this.listAnimationSubscription =
      this.settingsService.listAnimation$.subscribe((listAnim) => {
        if (listAnim) {
          this.moveListLeft = () => {
            if (!this.isMovingRight) {
              const row = this.selectorPosition ? this.topRow : this.bottomRow;
              const rowElement = this.selectorPosition
                ? this.topListElement
                : this.bottomListElement;

              this.isMovingLeft = true;
              rowElement.nativeElement.style.transition = `left 300ms`;
              clearTimeout(this.holdListMovingTimer);
              const tempLast = row[row.length - 1 - this.keystrokeCounter];
              this.keystrokeCounter++;
              row.unshift(tempLast);
              this.positionX += 102;
              rowElement.nativeElement.style.transform = `translateX(-${this.positionX}px)`;
              rowElement.nativeElement.style.left = `${this.positionX}px`;

              this.holdListMovingTimer = setTimeout(() => {
                resetListPositionAndSelectPattern();
              }, 300);

              let resetListPositionAndSelectPattern = () => {
                for (var i = 0; i < this.keystrokeCounter; i++) {
                  row.pop();
                }
                this.keystrokeCounter = 0;
                this.positionX = 0;
                rowElement.nativeElement.style.transition = `none`;
                rowElement.nativeElement.style.left = ``;
                rowElement.nativeElement.style.transform = ``;
                this.isMovingLeft = false;
              };
            }
          };

          this.moveListRight = () => {
            if (!this.isMovingLeft) {
              const row = this.selectorPosition ? this.topRow : this.bottomRow;
              const rowElement = this.selectorPosition
                ? this.topListElement
                : this.bottomListElement;

              rowElement.nativeElement.style.transition = `left 300ms`;
              this.isMovingRight = true;
              clearTimeout(this.holdListMovingTimer);
              const tempLast = row[this.keystrokeCounter];
              this.keystrokeCounter++;
              row.push(tempLast);
              this.positionX -= 102;
              rowElement.nativeElement.style.left = `${this.positionX}px`;

              this.holdListMovingTimer = setTimeout(() => {
                resetListPositionAndSelectPattern();
              }, 300);

              let resetListPositionAndSelectPattern = () => {
                for (var i = 0; i < this.keystrokeCounter; i++) {
                  row.shift();
                }
                this.keystrokeCounter = 0;
                this.positionX = 0;
                rowElement.nativeElement.style.transition = `none`;
                rowElement.nativeElement.style.left = ``;
                this.isMovingRight = false;
              };
            }
          };
        } else {
          this.moveListRight = () => {
            let tempFirst;
            if (this.selectorPosition) {
              // move top list
              tempFirst = this.topRow.shift();
              if (tempFirst) {
                this.topRow.push(tempFirst);
              }
            } else {
              // move bottom list
              tempFirst = this.bottomRow.shift();
              if (tempFirst) {
                this.bottomRow.push(tempFirst);
              }
            }
          };

          this.moveListLeft = () => {
            let tempLast;
            if (this.selectorPosition) {
              // move top list
              tempLast = this.topRow.pop();
              if (tempLast) {
                this.topRow.unshift(tempLast);
              }
            } else {
              // move bottom list
              tempLast = this.bottomRow.pop();
              if (tempLast) {
                this.bottomRow.unshift(tempLast);
              }
            }
          };
        }
      });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();

    if (event.key === 'ArrowUp') {
      this.selectorPosition = true;
    }
    if (event.key === 'ArrowDown') {
      this.selectorPosition = false;
    }

    if (event.key === 'ArrowLeft') {
      this.selectPrevPattern();
      this.moveListLeft();
      this.arrowLeftAnimationState = !this.arrowLeftAnimationState;
    }
    if (event.key === 'ArrowRight') {
      this.selectNextPattern();
      this.moveListRight();
      this.arrowRightAnimationState = !this.arrowRightAnimationState;
    }
    if (event.key === 'Enter') {
      this.onSelectorAccept();
    }
  }
}
