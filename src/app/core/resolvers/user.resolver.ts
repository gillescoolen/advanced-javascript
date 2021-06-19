import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user';

@Injectable()
export class UserResolver implements Resolve<any> {
  constructor(private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<User | undefined> {
    return this.authService.getCurrentUser();
  }
}
