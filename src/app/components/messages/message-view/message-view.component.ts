import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/messages/message.service';

@Component({
  selector: 'app-message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.css'],
})
export class MessageViewComponent implements OnInit {
  @Input() username: string;
  @Input() messages: Message[];
  @ViewChild('messageForm') form: NgForm;
  messageContent: string;
  now: string = new Date().toDateString();

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  addMessage() {
    if (this.username)
      this.messageService
        .sendMessage(this.username, this.messageContent)
        .subscribe({
          next: (message) => {
            this.messages.push(message);
            this.form.reset();
          },
        });
  }
}
