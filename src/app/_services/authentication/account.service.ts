import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private currentUserSource = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  register(model: any) {
    return this.http
      .post<User>(environment.apiUrl + 'Account/Register', model)
      .pipe(
        map((response: User) => {
          if (response) {
            this.setCurrentUser(response);
          }
        })
      );
  }

  login(model: any) {
    return this.http
      .post<any>(environment.apiUrl + 'Account/login', model)
      .pipe(
        map((response: User) => {
          if (response) {
            this.setCurrentUser(response);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
