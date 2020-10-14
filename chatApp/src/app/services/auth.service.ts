import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERNAME_KEY = 'username';
  constructor() {}

  public login(username: string): void {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem(this.USERNAME_KEY, username);
  }

  isUserLoggedIn(): boolean {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }
  getUsername(): string {
    return sessionStorage.getItem(this.USERNAME_KEY);
  }
}
