import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { ArchivedProjectsComponent } from './projects/archived-projects.component';
import { UserResolver } from '../../shared/resolvers/user.resolver';

const archivedRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        resolve: { user: UserResolver },
        path: 'project',
        component: ArchivedProjectsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(archivedRoutes)],
  exports: [RouterModule]
})
export class ArchivedRoutingModule { }
