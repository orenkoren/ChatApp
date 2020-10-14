import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

const SOCKET_ENDPOINT = 'localhost:3000';
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
  typingTimer: NodeJS.Timeout;
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

  onReceiveMessage(message): void {
    this.messages.push(message);
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
