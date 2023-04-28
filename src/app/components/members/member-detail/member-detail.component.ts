import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMember();
    this.galleryOptions = [
      {
        width: '400px',
        height: '400px',
        imageAnimation: NgxGalleryAnimation.Slide,
        imagePercent: 100,
        thumbnailsColumns: 4,
        preview: false,
      },
    ];
  }

  loadMember() {
    let userIdentity = this.route.snapshot.paramMap.get('id');
    if (userIdentity) {
      this.memberService.getMember(userIdentity).subscribe((response) => {
        this.member = response;
        this.galleryImages = response.photos.map((photo) => ({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url,
        }));
        console.log(this.galleryImages);
      });
    }
  }
}
