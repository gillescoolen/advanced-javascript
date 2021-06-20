import { Component, OnInit } from '@angular/core';
import { OverviewService } from '../../../../core/services/overview.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TaskFormDto } from '../../../../core/types/task.type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../core/types/user';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  private readonly projectId;
  private readonly taskId;
  private readonly errorMessages = {
    title : {
      required: 'Title is required!',
      maxLength: 'Title can not exceed 255 characters!'
    },
    description: {
      maxLength: 'Description can not exceed 1024 characters!'
    },
    storyPoints: {
      min: 'Story points can not have a value lower than 0!',
      max: 'Story points can not have a value higher than 24!'
    },
    archived: {
      required: 'Archived is required to be set on either true/false!',
    }
  };

  task$: Observable<TaskFormDto | undefined> = of();
  projectMembers$: Observable<(User | undefined)[]> = of([]);
  formGroup = new FormGroup({});

  constructor(
    private readonly backlogService: OverviewService,
    private readonly projectService: ProjectService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.taskId = this.activatedRoute.snapshot.paramMap.get('taskId') ?? '';
    this.task$ = this.backlogService.getOneWithUserData(this.projectId, this.taskId);
    this.projectMembers$ = this.backlogService.getProjectMembers(this.projectId);
  }

  ngOnInit(): void {
    this.task$.subscribe(task => {
      if (!task) return;

      this.formGroup = new FormGroup({
        title: new FormControl(task.title, [Validators.required, Validators.maxLength(255)]),
        description: new FormControl(task.description, [Validators.maxLength(1024)]),
        selectedAssigned: new FormControl(task.assigned == null ? '' : task.assigned.uid),
        storyPoints: new FormControl(task.points, [Validators.min(0), Validators.max(24)]),
        archived: new FormControl(task.archived, [Validators.required])
      });
    });
  }

  getErrorMessage(field: string, error: string): string {
    if (this.formGroup.controls[field].hasError(error))
      return this.errorMessages[field][error] ?? '';

    return '';
  }

  async edit() {
    if (!this.formGroup.invalid) {
      const values = this.formGroup.value;

      const task = {
        title: values.title,
        description: values.description,
        assigned: values.selectedAssigned === ''
          ? undefined
          : values.selectedAssigned,
        points: values.storyPoints,
        archived: values.archived
      }

      await this.backlogService.editTask(this.projectId, this.taskId, task);
      await this.router.navigate([`project/${this.projectId}`]);
    }
  }
}
