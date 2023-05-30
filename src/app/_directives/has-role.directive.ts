import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/authentication/account.service';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]', //*appHasRole='["role1", "role2"]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  user: User;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) {
    accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) this.user = user;
    });
  }

  ngOnInit(): void {
    if (this.hasPrivilege())
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    else this.viewContainerRef.clear();
  }

  hasPrivilege(): boolean {
    return this.user.roles.some((role) => this.appHasRole.includes(role));
  }
}
