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
  cancelButtonName: string = '';
  confirmButtonName: string = '';
  action: any;

  constructor(public bsModalRef: BsModalRef) {}

  handleConfirm() {
    this.action.isConfirmed = true;
    this.handleCancel();
  }

  handleCancel() {
    this.bsModalRef.hide();
  }
}
