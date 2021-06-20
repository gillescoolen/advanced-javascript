import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../shared/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Project } from '../../../shared/types/project.type';
import { Status } from '../../../shared/types/task.enum';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  formGroup = new FormGroup({});
  project$: Observable<Project | undefined> = of();
  statuses = Status;

  private readonly errorMessages = {
    name: {
      required: 'Title is required',
      maxLength: 'The maximum allowed length is 64'
    },
    description: {
      maxLength: 'The maximum allowed length is 192'
    },
    status: {
      maxLength: 'The maximum allowed length is 64'
    }
  };

  constructor(private readonly projectService: ProjectService, private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {
    this.project$ = this.projectService.getProjectById(this.activatedRoute.snapshot.paramMap.get('id') ?? '');
  }

  async edit() {
    if (!this.formGroup.invalid) {
      await this.projectService.updateProject(this.activatedRoute.snapshot.paramMap.get('id') ?? '', this.formGroup.value);
      await this.router.navigate(['/project']);
    }
  }

  ngOnInit(): void {
    this.project$.subscribe(project => {
      if (!project) {
        return;
      }

      this.formGroup = new FormGroup({
        name: new FormControl(project.name, [Validators.required, Validators.maxLength(64)]),
        description: new FormControl(project.description, [Validators.maxLength(192)]),
        status: new FormControl(project.status, [Validators.maxLength(64)]),
        archived: new FormControl(project.archived)
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
