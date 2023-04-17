import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/authentication/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    let stringifyUser = localStorage.getItem('user');
    if (stringifyUser) {
      this.accountService.setCurrentUser(JSON.parse(stringifyUser));
    }
  }
}
