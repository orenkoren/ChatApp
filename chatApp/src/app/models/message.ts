import { DatePipe } from '@angular/common';

export class Message {
  private content: string;
  private timestamp: string;
  private sender: string;

  constructor(content: string, sender: string) {
    this.content = content;
    this.sender = sender;
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
}
