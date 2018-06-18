import {async, TestBed, ComponentFixture} from '@angular/core/testing';

import {Component} from '@angular/core';

import {NgbTypeaheadWindow} from './typeahead-window';
import {expectResults, getWindowLinks} from './test-common';
import {NgbTypeaheadModule} from './index';

function createTestComponentFixture(html: string): ComponentFixture<TestComponent> {
  TestBed.overrideComponent(TestComponent, {set: {template: html}});
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  return fixture;
}

describe('ngb-typeahead-window', () => {

  beforeEach(() => {
    TestBed.overrideModule(NgbTypeaheadModule, {set: {exports: [NgbTypeaheadWindow]}});
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbTypeaheadModule]});
  });

  describe('display', () => {

    it('should display results with the first row active', async(() => {
         const fixture = createTestComponentFixture(
             '<ngb-typeahead-window [results]="results" [term]="term"></ngb-typeahead-window>');

         expectResults(fixture.nativeElement, ['+bar', 'baz']);
       }));

    it('should use a formatting function to display results', async(() => {
         const fixture = createTestComponentFixture(
             '<ngb-typeahead-window [results]="results" [term]="term" [formatter]="formatterFn"></ngb-typeahead-window>');

         expectResults(fixture.nativeElement, ['+BAR', 'BAZ']);
       }));

    it('should use a custom template if provided', async(() => {
         const fixture = createTestComponentFixture(`
           <template #rt let-r="result" let-t="term">{{r.toUpperCase()}}-{{t}}</template>
           <ngb-typeahead-window [results]="results" [term]="term" [resultTemplate]="rt"></ngb-typeahead-window>`);

         expectResults(fixture.nativeElement, ['+BAR-ba', 'BAZ-ba']);
       }));
  });

  describe('active row', () => {

    it('should change active row on prev / next method call', async(() => {
         const html = `
           <button (click)="w.next()">+</button>
           <button (click)="w.prev()">-</button>
           <ngb-typeahead-window [results]="results" [term]="term" #w="ngbTypeaheadWindow"></ngb-typeahead-window>`;
         const fixture = createTestComponentFixture(html);
         const buttons = fixture.nativeElement.querySelectorAll('button');

         expectResults(fixture.nativeElement, ['+bar', 'baz']);

         buttons[0].click();
         fixture.detectChanges();
         expectResults(fixture.nativeElement, ['bar', '+baz']);

         buttons[1].click();
         fixture.detectChanges();
         expectResults(fixture.nativeElement, ['+bar', 'baz']);
       }));

    it('should wrap active row on prev / next method call', async(() => {
         const html = `
           <button (click)="w.next()">+</button>
           <button (click)="w.prev()">-</button>
           <ngb-typeahead-window [results]="results" [term]="term" #w="ngbTypeaheadWindow"></ngb-typeahead-window>`;
         const fixture = createTestComponentFixture(html);
         const buttons = fixture.nativeElement.querySelectorAll('button');

         expectResults(fixture.nativeElement, ['+bar', 'baz']);

         buttons[1].click();
         fixture.detectChanges();
         expectResults(fixture.nativeElement, ['bar', '+baz']);

         buttons[0].click();
         fixture.detectChanges();
         expectResults(fixture.nativeElement, ['+bar', 'baz']);
       }));

    it('should change active row on mouseenter', async(() => {
         const fixture = createTestComponentFixture(
             `<ngb-typeahead-window [results]="results" [term]="term"></ngb-typeahead-window>`);
         const links = getWindowLinks(fixture.debugElement);

         expectResults(fixture.nativeElement, ['+bar', 'baz']);

         links[1].triggerEventHandler('mouseenter', {});
         fixture.detectChanges();
         expectResults(fixture.nativeElement, ['bar', '+baz']);
       }));
  });

  describe('result selection', () => {
    it('should select a given row on click', async(() => {
         const fixture = createTestComponentFixture(
             '<ngb-typeahead-window [results]="results" [term]="term" (select)="selected = $event"></ngb-typeahead-window>');
         const links = getWindowLinks(fixture.debugElement);

         expectResults(fixture.nativeElement, ['+bar', 'baz']);

         links[1].triggerEventHandler('click', {});
         fixture.detectChanges();
         expect(fixture.componentInstance.selected).toBe('baz');
       }));

    it('should return selected row via getActive()', async(() => {
         const html = `
           <button (click)="active = w.getActive()">getActive</button>
           <button (click)="w.next()">+</button>
           <ngb-typeahead-window [results]="results" [term]="term" #w="ngbTypeaheadWindow"></ngb-typeahead-window>`;
         const fixture = createTestComponentFixture(html);

         const buttons = fixture.nativeElement.querySelectorAll('button');
         const activeBtn = buttons[0];
         const nextBtn = buttons[1];

         activeBtn.click();
         expectResults(fixture.nativeElement, ['+bar', 'baz']);
         expect(fixture.componentInstance.active).toBe('bar');

         nextBtn.click();
         activeBtn.click();
         fixture.detectChanges();
         expectResults(fixture.nativeElement, ['bar', '+baz']);
         expect(fixture.componentInstance.active).toBe('baz');
       }));
  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  active: string;
  results = ['bar', 'baz'];
  term = 'ba';
  selected: string;

  formatterFn = (result) => { return result.toUpperCase(); };
}
