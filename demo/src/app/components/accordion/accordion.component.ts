import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-accordion',
  template: `
    <ngbd-content-wrapper component="Accordion">
      <ngbd-api-docs directive="NgbAccordion"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbPanel"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbPanelTitle"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbPanelContent"></ngbd-api-docs>
      <ngbd-api-docs-class type="NgbPanelChangeEvent"></ngbd-api-docs-class>
      <ngbd-example-box demoTitle="Accordion" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-accordion-basic></ngbd-accordion-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="One open panel at a time" [htmlSnippet]="snippets.static.markup" [tsSnippet]="snippets.static.code">
        <ngbd-accordion-static></ngbd-accordion-static>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Toggle panels" [htmlSnippet]="snippets.toggle.markup" [tsSnippet]="snippets.toggle.code">
        <ngbd-accordion-toggle></ngbd-accordion-toggle>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Prevent panel toggle" [htmlSnippet]="snippets.preventChange.markup"
        [tsSnippet]="snippets.preventChange.code">
        <ngbd-accordion-preventchange></ngbd-accordion-preventchange>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdAccordion {
  snippets = DEMO_SNIPPETS;
}
