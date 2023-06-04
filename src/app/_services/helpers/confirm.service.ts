import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  bsModalRef: BsModalRef;
  defaultModelOptions: CustomModelOptions = {
    title: 'Confirmation',
    message: 'Are you sure you want to do this?',
    confirmButtonName: 'Ok',
    cancelButtonName: 'Cancel',
  };

  constructor(private modalService: BsModalService) {}

  confirm(options: Partial<CustomModelOptions>, modelClass?: string) {
    const modalConfig: ModalOptions = {
      class: modelClass ?? 'modal-dialog-centered',
      initialState: {
        ...this.defaultModelOptions,
        ...options,
      },
    };
    //build you confirmation modal component and use it here instead of the string confirm (checkpoint)
    this.bsModalRef = this.modalService.show('confirm', modalConfig);
  }
}

interface CustomModelOptions {
  title: string;
  message: string;
  confirmButtonName: string;
  cancelButtonName: string;
}
