import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserStory } from '../../../../core/types/user-story.type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SprintService } from '../../../../core/services/sprint.service';
import { BacklogService } from '../../../../core/services/backlog.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import firebase from 'firebase';
import { Sprint } from '../../../../core/types/sprint.type';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-edit-sprint',
  templateUrl: './edit-sprint.component.html',
  styleUrls: ['./edit-sprint.component.scss']
})
export class EditSprintComponent implements OnInit {
  private readonly id;
  pickAbleTasks$: Observable<UserStory[]> = of([]);
  formGroup = new FormGroup({});
  sprint$: Observable<Sprint> = of();

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

  constructor(private readonly sprintService: SprintService, private readonly backlogService: BacklogService, private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.pickAbleTasks$ = backlogService.getByProject(this.id, false, this.activatedRoute.snapshot.paramMap.get('sprintId') ?? '');
    this.sprint$ = sprintService.getOne(this.id, this.activatedRoute.snapshot.paramMap.get('sprintId') ?? '');
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

      await this.sprintService.update({
        title: values.title,
        description: values.description,
        startDate: Timestamp.fromDate(moment(values.start).toDate()),
        endDate: Timestamp.fromDate(moment(values.end).toDate()),
        tasks: values.tasks,
        active: values.active
      }, this.id, this.activatedRoute.snapshot.paramMap.get('sprintId') ?? '');

      await this.router.navigate([`project/${this.id}`]);
    }
  }

  ngOnInit(): void {
   this.sprint$.subscribe(sprint => {
      this.formGroup = new FormGroup({
        title: new FormControl(sprint.title, [Validators.required, Validators.maxLength(64)]),
        description: new FormControl(sprint.description, [Validators.maxLength(192)]),
        start: new FormControl(moment(sprint.startDate.toDate()), [Validators.required]),
        end: new FormControl(moment(sprint.endDate.toDate()), [Validators.required]),
        tasks: new FormControl(sprint.tasks.map(t => t.id), [Validators.required]),
        active: new FormControl(sprint.active)
      });
    });
  }
}
