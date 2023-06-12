import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, map, take } from 'rxjs';
import { ModalBoxComponent } from 'src/app/components/shared/modal-box/modal-box.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private bsModalRef: BsModalRef<ModalBoxComponent>;
  private defaultModelOptions: CustomModelOptions = {
    title: 'Confirmation',
    description: 'Are you sure you want to do this?',
    confirmButtonName: 'Ok',
    cancelButtonName: 'Cancel',
  };

  constructor(private modalService: BsModalService) {}

  confirm(
    options: Partial<CustomModelOptions> = this.defaultModelOptions,
    modelClass?: string
  ): Observable<boolean> {
    const modalConfig: ModalOptions = {
      class: modelClass ?? 'modal-dialog-centered',
      initialState: {
        ...this.defaultModelOptions,
        ...options,
        action: {
          isConfirmed: false,
        },
      },
    };
    //build you confirmation modal component and use it here instead of the string confirm (checkpoint)
    this.bsModalRef = this.modalService.show(ModalBoxComponent, modalConfig);
    return this.bsModalRef.onHide
      .pipe(take(1))
      .pipe(map((ref: any) => !!ref?.initialState?.action?.isConfirmed));
  }
}

interface CustomModelOptions {
  title: string;
  description: string;
  confirmButtonName: string;
  cancelButtonName: string;
}
