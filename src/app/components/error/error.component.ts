import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  baseurl = 'https://localhost:44339/api/';

  constructor(private httpClient: HttpClient) {}

  get404Error() {
    this.httpClient.get(this.baseurl + 'ErrorHandler/not-found').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get500Error() {
    this.httpClient.get(this.baseurl + 'ErrorHandler/server-error').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get401Error() {
    this.httpClient.get(this.baseurl + 'ErrorHandler/auth').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get400Error() {
    this.httpClient.get(this.baseurl + 'ErrorHandler/bad-request').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
