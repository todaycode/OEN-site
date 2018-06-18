import {Component} from '@angular/core';
import {NGB_PAGINATION_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-pagination-basic',
  templateUrl: './pagination-basic.html',
  directives: [NGB_PAGINATION_DIRECTIVES]
})
export class NgbdPaginationBasic {
  page = 4;
}
