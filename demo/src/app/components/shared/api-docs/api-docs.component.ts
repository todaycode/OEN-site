import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import docs from '../../../../api-docs';

@Component({
  selector: 'ngbd-api-docs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-docs.component.html'
})
export class NgbdApiDocs {
  apiDocs;
  @Input() set directive(directiveName) {
    this.apiDocs = docs[directiveName];
  };

  private _methodSignature(method) {
    const args = method.args.map(arg => `${arg.name}: ${arg.type}`).join(', ');
    return `${method.name}(${args})`;
  }
}
