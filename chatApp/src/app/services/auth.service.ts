import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  constructor() {}

  public login(): void {
    sessionStorage.setItem('isLoggedIn', 'true');
  }

  isUserLoggedIn(): boolean {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }
}