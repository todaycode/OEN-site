import {TestBed, ComponentFixture, inject, fakeAsync, tick} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';

import {NgbPaginationModule} from './pagination.module';
import {NgbPagination} from './pagination';
import {NgbPaginationConfig} from './pagination-config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function expectPages(nativeEl: HTMLElement, pagesDef: string[]): void {
  const pages = nativeEl.querySelectorAll('li');

  expect(pages.length).toEqual(pagesDef.length);

  for (let i = 0; i < pagesDef.length; i++) {
    let pageDef = pagesDef[i];
    let classIndicator = pageDef.charAt(0);

    if (classIndicator === '+') {
      expect(pages[i]).toHaveCssClass('active');
      expect(pages[i]).not.toHaveCssClass('disabled');
      expect(normalizeText(pages[i].textContent)).toEqual(pageDef.substr(1));
    } else if (classIndicator === '-') {
      expect(pages[i]).not.toHaveCssClass('active');
      expect(pages[i]).toHaveCssClass('disabled');
      expect(normalizeText(pages[i].textContent)).toEqual(pageDef.substr(1));
      if (normalizeText(pages[i].textContent) !== '...') {
        expect(pages[i].querySelector('a').getAttribute('tabindex')).toEqual('-1');
      }
    } else {
      expect(pages[i]).not.toHaveCssClass('active');
      expect(pages[i]).not.toHaveCssClass('disabled');
      expect(normalizeText(pages[i].textContent)).toEqual(pageDef);
      if (normalizeText(pages[i].textContent) !== '...') {
        expect(pages[i].querySelector('a').hasAttribute('tabindex')).toBeFalsy();
      }
    }
  }
}

function getLink(nativeEl: HTMLElement, idx: number): HTMLAnchorElement {
  return <HTMLAnchorElement>nativeEl.querySelectorAll('li')[idx].querySelector('a');
}

function getList(nativeEl: HTMLElement) {
  return <HTMLUListElement>nativeEl.querySelector('ul');
}

function normalizeText(txt: string): string {
  return txt.trim().replace(/\s+/g, ' ');
}

function expectSameValues(pagination: NgbPagination, config: NgbPaginationConfig) {
  expect(pagination.boundaryLinks).toBe(config.boundaryLinks);
  expect(pagination.directionLinks).toBe(config.directionLinks);
  expect(pagination.ellipses).toBe(config.ellipses);
  expect(pagination.maxSize).toBe(config.maxSize);
  expect(pagination.pageSize).toBe(config.pageSize);
  expect(pagination.rotate).toBe(config.rotate);
  expect(pagination.size).toBe(config.size);
}

describe('ngb-pagination', () => {
  describe('business logic', () => {

    let pagination: NgbPagination;

    beforeEach(() => { pagination = new NgbPagination(new NgbPaginationConfig()); });

    it('should initialize inputs with default values', () => {
      const defaultConfig = new NgbPaginationConfig();
      expectSameValues(pagination, defaultConfig);
    });

    it('should calculate and update no of pages (default page size)', () => {
      pagination.collectionSize = 100;
      pagination.ngOnChanges(null);
      expect(pagination.pages.length).toEqual(10);

      pagination.collectionSize = 200;
      pagination.ngOnChanges(null);
      expect(pagination.pages.length).toEqual(20);
    });

    it('should calculate and update no of pages (custom page size)', () => {
      pagination.collectionSize = 100;
      pagination.pageSize = 20;
      pagination.ngOnChanges(null);
      expect(pagination.pages.length).toEqual(5);

      pagination.collectionSize = 200;
      pagination.ngOnChanges(null);
      expect(pagination.pages.length).toEqual(10);

      pagination.pageSize = 10;
      pagination.ngOnChanges(null);
      expect(pagination.pages.length).toEqual(20);
    });

    it('should allow setting a page within a valid range (default page size)', () => {
      pagination.collectionSize = 100;
      pagination.page = 2;
      pagination.ngOnChanges(null);
      expect(pagination.page).toEqual(2);
    });

    it('should auto-correct page no if outside of valid range (default page size)', () => {
      pagination.collectionSize = 100;
      pagination.page = 100;
      pagination.ngOnChanges(null);
      expect(pagination.page).toEqual(10);

      pagination.page = -100;
      pagination.ngOnChanges(null);
      expect(pagination.page).toEqual(1);

      pagination.page = 5;
      pagination.collectionSize = 10;
      pagination.ngOnChanges(null);
      expect(pagination.page).toEqual(1);
    });

    it('should allow setting a page within a valid range (custom page size)', () => {
      pagination.collectionSize = 100;
      pagination.pageSize = 20;
      pagination.page = 2;
      pagination.ngOnChanges(null);
      expect(pagination.page).toEqual(2);
    });

  });

  describe('UI logic', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbPaginationModule.forRoot()]});
    });

    it('should render and respond to collectionSize change', () => {
      const html = '<ngb-pagination [collectionSize]="collectionSize" [page]="1"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.collectionSize = 30;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

      fixture.componentInstance.collectionSize = 40;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '» Next']);
    });

    it('should render and respond to pageSize change', () => {
      const html =
          '<ngb-pagination [collectionSize]="collectionSize" [page]="1" [pageSize]="pageSize"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.collectionSize = 30;
      fixture.componentInstance.pageSize = 5;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '6', '» Next']);

      fixture.componentInstance.pageSize = 10;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);
    });

    it('should render and respond to active page change', () => {
      const html = '<ngb-pagination [collectionSize]="collectionSize" [page]="page"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.collectionSize = 30;
      fixture.componentInstance.page = 2;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

      fixture.componentInstance.page = 3;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
    });

    it('should update selected page model on page no click', () => {
      const html = '<ngb-pagination [collectionSize]="collectionSize" [page]="page"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.collectionSize = 30;
      fixture.componentInstance.page = 2;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

      getLink(fixture.nativeElement, 0).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);


      getLink(fixture.nativeElement, 3).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
    });

    it('should update selected page model on prev / next click', () => {
      const html =
          '<ngb-pagination [collectionSize]="collectionSize" [page]="page" [directionLinks]="directionLinks"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.collectionSize = 30;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['+1', '2', '3']);

      fixture.componentInstance.directionLinks = true;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

      getLink(fixture.nativeElement, 0).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

      getLink(fixture.nativeElement, 4).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

      getLink(fixture.nativeElement, 4).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);

      getLink(fixture.nativeElement, 4).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
    });

    it('should update selected page model on first / last click', () => {
      const html = `<ngb-pagination [collectionSize]="collectionSize" [page]="page" [maxSize]="maxSize"
              [boundaryLinks]="boundaryLinks"></ngb-pagination>`;
      const fixture = createTestComponent(html);

      fixture.componentInstance.collectionSize = 30;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

      fixture.componentInstance.boundaryLinks = true;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-«« First', '-« Previous', '+1', '2', '3', '» Next', '»» Last']);

      getLink(fixture.nativeElement, 0).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-«« First', '-« Previous', '+1', '2', '3', '» Next', '»» Last']);

      getLink(fixture.nativeElement, 6).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['«« First', '« Previous', '1', '2', '+3', '-» Next', '-»» Last']);

      getLink(fixture.nativeElement, 3).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['«« First', '« Previous', '1', '+2', '3', '» Next', '»» Last']);

      getLink(fixture.nativeElement, 0).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-«« First', '-« Previous', '+1', '2', '3', '» Next', '»» Last']);

      // maxSize < number of pages
      fixture.componentInstance.collectionSize = 70;
      fixture.componentInstance.maxSize = 3;
      fixture.detectChanges();
      expectPages(
          fixture.nativeElement, ['-«« First', '-« Previous', '+1', '2', '3', '-...', '7', '» Next', '»» Last']);

      getLink(fixture.nativeElement, 8).click();
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['«« First', '« Previous', '1', '-...', '+7', '-» Next', '-»» Last']);

      getLink(fixture.nativeElement, 0).click();
      fixture.detectChanges();
      expectPages(
          fixture.nativeElement, ['-«« First', '-« Previous', '+1', '2', '3', '-...', '7', '» Next', '»» Last']);
    });

    it('should update page when it becomes out of range', fakeAsync(() => {
         const html =
             '<ngb-pagination [collectionSize]="collectionSize" [(page)]="page" [size]="size"></ngb-pagination>';
         const fixture = createTestComponent(html);

         fixture.componentInstance.collectionSize = 30;
         fixture.detectChanges();
         expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

         getLink(fixture.nativeElement, 3).click();
         fixture.detectChanges();
         tick();
         expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '-» Next']);
         expect(fixture.componentInstance.page).toBe(3);

         fixture.componentInstance.collectionSize = 20;
         fixture.detectChanges();
         tick();
         expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '-» Next']);
         expect(fixture.componentInstance.page).toBe(2);
       }));

    it('should render and respond to size change', () => {
      const html = '<ngb-pagination [collectionSize]="20" [page]="1" [size]="size"></ngb-pagination>';

      const fixture = createTestComponent(html);
      const listEl = getList(fixture.nativeElement);

      // default case
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '» Next']);
      expect(listEl).toHaveCssClass('pagination');

      // large size
      fixture.componentInstance.size = 'lg';
      fixture.detectChanges();
      expect(listEl).toHaveCssClass('pagination');
      expect(listEl).toHaveCssClass('pagination-lg');

      // removing large size
      fixture.componentInstance.size = '';
      fixture.detectChanges();
      expect(listEl).toHaveCssClass('pagination');
      expect(listEl).not.toHaveCssClass('pagination-lg');

      // arbitrary string
      fixture.componentInstance.size = '123';
      fixture.detectChanges();
      expect(listEl).toHaveCssClass('pagination');
      expect(listEl).toHaveCssClass('pagination-123');
    });

    it('should render and respond to maxSize change correctly', () => {
      const html =
          '<ngb-pagination [collectionSize]="70" [page]="page" [maxSize]="maxSize" [ellipses]="ellipses"></ngb-pagination>';
      const fixture = createTestComponent(html);

      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '6', '7', '» Next']);

      // disabling ellipsis
      fixture.componentInstance.ellipses = false;

      // limiting to 3 page numbers
      fixture.componentInstance.maxSize = 3;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

      fixture.componentInstance.page = 3;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '» Next']);

      fixture.componentInstance.page = 4;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '+4', '5', '6', '» Next']);

      fixture.componentInstance.page = 7;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '+7', '-» Next']);

      // checking that maxSize > total pages works
      fixture.componentInstance.maxSize = 100;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '2', '3', '4', '5', '6', '+7', '-» Next']);
    });

    it('should render and rotate pages correctly', () => {
      const html = `<ngb-pagination [collectionSize]="70" [page]="page" [maxSize]="maxSize" [rotate]="rotate"
        [ellipses]="ellipses"></ngb-pagination>`;
      const fixture = createTestComponent(html);

      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '6', '7', '» Next']);

      // disabling ellipsis
      fixture.componentInstance.ellipses = false;

      // limiting to 3 (odd) page numbers
      fixture.componentInstance.maxSize = 3;
      fixture.componentInstance.rotate = true;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '» Next']);

      fixture.componentInstance.page = 2;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '3', '» Next']);

      fixture.componentInstance.page = 3;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '2', '+3', '4', '» Next']);

      fixture.componentInstance.page = 7;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '5', '6', '+7', '-» Next']);

      // limiting to 4 (even) page numbers
      fixture.componentInstance.maxSize = 4;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '4', '5', '6', '+7', '-» Next']);

      fixture.componentInstance.page = 5;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '3', '4', '+5', '6', '» Next']);

      fixture.componentInstance.page = 3;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '2', '+3', '4', '» Next']);
    });

    it('should display ellipsis correctly', () => {
      const html = `<ngb-pagination [collectionSize]="70" [page]="page"
        [maxSize]="maxSize" [rotate]="rotate" [ellipses]="ellipses"></ngb-pagination>`;
      const fixture = createTestComponent(html);

      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '6', '7', '» Next']);

      // limiting to 3 page numbers
      fixture.componentInstance.maxSize = 3;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '-...', '7', '» Next']);

      fixture.componentInstance.page = 4;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '-...', '+4', '5', '6', '-...', '7', '» Next']);

      fixture.componentInstance.page = 7;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '-...', '+7', '-» Next']);

      // enabling rotation
      fixture.componentInstance.rotate = true;
      fixture.componentInstance.page = 1;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '-...', '7', '» Next']);

      fixture.componentInstance.page = 2;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '3', '-...', '7', '» Next']);

      fixture.componentInstance.page = 3;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '-...', '2', '+3', '4', '-...', '7', '» Next']);

      fixture.componentInstance.page = 7;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '-...', '5', '6', '+7', '-» Next']);

      // no ellipsis when maxPage > total pages
      fixture.componentInstance.maxSize = 100;
      fixture.componentInstance.page = 5;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '2', '3', '4', '+5', '6', '7', '» Next']);
    });

    it('should handle edge "maxSize" values', () => {
      const html = '<ngb-pagination [collectionSize]="50" [maxSize]="maxSize"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.maxSize = 2;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '-...', '5', '» Next']);

      fixture.componentInstance.maxSize = 0;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '» Next']);

      fixture.componentInstance.maxSize = 100;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '» Next']);

      fixture.componentInstance.maxSize = NaN;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '» Next']);

      fixture.componentInstance.maxSize = null;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '3', '4', '5', '» Next']);
    });

    it('should handle edge "collectionSize" values', () => {
      const html = '<ngb-pagination [collectionSize]="collectionSize"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.collectionSize = 0;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '-» Next']);

      fixture.componentInstance.collectionSize = NaN;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '-» Next']);

      fixture.componentInstance.collectionSize = null;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '-» Next']);
    });

    it('should handle edge "pageSize" values', () => {
      const html = '<ngb-pagination [collectionSize]="50" [pageSize]="pageSize"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.pageSize = 0;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '-» Next']);

      fixture.componentInstance.pageSize = NaN;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '-» Next']);

      fixture.componentInstance.pageSize = null;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '-» Next']);
    });

    it('should handle edge "page" values', () => {
      const html = '<ngb-pagination [collectionSize]="20" [page]="page"></ngb-pagination>';
      const fixture = createTestComponent(html);

      fixture.componentInstance.page = 0;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['-« Previous', '+1', '2', '» Next']);

      fixture.componentInstance.page = 2016;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '-» Next']);

      fixture.componentInstance.page = NaN;
      expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '-» Next']);

      fixture.componentInstance.page = null;
      expectPages(fixture.nativeElement, ['« Previous', '1', '+2', '-» Next']);
    });

    it('should not emit "pageChange" for incorrect input values', fakeAsync(() => {
         const html = `<ngb-pagination [collectionSize]="collectionSize" [pageSize]="pageSize" [maxSize]="maxSize" 
        (pageChange)="onPageChange($event)"></ngb-pagination>`;
         const fixture = createTestComponent(html);
         tick();

         spyOn(fixture.componentInstance, 'onPageChange');

         fixture.componentInstance.collectionSize = NaN;
         fixture.detectChanges();
         tick();

         fixture.componentInstance.maxSize = NaN;
         fixture.detectChanges();
         tick();

         fixture.componentInstance.pageSize = NaN;
         fixture.detectChanges();
         tick();

         expect(fixture.componentInstance.onPageChange).not.toHaveBeenCalled();
       }));
  });

  describe('Custom config', () => {
    let config: NgbPaginationConfig;

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbPaginationModule.forRoot()]}); });

    beforeEach(inject([NgbPaginationConfig], (c: NgbPaginationConfig) => {
      config = c;
      config.boundaryLinks = true;
      config.directionLinks = false;
      config.ellipses = false;
      config.maxSize = 42;
      config.pageSize = 7;
      config.rotate = true;
      config.size = 'sm';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(NgbPagination);
      fixture.detectChanges();

      let pagination = fixture.componentInstance;
      expectSameValues(pagination, config);
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbPaginationConfig();
    config.boundaryLinks = true;
    config.directionLinks = false;
    config.ellipses = false;
    config.maxSize = 42;
    config.pageSize = 7;
    config.rotate = true;
    config.size = 'sm';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbPaginationModule.forRoot()], providers: [{provide: NgbPaginationConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = TestBed.createComponent(NgbPagination);
      fixture.detectChanges();

      let pagination = fixture.componentInstance;
      expectSameValues(pagination, config);
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  pageSize = 10;
  collectionSize = 100;
  page = 1;
  boundaryLinks = false;
  directionLinks = false;
  size = '';
  maxSize = 0;
  ellipses = true;
  rotate = false;

  onPageChange = () => {};
}
