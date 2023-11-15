import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translations } from '../../../services/translations/translations.service';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
  translate = this.translations.getTranslate
  @Input() difficultyTimeSeconds = 0
  @Output() timeLeftEvent = new EventEmitter();
  @ViewChild('bar') bar!: ElementRef<HTMLDivElement>;
  totalTime = 0


  onTimeLeft = () => {
    this.timeLeftEvent.emit()
  }

  resetTimer = () => {
    this.difficultyTimeSeconds = this.totalTime
    this.bar.nativeElement.style.animation = 'none' // reset bar animation
    this.bar.nativeElement.offsetWidth // reflow
    this.bar.nativeElement.style.animation = 'barAnimation ' + this.totalTime + 's linear' // add animation again
  }

  private resetTimerEventSubsription!: Subscription;

@Input() resetTimerEvent!: Observable<void>;
timerSubscription!: Subscription;





  constructor(private translations: Translations) { }

  ngAfterViewInit() {
    // ElementRef { nativeElement: <input> }
    // console.log(this.bar);
    // this.bar.nativeElement.classList.add(':host .dupa')
    // this.bar.nativeElement.classList.add('barAnimation')

    this.bar.nativeElement.style.animationDuration = this.totalTime + 's' // start bar animation
  }
  ngOnInit(): void {
    // console.log(this.bar)
    this.resetTimerEventSubsription = this.resetTimerEvent.subscribe(() => this.resetTimer());

    // console.log('time', this.difficultyTimeMs)
    this.totalTime = this.difficultyTimeSeconds
    // Utwórz obserwable, który emituje wartość co sekundę
    const source = interval(1000);

    // Subskrybuj obserwable i zaktualizuj czas pozostały
    this.timerSubscription = source.subscribe(val => {
      this.difficultyTimeSeconds--;
      // this.difficultyTimeMs -= 1;

      if (this.difficultyTimeSeconds == 0) {
        this.timerSubscription.unsubscribe();
        this.onTimeLeft()
      }
    });
  }

  ngOnDestroy() {
    this.resetTimerEventSubsription.unsubscribe();
  }
  


}
