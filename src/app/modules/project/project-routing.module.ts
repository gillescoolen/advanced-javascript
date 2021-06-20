import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../core/layout/layout.component';
import { ProjectsComponent } from './projects/projects.component';
import { CreateProjectComponent } from './create/create-project.component';
import { EditProjectComponent } from './edit/edit-project.component';
import { SprintComponent } from './sprint/page/sprint.component';
import { BacklogComponent } from './backlog/backlog.component';
import { CreateTaskComponent } from './backlog/create-user-story/create-user-story.component';
import { CreateSprintComponent } from './sprint/create/create-sprint.component';
import { EditSprintComponent } from './sprint/edit/edit-sprint.component';
import { EditUserStoryComponent } from './backlog/edit-user-story/edit-user-story.component';
import { ArchivedComponent } from './backlog/archived/archived.component';
import { CreateMemberComponent } from './member/create/create-member.component';
import { EditMemberComponent } from './member/edit/edit-member.component';
import { UserResolver } from '../../core/resolvers/user.resolver';

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
        component: BacklogComponent
      },
      {
        path: ':id/backlog/archived',
        component: ArchivedComponent
      },
      {
        path: ':id/backlog/create',
        component: CreateTaskComponent
      },
      {
        path: ':id/backlog/:userStoryId/edit',
        component: EditUserStoryComponent
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
