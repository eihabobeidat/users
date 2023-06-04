import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { AccountService } from 'src/app/_services/authentication/account.service';
import { ToasterService } from 'src/app/_services/helpers/toaster.service';
import { MembersService } from 'src/app/_services/members/members.service';
import { MessageService } from 'src/app/_services/messages/message.service';
import { PresenceService } from 'src/app/_services/signalr/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
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
    private toastr: ToasterService,
    public presenceService: PresenceService,
    public accountService: AccountService,
    private router: Router
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
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
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
      // this.loadMessageThread();
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: (currentUser) => {
          if (currentUser && this.member?.userName)
            this.messageService.createHubConnection(
              currentUser,
              this.member.userName
            );
        },
      });
    } else {
      this.messageService.stopHubConnection();
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
