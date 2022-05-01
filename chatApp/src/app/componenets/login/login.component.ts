import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as introJs from 'intro.js/intro.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.pattern(new RegExp(`\\S`)),
  ]);

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    introJs().start();
  }

  submit(): void {
    const usernameTrimmed = this.username.value;
    console.log(this.username.invalid);
    console.log(this.username.errors);
    usernameTrimmed.replace('/s+$/', '');
    this.authService.login(usernameTrimmed);
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/chat']);
    } else {
      this.router.navigate(['']);
    }
  }
}
