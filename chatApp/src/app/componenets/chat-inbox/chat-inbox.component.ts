import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css'],
})
export class ChatInboxComponent implements AfterViewInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  socket: any;
  messageInput = new FormControl('', [Validators.required]);
  messages: Message[] = [];
  userTypingList = new Set<string>();
  canSendTyping = true;
  typingTimer: ReturnType<typeof setTimeout>;

  @HostListener('window:beforeunload')
  updateMessages(): void {
    sessionStorage.setItem('messages', JSON.stringify(this.messages));
  }

  constructor(
    private socketServie: SocketService,
    private authService: AuthService
  ) {
    this.InitializeMessages();
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

  private InitializeMessages(): void {
    if (JSON.parse(sessionStorage.getItem('messages'))) {
      const jsonArray = JSON.parse(sessionStorage.getItem('messages'));
      jsonArray.forEach((element) => {
        this.messages.push(Message.fromObject(element));
      });
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
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
    setTimeout(() => this.scrollToBottom(), 100);
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
    console.log(message);
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

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
