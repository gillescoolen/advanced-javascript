import { Component } from '@angular/core';
import { BacklogService } from '../../../../core/services/backlog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../../../../core/services/user';
import { ProjectService } from '../../../../core/services/project.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserStoryCreateDTO } from '../../../../core/types/user-story.type';

@Component({
  selector: 'app-create-user-story',
  templateUrl: './create-user-story.component.html',
  styleUrls: ['./create-user-story.component.scss']
})
export class CreateUserStoryComponent {
  private readonly id;
  pickAbleMembers$: Observable<(User | undefined)[]> = of([]);
  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(64)]),
    description: new FormControl('', [Validators.maxLength(192)]),
    selectedAssignee: new FormControl(''),
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
    private readonly backlogService: BacklogService,
    private readonly projectService: ProjectService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.pickAbleMembers$ = this.backlogService.getProjectMembers(this.id);
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
      const story: UserStoryCreateDTO = {
        title: form.title,
        description: form.description,
        assignee: form.selectedAssignee === '' ? undefined : form.selectedAssignee,
        storyPoints: form.storyPoints,
        archived: form.archived
      };

      await this.backlogService.create(this.id, story);
      await this.router.navigate([`project/${this.id}`]);
    }
  }
}
