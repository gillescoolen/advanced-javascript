import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewService } from '../../../core/services/overview.service';
import { BaseTask } from '../../../core/types/task.type';
import { AbstractSprint } from '../../../core/types/sprint.type';
import { SprintService } from '../../../core/services/sprint.service';
import { MemberService } from '../../../core/services/member.service';
import { AbstractMember } from '../../../core/types/member.type';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class BacklogComponent {
  userStories$: Observable<BaseTask[]> = of([]);
  sprints$: Observable<AbstractSprint[]> = of([]);
  members$: Observable<AbstractMember[]> = of([]);
  activeSprint = false;

  private readonly id: string;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly backlogService: OverviewService,
    private readonly sprintService: SprintService,
    private readonly memberService: MemberService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.userStories$ = this.backlogService.getByProjectAbstract(this.id);
    this.sprints$ = this.sprintService.getAll(this.id);
    this.members$ = this.memberService.allAbstractFromProject(this.id);
    this.sprints$.subscribe(sprints => this.activeSprint = !sprints.find(s => s.active));
  }

  async navigateToCreate() {
    await this.router.navigate([`project/${this.id}/backlog/create`]);
  }

  async navigateToMember() {
    await this.router.navigate([`project/${this.id}/member/add`]);
  }

  async navigateToEditMember(id: string) {
    await this.router.navigate([`project/${this.id}/member/edit/${id}`]);
  }

  async navigateToSprint() {
    await this.router.navigate([`project/${this.id}/sprint`]);
  }

  async navigateCreateSprint() {
    await this.router.navigate([`project/${this.id}/sprint/create`]);
  }

  async navigateEditSprint(id: string) {
    await this.router.navigate([`project/${this.id}/sprint/edit/${id}`]);
  }

  async navigateEditUserStory(id: string) {
    await this.router.navigate([`project/${this.id}/backlog/${id}/edit`]);
  }

  async navigateToArchivedUserStories() {
    await this.router.navigate([`project/${this.id}/backlog/archived`]);
  }
}
