import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'ngx-auth-firebaseui';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  providers = AuthProvider;

  constructor(public router: Router, public authService: AuthService) { }

  ngOnInit(): void {
  }

  async goToRegisterPage() {
    return this.router.navigate(['/auth/sign-up']);
  }
}
