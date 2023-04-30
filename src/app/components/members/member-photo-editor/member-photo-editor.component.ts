import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { AccountService } from 'src/app/_services/authentication/account.service';
import { MembersService } from 'src/app/_services/members/members.service';

@Component({
  selector: 'app-member-photo-editor',
  templateUrl: './member-photo-editor.component.html',
  styleUrls: ['./member-photo-editor.component.css'],
})
export class MemberPhotoEditorComponent {
  @Input() member: Member;
  @Output() fileHandler = new EventEmitter();
  @Output() deleteHandler = new EventEmitter();

  constructor(
    private memberService: MembersService,
    private accountService: AccountService
  ) {}

  setMainPhoto(photo: Photo) {
    this.memberService.SetMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.member) {
          this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
            user.photoUrl = photo.url;
            this.accountService.setCurrentUser(user);
          });
          let lastMainPhoto = this.member.photos.find((x) => x.isMain);
          lastMainPhoto.isMain = false;
          photo.isMain = true;
          this.fileHandler.emit(lastMainPhoto);
          this.fileHandler.emit(photo);
        }
      },
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.deleteHandler.emit(photo);
      },
    });
  }
}
