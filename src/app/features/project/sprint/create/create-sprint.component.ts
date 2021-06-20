import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SprintService } from '../../../../shared/services/sprint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Task } from '../../../../shared/types/task.type';
import { OverviewService } from '../../../../shared/services/overview.service';
import * as moment from "moment";
import firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-create',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.scss']
})
export class CreateSprintComponent {
  private readonly id;
  pickAbleTasks$: Observable<Task[]> = of([]);
  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(64)]),
    description: new FormControl('', [Validators.maxLength(192)]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    tasks: new FormControl('', [Validators.required]),
    active: new FormControl(false)
  });

  private readonly errorMessages = {
    title : {
      required: 'Title is required',
      maxLength: 'The maximum allowed length is 64'
    },
    description: {
      maxLength: 'The maximum allowed length is 192'
    },
    start: {
      required: 'Start date is required'
    },
    end: {
      required: 'End date is required'
    },
    tasks: {
      required: 'You need to select at least one task'
    }
  };

  constructor(private readonly sprintService: SprintService, private readonly overviewService: OverviewService, private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.pickAbleTasks$ = overviewService.getByProject(this.id);
  }

  getErrorMessage(field: string, error: string): string {
    if (this.formGroup.get(field).hasError(error)) {
      return this.errorMessages[field][error] ?? '';
    }

    return '';
  }

  async create() {
    if (!this.formGroup.invalid) {
      const values = this.formGroup.value;

      await this.sprintService.createSprint({
        title: values.title,
        description: values.description,
        startDate: Timestamp.fromDate(moment(values.start).toDate()),
        endDate: Timestamp.fromDate(moment(values.end).toDate()),
        active: values.active,
        tasks: values.tasks,
      }, this.id);

      await this.router.navigate([`project/${this.id}`]);
    }
  }
}
