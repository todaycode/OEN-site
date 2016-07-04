import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-progressbar',
  template: `
    <ngbd-content-wrapper component="Progressbar">
      <ngbd-api-docs directive="NgbProgressbar"></ngbd-api-docs>
       <ngbd-example-box demoTitle="Contextual progress bars" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-progressbar-basic></ngbd-progressbar-basic>      
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Striped progress bars" [htmlSnippet]="snippets.striped.markup" [tsSnippet]="snippets.striped.code">
        <ngbd-progressbar-striped></ngbd-progressbar-striped>      
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdProgressbar {
  snippets = DEMO_SNIPPETS;
}
