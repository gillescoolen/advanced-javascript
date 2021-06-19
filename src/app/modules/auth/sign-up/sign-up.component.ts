import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { AuthProvider } from 'ngx-auth-firebaseui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

}
