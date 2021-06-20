import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { ProjectService } from './services/project.service';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';
import { OverviewService } from './services/overview.service';
import { MemberService } from './services/member.service';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    AngularFireAuthGuardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebase, () => 'kanban', {
      enableEmailVerification: false,
      guardProtectedRoutesUntilEmailIsVerified: false,
      toastMessageOnAuthSuccess: false,
      toastMessageOnAuthError: false,
      authGuardFallbackURL: '/auth/login',
      authGuardLoggedInURL: 'project'
    })
  ],
  providers: [AuthService, ProjectService, UserService, OverviewService, MemberService],
  exports: [LayoutModule, AngularFireModule, AngularFirestoreModule, AngularFireAuthModule],
  declarations: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        UserResolver
      ]
    };
  }
}
