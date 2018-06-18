import { Component } from '@angular/core';

import { NGB_ALERT_DIRECTIVES } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-alert-basic',
  template: require('./alert-basic.html'),
  directives: [NGB_ALERT_DIRECTIVES]
})
export class NgbdAlertBasic {}
