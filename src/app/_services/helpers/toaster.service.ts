import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private toastr: ToastrService) {}

  showSuccess({ message, position, timeOut, title }: Partial<Toaster>) {
    this.toastr.success(message, title, { positionClass: position, timeOut });
  }

  showInfo({ message, position, timeOut, title }: Partial<Toaster>) {
    this.toastr.info(message, title, { positionClass: position, timeOut });
  }

  showWarning({ message, position, timeOut, title }: Partial<Toaster>) {
    this.toastr.warning(message, title, { positionClass: position, timeOut });
  }

  showError({ message, position, timeOut, title }: Partial<Toaster>) {
    this.toastr.error(message, title, { positionClass: position, timeOut });
  }
}
