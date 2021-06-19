import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SprintService } from '../../../../core/services/sprint.service';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { UserStory } from '../../../../core/types/user-story.type';
import { BacklogService } from '../../../../core/services/backlog.service';

@Component({
  selector: 'app-create',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.scss']
})
export class CreateSprintComponent {
  private readonly id;
  pickAbleTasks$: Observable<UserStory[]> = of([]);
  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(60)]),
    description: new FormControl('', [Validators.maxLength(500)]),
    endAt: new FormControl('', [Validators.required]),
    startAt: new FormControl('', [Validators.required]),
    tasks: new FormControl('', [Validators.required]),
    active: new FormControl(false, [Validators.required])
  });

  private readonly errorMessages = {
    title : {
      required: 'Title is required!',
      maxLength: 'Title can not exceed 255 characters!'
    },
    description: {
      maxLength: 'Description can not exceed 1024 characters!'
    },
    startAt: {
      required: 'A start date is required'
    },
    endAt: {
      required: 'A end date is required'
    },
    active: {
      required: 'Archived is required to be set on either true/false!',
    }
  };

  constructor(private readonly sprintService: SprintService, private readonly backlogService: BacklogService, private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.pickAbleTasks$ = backlogService.getByProject(this.id);
  }

  getErrorMessage(field: string, error: string): string {
    if (this.formGroup.controls[field].hasError(error)) {
      return this.errorMessages[field][error] ?? '';
    }

    return '';
  }

  async create() {
    if (!this.formGroup.invalid) {
      const values = this.formGroup.value;
      const startAt = Timestamp.fromDate(moment(values.startAt).toDate());
      const endAt = values.endAt ? Timestamp.fromDate(moment(values.endAt).toDate()) : null;

      if (endAt && !moment(values.endAt).isAfter(startAt.toDate())) {
        return;
      }

      await this.sprintService.create({
        title: values.title,
        description: values.description,
        startAt,
        endAt,
        active: values.active,
        tasks: values.tasks,
      }, this.id);

      await this.router.navigate([`project/${this.id}`]);
    }
  }
}
