import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Project } from '../../../core/types/project.type';
import { UserStoryStatus } from '../../../core/types/user-story-status.enum';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  formGroup = new FormGroup({});
  project$: Observable<Project | undefined> = of();
  statuses = UserStoryStatus;

  private readonly errorMessages = {
    name: {
      required: 'Title is required!',
      maxLength: 'Title can not exceed 255 characters!'
    },
    description: {
      maxLength: 'Description can not exceed 300 characters!'
    },
    status: {
      maxLength: 'Status can not exceed 30 characters!'
    },
    archived: {
      required: 'Archived is required to be set on either true/false!',
    }
  };

  constructor(private readonly projectService: ProjectService, private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {
    this.project$ = this.projectService.oneById(this.activatedRoute.snapshot.paramMap.get('id') ?? '');
  }

  async edit() {
    if (!this.formGroup.invalid) {
      await this.projectService.update(this.activatedRoute.snapshot.paramMap.get('id') ?? '', this.formGroup.value);
      await this.router.navigate(['/project']);
    }
  }

  ngOnInit(): void {
    this.project$.subscribe(project => {
      if (!project) {
        return;
      }

      this.formGroup = new FormGroup({
        name: new FormControl(project.name, [Validators.required, Validators.maxLength(30)]),
        description: new FormControl(project.description, [Validators.maxLength(300)]),
        status: new FormControl(project.status, [Validators.maxLength(30)]),
        archived: new FormControl(project.archived, [Validators.required])
      });
    });
  }

  getErrorMessage(field: string, error: string): string {
    if (this.formGroup.controls[field].hasError(error)) {
      return this.errorMessages[field][error] ?? '';
    }

    return '';
  }
}