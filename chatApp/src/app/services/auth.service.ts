import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  private isloggedIn: boolean;

  constructor() {
    this.isloggedIn = false;
  }

  public login(): boolean {
    this.isloggedIn = true;
    return this.isloggedIn;
  }

  isUserLoggedIn(): boolean {
    return this.isloggedIn;
  }
}
