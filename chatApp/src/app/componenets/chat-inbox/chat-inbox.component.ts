import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  constructor(
    private socketServie: SocketService,
    private authService: AuthService
  ) {
    socketServie
      .onMessageReceive()
      .subscribe((message) => this.OnReceiveMessage(message));
  }

  SendMessage(): void {
    const message = new Message(
      this.messageInput.value,
      this.authService.getUsername()
    );
    console.log(message);
    this.socketServie.emitMessage(message);
    this.messages.push(message);
  }

  OnReceiveMessage(message): void {
    this.messages.push(message);
  }
}
