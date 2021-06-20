import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { ProjectsComponent } from './projects/projects.component';
import { CreateProjectComponent } from './create/create-project.component';
import { EditProjectComponent } from './edit/edit-project.component';
import { SprintComponent } from './sprint/page/sprint.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateTaskComponent } from './overview/create-task/create-task.component';
import { CreateSprintComponent } from './sprint/create/create-sprint.component';
import { EditSprintComponent } from './sprint/edit/edit-sprint.component';
import { EditTaskComponent } from './overview/edit-task/edit-task.component';
import { ArchivedComponent } from './overview/archived-tasks/archived-tasks.component';
import { CreateMemberComponent } from './member/create/create-member.component';
import { EditMemberComponent } from './member/edit/edit-member.component';
import { UserResolver } from '../../shared/resolvers/user.resolver';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ProjectsComponent
      },
      {
        path: 'create',
        component: CreateProjectComponent,
        resolve: { user: UserResolver }
      },
      {
        path: ':id/edit',
        component: EditProjectComponent
      },
      {
        path: ':id/member/add',
        component: CreateMemberComponent
      },
      {
        path: ':id/member/edit/:userId',
        component: EditMemberComponent
      },
      {
        path: ':id/sprint',
        component: SprintComponent
      },
      {
        path: ':id/sprint/create',
        component: CreateSprintComponent
      },
      {
        path: ':id/sprint/edit/:sprintId',
        component: EditSprintComponent
      },
      {
        path: ':id',
        component: OverviewComponent
      },
      {
        path: ':id/overview/archived',
        component: ArchivedComponent
      },
      {
        path: ':id/overview/create',
        component: CreateTaskComponent
      },
      {
        path: ':id/overview/:taskId/edit',
        component: EditTaskComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
