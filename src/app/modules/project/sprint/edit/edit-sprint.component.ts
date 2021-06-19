import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserStory } from '../../../../core/types/user-story.type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SprintService } from '../../../../core/services/sprint.service';
import { BacklogService } from '../../../../core/services/backlog.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import { Sprint } from '../../../../core/types/sprint.type';

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
      maxLength: 'Title can not exceed 255 characters'
    },
    description: {
      maxLength: 'Description can not exceed 1024 characters'
    },
    start: {
      required: 'A start date is required'
    },
    end: {
      required: 'A end date is required'
    },
    tasks: {
      required: 'You need to select at least one task'
    },
    active: {
      required: 'Archived is required',
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
        startAt: Timestamp.fromDate(moment(values.start).toDate()),
        endAt: Timestamp.fromDate(moment(values.end).toDate()),
        tasks: values.tasks,
        active: values.active
      }, this.id, this.activatedRoute.snapshot.paramMap.get('sprintId') ?? '');

      await this.router.navigate([`project/${this.id}`]);
    }
  }

  ngOnInit(): void {
   this.sprint$.subscribe(sprint => {
      this.formGroup = new FormGroup({
        title: new FormControl(sprint.title, [Validators.required, Validators.maxLength(60)]),
        description: new FormControl(sprint.description, [Validators.maxLength(500)]),
        start: new FormControl(moment(sprint.startAt.toDate()), [Validators.required]),
        end: new FormControl(moment(sprint.endAt.toDate()), [Validators.required]),
        tasks: new FormControl(sprint.tasks.map(t => t.id), [Validators.required]),
        active: new FormControl(sprint.active, [Validators.required])
      });
    });
  }
}
