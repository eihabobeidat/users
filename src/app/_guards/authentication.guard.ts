import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/authentication/account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private accountService: AccountService) {}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(map((user) => !!user));
  }

  canDeactivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(map((user) => !!user));
  }

  canMatch(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(map((user) => !user));
  }
}
