import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewService } from '../../../../shared/services/overview.service';
import { Observable, of } from 'rxjs';
import { BaseTask } from '../../../../shared/types/task.type';

@Component({
  selector: 'app-archived-tasks',
  templateUrl: './archived-tasks.component.html',
  styleUrls: ['./archived-tasks.component.scss']
})
export class ArchivedComponent {
  private readonly id;
  tasks$: Observable<BaseTask[]> = of([]);

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly backlogService: OverviewService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.tasks$ = this.backlogService.getTasksByProject(this.id, true);
  }

  async navigateBack() {
    await this.router.navigate([`project/${this.id}`]);
  }

  async navigateEditTask(id: string) {
    await this.router.navigate([`project/${this.id}/backlog/${id}/edit`]);
  }
}
