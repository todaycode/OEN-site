import {Injectable, TemplateRef} from '@angular/core';

/**
 * A service to open modals
 */
@Injectable()
export class ModalService {

  /**
   * A method to open a modal
   */
  open(content: string | TemplateRef, options = {}): boolean {
    return true;
  }
}
