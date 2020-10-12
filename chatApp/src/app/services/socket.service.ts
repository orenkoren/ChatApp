import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import * as io from 'socket.io-client';

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
    console.log('emitting message', data);
    this.socket.emit(eventName, data);
  }
  onMessageReceive(): Observable<string> {
    return this.subsribeToEvent<string>('message-broadcast');
  }

  emitMessage(data: string): void {
    this.emitEvent<string>('message', data);
  }
}
