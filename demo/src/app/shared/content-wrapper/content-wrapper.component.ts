import {Component, Input} from '@angular/core';
import {SideNavComponent} from '../side-nav';

@Component({
  selector: 'ngbd-content-wrapper',
  directives: [SideNavComponent],
  templateUrl: './content-wrapper.component.html'
})
export class ContentWrapper {
  @Input()
  public component: string;
}
