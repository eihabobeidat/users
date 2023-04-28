import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'src/app/_models/helpersModels/spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  busyRequestCount = 0;
  defaultSpinner: Spinner = {
    type: 'ball-atom',
    size: 'large',
    bdColor: 'rgba(10, 30, 50, 0.8)',
    color: 'rgba(190, 70, 40)',
  };

  constructor(private spinner: NgxSpinnerService) {}

  show(
    spinnerName: 'primary' | 'secondary' = 'primary',
    options: Spinner = this.defaultSpinner
  ) {
    this.busyRequestCount++;
    this.spinner.show(spinnerName, options);
  }

  hide(spinnerName: 'primary' | 'secondary' = 'primary') {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide(spinnerName);
    }
  }
}
