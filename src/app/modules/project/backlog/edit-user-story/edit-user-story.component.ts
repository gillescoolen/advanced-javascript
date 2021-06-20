import { Component, OnInit } from '@angular/core';
import { BacklogService } from '../../../../core/services/backlog.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { EditableUserStory } from '../../../../core/types/user-story.type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../core/services/user';

@Component({
  selector: 'app-edit-user-story',
  templateUrl: './edit-user-story.component.html',
  styleUrls: ['./edit-user-story.component.scss']
})
export class EditUserStoryComponent implements OnInit {
  private readonly projectId;
  private readonly userStoryId;
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
    }
  };

  userStory$: Observable<EditableUserStory | undefined> = of();
  projectMembers$: Observable<(User | undefined)[]> = of([]);
  formGroup = new FormGroup({});

  constructor(
    private readonly backlogService: BacklogService,
    private readonly projectService: ProjectService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.userStoryId = this.activatedRoute.snapshot.paramMap.get('userStoryId') ?? '';
    this.userStory$ = this.backlogService.getOneWithUserData(this.projectId, this.userStoryId);
    this.projectMembers$ = this.backlogService.getProjectMembers(this.projectId);
  }

  ngOnInit(): void {
    this.userStory$.subscribe(userStory => {
      if (!userStory) {
        return;
      }

      this.formGroup = new FormGroup({
        title: new FormControl(userStory.title, [Validators.required, Validators.maxLength(255)]),
        description: new FormControl(userStory.description, [Validators.maxLength(1024)]),
        selectedAssignee: new FormControl(userStory.assignee == null ? '' : userStory.assignee.uid),
        storyPoints: new FormControl(userStory.storyPoints, [Validators.min(0), Validators.max(24)]),
        archived: new FormControl(userStory.archived)
      });
    });
  }

  getErrorMessage(field: string, error: string): string {
    if (this.formGroup.controls[field].hasError(error)) {
      return this.errorMessages[field][error] ?? '';
    }

    return '';
  }

  async edit() {
    if (!this.formGroup.invalid) {
      const values = this.formGroup.value;
      await this.backlogService.editUserStory(this.projectId, this.userStoryId, {
        title: values.title,
        description: values.description,
        assignee: values.selectedAssignee === '' ? undefined : values.selectedAssignee,
        storyPoints: values.storyPoints,
        archived: values.archived
      });

      await this.router.navigate([`project/${this.projectId}`]);
    }
  }
}
