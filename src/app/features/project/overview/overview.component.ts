import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../shared/services/task.service';
import { BaseTask } from '../../../shared/types/task.type';
import { SprintDto } from '../../../shared/types/sprint.type';
import { SprintService } from '../../../shared/services/sprint.service';
import { MemberService } from '../../../shared/services/member.service';
import { MemberDto } from '../../../shared/types/member.type';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  tasks$: Observable<BaseTask[]> = of([]);
  sprints$: Observable<SprintDto[]> = of([]);
  members$: Observable<MemberDto[]> = of([]);
  activeSprint = false;

  private readonly id: string;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly taskService:TaskService,
    private readonly sprintService: SprintService,
    private readonly memberService: MemberService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.tasks$ = this.taskService.getTasksByProject(this.id);
    this.sprints$ = this.sprintService.getAllSprints(this.id);
    this.members$ = this.memberService.getByProject(this.id);
    this.sprints$.subscribe(sprints => this.activeSprint = !sprints.find(s => s.active));
  }

  async navigateToCreate() {
    await this.router.navigate([`project/${this.id}/overview/create`]);
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

  async navigateEditTask(id: string) {
    await this.router.navigate([`project/${this.id}/overview/${id}/edit`]);
  }

  async navigateToArchivedTasks() {
    await this.router.navigate([`project/${this.id}/overview/archived`]);
  }
}
