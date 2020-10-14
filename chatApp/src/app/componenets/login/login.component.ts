import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  submit(): void {
    this.authService.login(this.username);
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/chat']);
    } else {
      this.router.navigate(['']);
    }
  }
}
