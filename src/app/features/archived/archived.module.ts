import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ArchivedRoutingModule } from './archived-routing.module';
import { SharedComponentsModule } from '../../shared/common/shared-components.module';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { ArchivedProjectsComponent } from './projects/archived-projects.component';

@NgModule({
  declarations: [
    ArchivedProjectsComponent,
  ],
  imports: [
    ArchivedRoutingModule,
    SharedModule.forRoot(),
    SharedComponentsModule.forRoot(),
    NgxAuthFirebaseUIModule
  ]
})
export class ArchivedModule { }
