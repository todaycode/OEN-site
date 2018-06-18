import {
  Component,
  Directive,
  TemplateRef,
  ContentChildren,
  QueryList,
  Input,
  OnDestroy,
  AfterContentChecked,
  OnInit
} from '@angular/core';

let nextId = 0;

/**
 * Represents an individual slide to be used within a carousel.
 */
@Directive({selector: 'template[ngbSlide]'})
export class NgbSlide {
  /**
   * Unique slide identifier. Must be unique for the entire document for proper accessibility support.
   * Will be auto-generated if not provided.
   */
  @Input() id = `ngb-slide-${nextId++}`;
  constructor(public tplRef: TemplateRef<any>) {}
}

/**
 * Directive to easily create carousels based on Bootstrap's markup.
 */
@Component({
  selector: 'ngb-carousel',
  exportAs: 'ngbCarousel',
  host: {
    'class': 'carousel slide',
    '[style.display]': '"block"',
    'tabIndex': '0',
    '(mouseenter)': 'pause()',
    '(mouseleave)': 'cycle()',
    '(keyup.arrowLeft)': '_keyPrev()',
    '(keyup.arrowRight)': '_keyNext()'
  },
  template: `
    <ol class="carousel-indicators">
      <li *ngFor="let slide of _slides" [id]="slide.id" [class.active]="slide.id === activeId" (click)="_cycleToSelected(slide.id)"></li>
    </ol>
    <div class="carousel-inner" role="listbox">
      <div *ngFor="let slide of _slides" class="carousel-item" [class.active]="slide.id === activeId">
        <template [ngTemplateOutlet]="slide.tplRef"></template>
      </div>
    </div>
    <a class="left carousel-control" role="button" (click)="_cycleToPrev()">
      <span class="icon-prev" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" role="button" (click)="_cycleToNext()">
      <span class="icon-next" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
    `
})
export class NgbCarousel implements AfterContentChecked,
    OnDestroy, OnInit {
  @ContentChildren(NgbSlide) private _slides: QueryList<NgbSlide>;
  private _slideChangeInterval;

  /**
   *  Amount of time in milliseconds before next slide is shown.
   */
  @Input() interval = 5000;

  /**
   *  Whether can wrap from the last to the first slide.
   */
  @Input() wrap = true;

  /**
   *  A flag for allowing navigation via keyboard
   */
  @Input() keyboard = true;

  /**
   *  The active slide id.
   */
  @Input() activeId: string;

  ngAfterContentChecked() {
    let activeSlide = this._getSlideById(this.activeId);
    this.activeId = activeSlide ? activeSlide.id : (this._slides.length ? this._slides.first.id : null);
  }

  ngOnInit() { this._startTimer(); }

  ngOnDestroy() { clearInterval(this._slideChangeInterval); }

  /**
   * Navigate to a slide with a specified identifier.
   */
  select(slideIdx: string) {
    this._cycleToSelected(slideIdx);
    this._restartTimer();
  }

  /**
   * Navigate to the next slide.
   */
  prev() {
    this._cycleToPrev();
    this._restartTimer();
  }

  /**
   * Navigate to the next slide.
   */
  next() {
    this._cycleToNext();
    this._restartTimer();
  }

  /**
   * Stops the carousel from cycling through items.
   */
  pause() { this._stopTimer(); }

  /**
   * Restarts cycling through the carousel slides from left to right.
   */
  cycle() { this._startTimer(); }

  private _keyPrev() {
    if (this.keyboard) {
      this.prev();
    }
  }

  private _keyNext() {
    if (this.keyboard) {
      this.next();
    }
  }

  private _cycleToNext() {
    let selectedId: string = this._getNextSlide(this.activeId);
    this._cycleToSelected(selectedId);
  }

  private _cycleToPrev() {
    let selectedId: string = this._getPrevSlide(this.activeId);
    this._cycleToSelected(selectedId);
  }

  private _cycleToSelected(slideIdx: string) {
    let selectedSlide = this._getSlideById(slideIdx);
    if (selectedSlide) {
      this.activeId = selectedSlide.id;
    }
  }

  private _restartTimer() {
    this._stopTimer();
    this._startTimer();
  }

  private _startTimer() {
    this._slideChangeInterval = setInterval(() => { this._cycleToNext(); }, this.interval);
  }

  private _stopTimer() { clearInterval(this._slideChangeInterval); }

  private _getSlideById(slideIdx: string): NgbSlide {
    let slideWithId: NgbSlide[] = this._slides.filter(slide => slide.id === slideIdx);
    return slideWithId.length ? slideWithId[0] : null;
  }

  private _getNextSlide(id: string): string {
    let nextSlideId = id;
    let slideArr = this._slides.toArray();

    slideArr.forEach((slide, idx) => {
      if (slide.id === id) {
        let lastSlide: boolean = (idx === (slideArr.length - 1));
        nextSlideId =
            lastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) : slideArr[idx + 1].id;
      }
    });
    return nextSlideId;
  }

  private _getPrevSlide(id: string): string {
    let prevSlideId = id;
    let slideArr = this._slides.toArray();

    slideArr.forEach((slide, idx) => {
      if (slide.id === id) {
        prevSlideId =
            idx === 0 ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) : slideArr[idx - 1].id;
      }
    });
    return prevSlideId;
  }
}

export const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];
