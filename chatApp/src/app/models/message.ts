import { DatePipe } from '@angular/common';

export class Message {
  private content: string;
  private timestamp: string;
  private read: boolean;
  private sender: string;

  constructor(content: string, sender: string, read: boolean = false) {
    this.content = content;
    this.sender = sender;
    this.read = read;
    this.timestamp = new Date().toLocaleDateString('en-GB', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
    });
  }
  get Content(): string {
    return this.content;
  }
  get Timestamp(): string {
    return this.timestamp;
  }
  get Sender(): string {
    return this.sender;
  }
  get Read(): boolean {
    return this.read;
  }
  set Read(read: boolean) {
    this.read = read;
  }
}
