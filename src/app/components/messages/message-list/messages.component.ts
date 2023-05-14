import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'src/app/_models/message';
import { Pagination } from 'src/app/_models/pagination';
import { MessageService } from 'src/app/_services/messages/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  pageNumber: number = 1;
  pageSize: number = 5;
  container: 'Inbox' | 'Outbox' | 'Unread' = 'Unread';
  isLoading: boolean = false;

  constructor(private MessageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading = true;
    this.MessageService.getMessages(
      this.pageNumber,
      this.pageSize,
      this.container
    ).subscribe({
      next: (response) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
    });
  }

  pageChanged(event?: { page?: number; itemsPerPage?: number }) {
    if (event && this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  navigateToProfile(message: Message) {
    this.router.navigateByUrl(
      `member/${
        this.container === 'Outbox'
          ? message.recipientUserName
          : message.senderUserName
      }?tab=Messages`
    );
  }

  handleDelete(message: Message) {
    let deletedIndex = this.messages.findIndex((x) => x.id === message.id);
    this.MessageService.deleteMessage(message.id).subscribe({
      next: (_) => {
        this.messages.splice(deletedIndex, 1);
      },
    });
  }
}
