import { Component } from '@angular/core';
import { TaskService } from '../../../../shared/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../../../../shared/types/user';
import { ProjectService } from '../../../../shared/services/project.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskCreateDto } from '../../../../shared/types/task.type';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {
  private readonly id;
  pickAbleMembers$: Observable<(User | undefined)[]> = of([]);
  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(64)]),
    description: new FormControl('', [Validators.maxLength(192)]),
    selectedAssigned: new FormControl(''),
    storyPoints: new FormControl(null, [Validators.min(0), Validators.max(24)]),
    archived: new FormControl(false)
  });

  private readonly errorMessages = {
    title : {
      required: 'Title is required',
      maxLength: 'The maximum allowed length is 64'
    },
    description: {
      maxLength: 'The maximum allowed length is 192'
    },
    storyPoints: {
      min: 'Story points must be between 0 and 24',
      max: 'Story points must be between 0 and 24'
    }
  };

  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.pickAbleMembers$ = this.taskService.getProjectMembers(this.id);
  }

  getErrorMessage(field: string, error: string): string {
    if (this.formGroup.controls[field].hasError(error)) {
      return this.errorMessages[field][error] ?? '';
    }

    return '';
  }

  async create() {
    const form = this.formGroup.value;

    if (!this.formGroup.invalid) {
      const story: TaskCreateDto = {
        title: form.title,
        description: form.description,
        assigned: form.selectedAssigned === '' ? undefined : form.selectedAssigned,
        points: form.storyPoints,
        archived: form.archived
      };

      await this.taskService.create(this.id, story);
      await this.router.navigate([`project/${this.id}`]);
    }
  }
}
