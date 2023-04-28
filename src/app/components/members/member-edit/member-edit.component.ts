import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/authentication/account.service';
import { SpinnerService } from 'src/app/_services/helpers/spinner.service';
import { ToasterService } from 'src/app/_services/helpers/toaster.service';
import { MembersService } from 'src/app/_services/members/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editMemberForm') editForm: NgForm; //to grab our form in the html/template
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member;
  user: User;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toaster: ToasterService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.memberService
        .getMember(user.username)
        .subscribe((response) => (this.member = response));
    });
  }

  //another way to pass an element as a parameter as below form param
  updateMember(form) {
    this.memberService.UpdateMember(this.member).subscribe((_) => {
      this.toaster.showSuccess();
      this.editForm.reset(this.member);
    });
  }
}
