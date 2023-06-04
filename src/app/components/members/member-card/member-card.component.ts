import { Component, Input } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { ToasterService } from 'src/app/_services/helpers/toaster.service';
import { MembersService } from 'src/app/_services/members/members.service';
import { PresenceService } from 'src/app/_services/signalr/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent {
  @Input() member: Member;

  constructor(
    private memberService: MembersService,
    private toastr: ToasterService,
    public presenceSerive: PresenceService
  ) {}

  addLike() {
    this.memberService.addLike(this.member.userName).subscribe(() => {
      this.toastr.showSuccess({
        title: `You Liked ${this.member.knownAs}`,
        message: '',
      });
    });
  }
}
