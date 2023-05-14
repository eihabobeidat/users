import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { ToasterService } from 'src/app/_services/helpers/toaster.service';
import { MembersService } from 'src/app/_services/members/members.service';
import { MessageService } from 'src/app/_services/messages/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab: TabDirective;
  messages: Message[];

  constructor(
    private memberService: MembersService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private toastr: ToasterService
  ) {
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
    this.route.data.subscribe({
      next: (data) => {
        this.member = data['member'];
        this.galleryImages = data['member'].photos.map((photo) => ({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url,
        }));
      },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params) => {
        this.selectTab(params['tab']);
      },
    });
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
      });
    }
  }

  addLike() {
    this.memberService.addLike(this.member.userName).subscribe(() => {
      this.toastr.showSuccess({
        title: `You Liked ${this.member.knownAs}`,
        message: '',
      });
    });
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages') {
      this.loadMessageThread();
    }
  }

  loadMessageThread() {
    if (this.member.userName)
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (response) => {
          this.messages = response;
        },
      });
  }

  selectTab(heading: string) {
    if (this.memberTabs?.tabs) {
      this.memberTabs.tabs.find((x) => x.heading === heading)!.active = true;
    }
  }
}
