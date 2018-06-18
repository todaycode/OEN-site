import {Component, Directive, forwardRef, Inject, Input, Query, QueryList} from 'angular2/angular2';

@Component({
  selector: 'ngb-accordion-group, [ngb-accordion-group]',
  template: `
    <div class="panel panel-default" [class.panel-open]="isOpen">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a href tabindex="0"><span [class.text-muted]="isDisabled" (click)="toggleOpen($event)">{{title}}</span></a>
        </h4>
      </div>
      <div class="panel-collapse" [hidden]="!isOpen">
        <div class="panel-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class NgbAccordionGroup {
  private _isOpen = false;
  @Input() isDisabled: boolean;
  @Input() title: string;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.accordion.closeOthers(this);
    }
  }

  get isOpen(): boolean { return this._isOpen; }

  constructor(@Inject(forwardRef(() => NgbAccordion)) private accordion: NgbAccordion) {}

  toggleOpen(event): void {
    event.preventDefault();
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
    }
  }
}

@Directive({selector: 'ngb-accordion, [ngb-accordion]'})
export class NgbAccordion {
  @Input('closeOthers') onlyOneOpen: boolean;

  constructor(@Query(NgbAccordionGroup) public groups: QueryList<NgbAccordionGroup>) {}

  closeOthers(openGroup: NgbAccordionGroup): void {
    if (!this.onlyOneOpen) {
      return;
    }

    this.groups.toArray().forEach((group: NgbAccordionGroup) => {
      if (group !== openGroup) {
        group.isOpen = false;
      }
    });
  }
}
