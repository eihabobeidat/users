import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-box',
  templateUrl: './modal-box.component.html',
  styleUrls: ['./modal-box.component.css'],
})
export class ModalBoxComponent {
  title: string = '';
  description: string = '';
  username: string = '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];
  closeButtonName: string = '';

  constructor(public bsModalRef: BsModalRef) {}

  updateChecked(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue);
    if (index < 0) {
      this.selectedRoles.push(checkedValue);
    } else {
      this.selectedRoles.splice(index, 1);
    }
  }
}
