import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BacklogService } from '../../../../core/services/backlog.service';
import { Observable, of } from 'rxjs';
import { BaseTask } from '../../../../core/types/task.type';

@Component({
  selector: 'app-archived-tasks',
  templateUrl: './archived-tasks.component.html',
  styleUrls: ['./archived-tasks.component.scss']
})
export class ArchivedComponent {
  private readonly id;
  userStories$: Observable<BaseTask[]> = of([]);

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly backlogService: BacklogService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.userStories$ = this.backlogService.getByProjectAbstract(this.id, true);
  }

  async navigateBack() {
    await this.router.navigate([`project/${this.id}`]);
  }

  async navigateEditUserStory(id: string) {
    await this.router.navigate([`project/${this.id}/backlog/${id}/edit`]);
  }
}
