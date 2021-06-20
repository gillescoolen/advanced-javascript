import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CoreModule } from '../../core/core.module';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../core/shared/shared.module';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    AuthRoutingModule,
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    NgxAuthFirebaseUIModule
  ]
})
export class AuthModule { }
