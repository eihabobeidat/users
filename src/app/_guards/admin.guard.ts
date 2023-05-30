import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { AccountService } from '../_services/authentication/account.service';
import { ToasterService } from '../_services/helpers/toaster.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private toastr: ToasterService
  ) {}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user) => {
        if (!user) return false;
        let isAdminOrModerator =
          user.roles.includes('Admin') || user.roles.includes('Moderator');
        if (isAdminOrModerator) return true;
        this.toastr.showError({
          message: "Oops ,you don't have the permission",
        });
        return false;
      })
    );
  }
}
