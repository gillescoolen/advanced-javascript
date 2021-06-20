import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../shared/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    description: new FormControl('', [Validators.maxLength(300)]),
    status: new FormControl('', [Validators.maxLength(30)]),
    archived: new FormControl(false, [Validators.required])
  });

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
  }

  async create() {
    if (!this.formGroup.invalid) {
      await this.projectService.createProject(this.activatedRoute.snapshot.data.user, this.formGroup.value);
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
