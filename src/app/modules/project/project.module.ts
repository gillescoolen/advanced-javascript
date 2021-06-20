import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../core/shared/shared.module';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectRoutingModule } from './project-routing.module';
import { CreateProjectComponent } from './create/create-project.component';
import { SprintComponent } from './sprint/page/sprint.component';
import { FlexModule } from '@angular/flex-layout';
import { EditProjectComponent } from './edit/edit-project.component';
import { BacklogComponent } from './backlog/backlog.component';
import { CreateUserStoryComponent } from './backlog/create-user-story/create-user-story.component';
import { ChartsModule } from 'ng2-charts';
import { CreateSprintComponent } from './sprint/create/create-sprint.component';
import { EditSprintComponent } from './sprint/edit/edit-sprint.component';
import { EditUserStoryComponent } from './backlog/edit-user-story/edit-user-story.component';
import { FormsModule } from '@angular/forms';
import { ArchivedComponent } from './backlog/archived/archived.component';
import { CreateMemberComponent } from './member/create/create-member.component';
import { EditMemberComponent } from './member/edit/edit-member.component';
import { ChartComponent } from './sprint/chart/chart.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    CreateProjectComponent,
    EditProjectComponent,
    CreateProjectComponent,
    SprintComponent,
    BacklogComponent,
    CreateUserStoryComponent,
    CreateSprintComponent,
    EditSprintComponent,
    EditUserStoryComponent,
    ArchivedComponent,
    CreateMemberComponent,
    EditMemberComponent,
    ChartComponent
  ],
  imports: [
    ProjectRoutingModule,
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    FlexModule,
    ChartsModule,
    FormsModule
  ]
})
export class ProjectModule {
}
