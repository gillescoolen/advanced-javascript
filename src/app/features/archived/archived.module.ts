import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { ArchivedRoutingModule } from './archived-routing.module';
import { SharedModule } from '../../core/common/shared.module';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { ArchivedProjectsComponent } from './projects/archived-projects.component';

@NgModule({
  declarations: [
    ArchivedProjectsComponent,
  ],
  imports: [
    ArchivedRoutingModule,
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    NgxAuthFirebaseUIModule
  ]
})
export class ArchivedModule { }
