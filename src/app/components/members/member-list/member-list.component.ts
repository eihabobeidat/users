import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/authentication/account.service';
import { MembersService } from 'src/app/_services/members/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[];
  userParams: UserParams;
  user: User;
  genderList = [
    { name: 'Males', code: 'female' },
    { name: 'Females', code: 'male' },
  ];

  constructor(
    public memberService: MembersService,
    accountService: AccountService
  ) {
    accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.userParams = memberService.userParamsCached ?? new UserParams(user);
    });
  }

  resetFilters() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      this.reloadMembers();
    }
  }

  ngOnInit(): void {
    this.reloadMembers();
  }

  reloadMembers($event?: { page: number; itemsPerPage: number }) {
    if ($event) {
      this.userParams.page = $event.page;
    }

    this.memberService
      .getMembers(this.userParams)
      .subscribe((response) => (this.members = response));
  }
}
