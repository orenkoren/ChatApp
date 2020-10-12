import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketService } from 'src/app/services/socket.service';

const SOCKET_ENDPOINT = 'localhost:3000';
@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css'],
})
export class ChatInboxComponent {
  socket: any;
  message: any;
  constructor(private socketServie: SocketService) {
    socketServie
      .onMessageReceive()
      .subscribe((message) => this.OnReceiveMessage(message));
  }

  SendMessage(): void {
    this.socketServie.emitMessage(this.message);
    const element = document.createElement('li');
    element.innerHTML = this.message;
    element.style.background = 'gray';
    element.style.padding = '15px 30px';
    element.style.margin = '10px';
    element.style.textAlign = 'right';
    document.getElementById('message-list').appendChild(element);
    this.message = '';
  }

  OnReceiveMessage(message): void {
    const element = document.createElement('li');
    element.innerHTML = message;
    element.style.background = 'gray';
    element.style.padding = '15px 30px';
    element.style.margin = '10px';
    document.getElementById('message-list').appendChild(element);
  }
}
