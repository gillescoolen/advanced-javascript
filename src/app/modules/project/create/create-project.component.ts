import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(64)]),
    description: new FormControl('', [Validators.maxLength(192)]),
    status: new FormControl('', [Validators.maxLength(64)]),
    archived: new FormControl(false)
  });

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
  }

  async create() {
    if (!this.formGroup.invalid) {
      await this.projectService.create(this.activatedRoute.snapshot.data.user, this.formGroup.value);
      await this.router.navigate(['/project']);
    }
  }

  getErrorMessage(field: string, error: string): string {
    if (this.formGroup.controls[field].hasError(error)) {
      return this.errorMessages[field][error] ?? '';
    }

    return '';
  }
}
