import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Toaster } from 'src/app/_models/helpersModels/toaster';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private toastr: ToastrService) {}

  showSuccess({ message, position, timeOut, title }: Partial<Toaster>) {
    let options = {};
    options['positionClass'] = position ?? 'toast-bottom-right';
    if (timeOut) options['timeOut'] = timeOut;
    this.toastr.success(
      message ?? 'Processed successfully',
      title ?? 'Success',
      options
    );
  }

  showInfo({ message, position, timeOut, title }: Partial<Toaster>) {
    let options = {};
    options['positionClass'] = position ?? 'toast-bottom-right';
    if (timeOut) options['timeOut'] = timeOut;
    this.toastr.info(
      message ?? 'Informational message',
      title ?? 'Info',
      options
    );
  }

  showWarning({ message, position, timeOut, title }: Partial<Toaster>) {
    let options = {};
    options['positionClass'] = position ?? 'toast-bottom-right';
    if (timeOut) options['timeOut'] = timeOut;
    this.toastr.warning(
      message ?? 'Warning message',
      title ?? 'Warning',
      options
    );
  }

  showError({ message, position, timeOut, title }: Partial<Toaster>) {
    let options = {};
    options['positionClass'] = position ?? 'toast-bottom-right';
    if (timeOut) options['timeOut'] = timeOut;
    this.toastr.error(
      typeof message === 'string'
        ? message ?? 'Something went wrong, try again later'
        : message['title'] ?? 'Something went wrong, try again later',
      title ?? 'Error',
      options
    );
  }
}
