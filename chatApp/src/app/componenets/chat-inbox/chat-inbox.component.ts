import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css'],
})
export class ChatInboxComponent {
  socket: any;
  messageInput = new FormControl();
  messages: Message[] = [];
  userTypingList = new Set<string>();
  canSendTyping = true;
  typingTimer: ReturnType<typeof setTimeout>;
  constructor(
    private socketServie: SocketService,
    private authService: AuthService
  ) {
    socketServie
      .onMessageReceive()
      .subscribe((message) => this.onReceiveMessage(message));
    socketServie.onUserTyping().subscribe((user) => {
      console.log('subscriber' + user);
      this.onUserTyping(user);
    });
    socketServie.onUserStoppedTyping().subscribe((user) => {
      this.onUserStopTyping(user);
    });
    socketServie.onMessageRead().subscribe(() => this.onMessageRead());
  }

  sendMessage(): void {
    const message = new Message(
      this.messageInput.value,
      this.authService.getUsername()
    );
    console.log(message);
    this.socketServie.emitMessage(message);
    this.messages.push(message);
    this.messageInput.reset();
  }

  notifyTyping(): void {
    if (!this.canSendTyping) {
      return;
    }

    this.socketServie.emitUserTyping(this.authService.getUsername());
    this.canSendTyping = false;
    setTimeout(() => {
      this.canSendTyping = true;
    }, 2000);

    this.typingTimer = setTimeout(() => {
      console.log('in timeout');
      this.socketServie.emitUserStopTyping(this.authService.getUsername());
    }, 1000);
  }

  isOwnMessage(message: Message): boolean {
    return message.Sender === this.authService.getUsername();
  }

  onMessageRead(): void {
    console.log('confirmed message read');
    this.messages.forEach((message) => {
      message.Read = true;
    });
  }

  isMessageRead(message: Message): boolean {
    return message.Read;
  }

  onReceiveMessage(message): void {
    this.messages.push(message);
    this.socketServie.emitMessageRead();
  }

  onUserTyping(user: string): void {
    this.userTypingList.add(user);
  }

  onUserStopTyping(user: string): void {
    console.log('deleting' + user);
    this.userTypingList.delete(user);
  }

  get usersTyping(): string {
    let prettyUserString = '';
    this.userTypingList.forEach((element) => {
      prettyUserString += element;
    });
    prettyUserString += ' is typing...';
    return prettyUserString;
  }
}
