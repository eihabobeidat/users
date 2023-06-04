import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';
import { ToasterService } from '../helpers/toaster.service';
import { WebSocketEvents } from './signalrEvents';
import { BehaviorSubject, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private toastr: ToasterService,
    private router: Router,
    private originalToastr: ToastrService
  ) {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => {
      console.log(
        'presence hub connection error when connection started',
        error
      );
    });

    this.hubConnection.on(WebSocketEvents.UserOnline, (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (onlineUsers) => {
          this.onlineUsersSource.next([...onlineUsers, username]);
        },
      });
    });

    this.hubConnection.on(WebSocketEvents.UserOffline, (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: (onlineUsers) => {
          this.onlineUsersSource.next(
            onlineUsers.filter((x) => x !== username)
          );
        },
      });
    });

    this.hubConnection.on(
      WebSocketEvents.GetOnlineUsers,
      (onlineUsers: string[]) => {
        this.onlineUsersSource.next(onlineUsers);
      }
    );

    this.hubConnection.on(
      WebSocketEvents.MessageNotification,
      ({ knownAs, username }: { knownAs: string; username: string }) => {
        // this.toastr.showInfo({
        //   title: `${knownAs} sent you a new message`,
        //   message: '',
        // })
        this.originalToastr
          .info('', `${knownAs} sent you a new message`)
          .onTap.pipe(take(1))
          .subscribe({
            next: () =>
              this.router.navigateByUrl(`/member/${username}?tab=Messages`),
          });
      }
    );
  }

  stopHubConnection() {
    this.hubConnection.stop().catch((error) => {
      console.log(
        'presence hub connection error when connection stopped',
        error
      );
    });
  }
}
