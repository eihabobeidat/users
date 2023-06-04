import { HttpClient } from '@angular/common/http';
import { Injectable, destroyPlatform } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from '../signalr/presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private currentUserSource = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService
  ) {}

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
    user.roles = [];
    let roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    // temp
    destroyPlatform();
    window.location.reload();
    //temp
  }

  getDecodedToken(token: string): {
    nameid: string;
    unique_name: string;
    role: string | string[];
    nbf: number;
    exp: number;
    iat: number;
  } | null {
    let decodedToken = null;
    if (token) {
      token = token.split('.')[1];
      decodedToken = JSON.parse(atob(token));
    }
    return decodedToken;
  }
}
