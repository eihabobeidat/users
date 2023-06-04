import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  getPaginatedResult,
  getPaginationHeaders,
} from '../helpers/helper.service';
import { Message } from 'src/app/_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from 'src/app/_models/user';
import { WebSocketEvents } from '../signalr/signalrEvents';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from 'src/app/_models/group';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messagesThreadSource = new BehaviorSubject<Message[]>([]);
  messagesThread$ = this.messagesThreadSource.asObservable();

  constructor(private http: HttpClient) {}

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + `message?user=${otherUsername}`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch((error) =>
        console.log(
          'message hub connection error when connection started',
          error
        )
      );

    this.hubConnection.on(
      WebSocketEvents.RecieveMessageThread,
      (messages: Message[]) => {
        this.messagesThreadSource.next(messages);
      }
    );

    this.hubConnection.on(WebSocketEvents.NewMessage, (newMessage: Message) => {
      this.messagesThread$.pipe(take(1)).subscribe({
        next: (messages) => {
          this.messagesThreadSource.next([...messages, newMessage]);
        },
      });
    });

    this.hubConnection.on(
      WebSocketEvents.UpdatedThreadGroup,
      (group: Group) => {
        if (group.connections.some((x) => x.username === otherUsername)) {
          this.messagesThread$.pipe(take(1)).subscribe({
            next: (messages) => {
              messages.forEach((message) => {
                if (!message.dateRead) {
                  message.dateRead = new Date(Date.now());
                }
              });
              this.messagesThreadSource.next([...messages]);
            },
          });
        }
      }
    );
  }

  stopHubConnection() {
    this.hubConnection &&
      this.hubConnection
        .stop()
        .catch((error) =>
          console.log(
            'message hub connection error when connection stoped',
            error
          )
        );
  }

  getMessages(
    pageNumber: number,
    pageSize: number,
    container: 'Unread' | 'Outbox' | 'Inbox'
  ) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('container', container);

    return getPaginatedResult<Message[]>(
      this.http,
      this.baseUrl + 'Messages',
      params
    );
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      this.baseUrl + `Messages/thread/${username}`
    );
  }

  async sendMessage(username: string, content: string) {
    // return this.http.post<Message>(this.baseUrl + 'Messages', {
    //   recipientUsername: username,
    //   content,
    // });
    return this.hubConnection
      .invoke('SendMessage', {
        recipientUsername: username,
        content,
      })
      .catch((error) =>
        console.log('send message error when hub function invoked', error)
      );
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'Messages/' + id);
  }
}
