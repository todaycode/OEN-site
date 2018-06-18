import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';
import {getMonthSelect, getYearSelect, getNavigationLinks} from '../test/datepicker/common';

import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';

import {NgbDatepickerModule} from './datepicker.module';
import {NgbDate} from './ngb-date';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getDates(element: HTMLElement): HTMLElement[] {
  return <HTMLElement[]>Array.from(element.querySelectorAll('td.day'));
}

function getDay(element: HTMLElement, index: number): HTMLElement {
  return getDates(element)[index].querySelector('div') as HTMLElement;
}

function getDatepicker(element: HTMLElement): HTMLElement {
  return element.querySelector('ngb-datepicker') as HTMLElement;
}

describe('ngb-datepicker', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbDatepickerModule, FormsModule, ReactiveFormsModule]});
  });

  it('should display current month if no date provided', () => {
    const fixture = createTestComponent(`<ngb-datepicker></ngb-datepicker>`);

    const today = new Date();
    expect(getMonthSelect(fixture.nativeElement).value).toBe(`${today.getMonth()}`);
    expect(getYearSelect(fixture.nativeElement).value).toBe(`${today.getFullYear()}`);
  });

  it('should throw if max date is before min date', () => {
    expect(() => {
      createTestComponent('<ngb-datepicker [minDate]="maxDate" [maxDate]="minDate"></ngb-datepicker>');
    }).toThrowError();
  });

  it('should support disabling dates via callback', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [markDisabled]="markDisabled"></ngb-datepicker>`);

    // 22 AUG 2016
    expect(getDay(fixture.nativeElement, 21)).toHaveCssClass('text-muted');
  });

  it('should support disabling dates via min/max dates', () => {
    const fixture = createTestComponent(
        `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate"></ngb-datepicker>`);

    fixture.componentInstance.minDate = {year: 2016, month: 7, day: 20};
    fixture.componentInstance.maxDate = {year: 2016, month: 7, day: 25};
    fixture.detectChanges();

    // 19 AUG 2016
    expect(getDay(fixture.nativeElement, 18)).toHaveCssClass('text-muted');
    // 20 AUG 2016
    expect(getDay(fixture.nativeElement, 19)).not.toHaveCssClass('text-muted');
    // 25 AUG 2016
    expect(getDay(fixture.nativeElement, 24)).not.toHaveCssClass('text-muted');
    // 26 AUG 2016
    expect(getDay(fixture.nativeElement, 25)).toHaveCssClass('text-muted');
  });

  describe('ngModel', () => {

    it('should update model based on calendar clicks', () => {
      const fixture = createTestComponent(
          `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>`);

      const dates = getDates(fixture.nativeElement);
      dates[0].click();  // 1 AUG 2016
      expect(fixture.componentInstance.model).toEqual({year: 2016, month: 7, day: 1});

      dates[1].click();
      expect(fixture.componentInstance.model).toEqual({year: 2016, month: 7, day: 2});
    });

    it('select calendar date based on model updates', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>`);

         fixture.componentInstance.model = {year: 2016, month: 7, day: 1};

         fixture.detectChanges();
         fixture.whenStable()
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDay(fixture.nativeElement, 0)).toHaveCssClass('bg-primary');

               fixture.componentInstance.model = {year: 2016, month: 7, day: 2};
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDay(fixture.nativeElement, 0)).not.toHaveCssClass('bg-primary');
               expect(getDay(fixture.nativeElement, 1)).toHaveCssClass('bg-primary');
             });
       }));

    it('should switch month when clicked on the date outside of current month', async(() => {
         const fixture = createTestComponent(
             `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>`);
         fixture.detectChanges();
         fixture.whenStable().then(() => {

           let dates = getDates(fixture.nativeElement);

           dates[31].click();  // 1 SEP 2016
           expect(fixture.componentInstance.model).toEqual({year: 2016, month: 8, day: 1});

           // month changes to SEP
           fixture.detectChanges();
           expect(getDay(fixture.nativeElement, 0).innerText).toBe('29');          // 29 AUG 2016
           expect(getDay(fixture.nativeElement, 3)).toHaveCssClass('bg-primary');  // 1 SEP still selected
         });
       }));

    it('should switch month on prev/next navigation click', () => {
      const fixture = createTestComponent(
          `<ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>`);

      let dates = getDates(fixture.nativeElement);
      const navigation = getNavigationLinks(fixture.nativeElement);

      dates[0].click();  // 1 AUG 2016
      expect(fixture.componentInstance.model).toEqual({year: 2016, month: 7, day: 1});

      // PREV
      navigation[0].click();
      fixture.detectChanges();
      dates = getDates(fixture.nativeElement);
      dates[4].click();  // 1 JUL 2016
      expect(fixture.componentInstance.model).toEqual({year: 2016, month: 6, day: 1});

      // NEXT
      navigation[1].click();
      fixture.detectChanges();
      dates = getDates(fixture.nativeElement);
      dates[0].click();  // 1 AUG 2016
      expect(fixture.componentInstance.model).toEqual({year: 2016, month: 7, day: 1});
    });

    it('should switch month using navigateTo({date})', () => {
      const fixture = createTestComponent(
          `<ngb-datepicker #dp [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ngb-datepicker>
       <button id="btn"(click)="dp.navigateTo({year: 2015, month: 5})"></button>`);

      const button = fixture.nativeElement.querySelector('button#btn');
      button.click();

      fixture.detectChanges();
      expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
      expect(getYearSelect(fixture.nativeElement).value).toBe('2015');

      const dates = getDates(fixture.nativeElement);
      dates[0].click();  // 1 JUN 2015
      expect(fixture.componentInstance.model).toEqual({year: 2015, month: 5, day: 1});
    });

    it('should switch to current month using navigateTo() without arguments', () => {
      const fixture = createTestComponent(
          `<ngb-datepicker #dp [startDate]="date" [minDate]="minDate" [maxDate]="maxDate"></ngb-datepicker>
       <button id="btn"(click)="dp.navigateTo()"></button>`);

      const button = fixture.nativeElement.querySelector('button#btn');
      button.click();

      fixture.detectChanges();
      const today = new Date();
      expect(getMonthSelect(fixture.nativeElement).value).toBe(`${today.getMonth()}`);
      expect(getYearSelect(fixture.nativeElement).value).toBe(`${today.getFullYear()}`);
    });
  });

  describe('forms', () => {

    it('should work with template-driven form validation', async(() => {
         const fixture = createTestComponent(`
        <form>
          <ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model" name="date" required>            
          </ngb-datepicker>
        </form>
      `);

         const compiled = fixture.nativeElement;
         fixture.detectChanges();
         fixture.whenStable()
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDatepicker(compiled)).toHaveCssClass('ng-invalid');
               expect(getDatepicker(compiled)).not.toHaveCssClass('ng-valid');

               fixture.componentInstance.model = {year: 2016, month: 7, day: 1};
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDatepicker(compiled)).toHaveCssClass('ng-valid');
               expect(getDatepicker(compiled)).not.toHaveCssClass('ng-invalid');
             });
       }));

    it('should work with model-driven form validation', async(() => {
         const html = `
          <form [formGroup]="form">
            <ngb-datepicker [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" formControlName="control" required></ngb-datepicker>
          </form>`;

         const fixture = createTestComponent(html);
         const compiled = fixture.nativeElement;
         fixture.detectChanges();
         fixture.whenStable()
             .then(() => {
               const dates = getDates(fixture.nativeElement);

               expect(getDatepicker(compiled)).toHaveCssClass('ng-invalid');
               expect(getDatepicker(compiled)).not.toHaveCssClass('ng-valid');

               dates[0].click();
               fixture.detectChanges();
               return fixture.whenStable();
             })
             .then(() => {
               expect(getDatepicker(compiled)).toHaveCssClass('ng-valid');
               expect(getDatepicker(compiled)).not.toHaveCssClass('ng-invalid');
             });
       }));
  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  date = {year: 2016, month: 7};
  minDate = {year: 2010, month: 0, day: 1};
  maxDate = {year: 2020, month: 11, day: 31};
  form = new FormGroup({control: new FormControl('', Validators.required)});
  model;
  markDisabled = (date: {year: number, month: number, day: number}) => {
    return NgbDate.from(date).equals(new NgbDate(2016, 7, 22));
  };
}
