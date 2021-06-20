import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedComponentsModule } from '../../shared/common/shared-components.module';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    AuthRoutingModule,
    SharedModule.forRoot(),
    SharedComponentsModule.forRoot(),
    NgxAuthFirebaseUIModule
  ]
})
export class AuthModule { }
