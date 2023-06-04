import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Toaster } from 'src/app/_models/helpersModels/toaster';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private default: Toaster = {
    message: undefined,
    positionClass: 'toast-bottom-right',
    timeOut: 3000,
    title: undefined,
  };

  constructor(private toastr: ToastrService) {}

  showSuccess(
    { message, positionClass, timeOut, title }: Partial<Toaster> = this.default
  ) {
    let options = { ...this.default };
    if (positionClass) options['positionClass'] = positionClass;
    if (timeOut) options['timeOut'] = timeOut;
    this.toastr.success(
      message ?? 'Processed successfully',
      title ?? 'Success',
      options
    );
  }

  showInfo(
    { message, positionClass, timeOut, title }: Partial<Toaster> = this.default
  ) {
    let options = { ...this.default };
    if (positionClass) options['positionClass'] = positionClass;
    if (timeOut) options['timeOut'] = timeOut;
    this.toastr.info(
      message ?? 'Informational message',
      title ?? 'Info',
      options
    );
  }

  showWarning(
    { message, positionClass, timeOut, title }: Partial<Toaster> = this.default
  ) {
    let options = { ...this.default };
    if (positionClass) options['positionClass'] = positionClass;
    if (timeOut) options['timeOut'] = timeOut;
    this.toastr.warning(
      message ?? 'Warning message',
      title ?? 'Warning',
      options
    );
  }

  showError(
    { message, positionClass, timeOut, title }: Partial<Toaster> = this.default
  ) {
    let options = { ...this.default };
    if (positionClass) options['positionClass'] = positionClass;
    if (timeOut) options['timeOut'] = timeOut;
    this.toastr.error(
      typeof message === 'string'
        ? message ?? 'Something went wrong, try again later'
        : message[0] ?? 'Something went wrong, try again later',
      title ?? 'Error',
      options
    );
  }
}
