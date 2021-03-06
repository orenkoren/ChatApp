import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import * as io from 'socket.io-client';
import { Message } from '../models/message';

const SOCKET_ENDPOINT = 'localhost:3000';

@Injectable({ providedIn: 'root' })
export class SocketService {
  socket: any;

  constructor() {
    this.socket = io(SOCKET_ENDPOINT);
  }

  private subsribeToEvent<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: T) => {
        subscriber.next(data);
      });
    });
  }

  private emitEvent<T>(eventName: string, data?: T): void {
    console.log(data);
    this.socket.emit(eventName, data);
  }
  onMessageReceive(): Observable<string> {
    return this.subsribeToEvent<string>('message-broadcast');
  }

  onUserTyping(): Observable<string> {
    return this.subsribeToEvent<string>('typing-broadcast');
  }
  onMessageRead(): Observable<string> {
    return this.subsribeToEvent<string>('message-read-broadcast');
  }

  onUserStoppedTyping(): Observable<string> {
    return this.subsribeToEvent<string>('typing-stopped-broadcast');
  }

  emitMessage(data: Message): void {
    this.emitEvent<Message>('message', data);
  }

  emitMessageRead(): void {
    this.emitEvent('message-read');
  }

  emitUserTyping(data: string): void {
    this.emitEvent<string>('user-typing', data);
  }

  emitUserStopTyping(data: string): void {
    this.emitEvent<string>('user-stopped-typing', data);
  }
}
