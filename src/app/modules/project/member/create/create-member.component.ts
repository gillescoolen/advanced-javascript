import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../../../../core/services/user';
import { Role } from '../../../../core/types/role.enum';
import { ProjectService } from '../../../../core/services/project.service';
import { MemberService } from '../../../../core/services/member.service';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.scss']
})
export class CreateMemberComponent {
  private readonly id;
  users$: Observable<User[]> = of([]);
  formGroup = new FormGroup({
    user: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  });

  private readonly errorMessages = {
    user: {
      required: 'Title is required'
    },
    role: {
      required: 'Role is required'
    }
  };

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly projectService: ProjectService,
    private readonly memberService: MemberService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.users$ = this.projectService.allAvailableUsers(this.id);
  }

  getErrorMessage(field: string, error: string): string {
    if (this.formGroup.controls[field].hasError(error)) {
      return this.errorMessages[field][error] ?? '';
    }

    return '';
  }

  getRoles(): string[] {
    return Object.values(Role);
  }

  async add() {
    if (!this.formGroup.invalid) {
      const form = this.formGroup.value;
      await this.memberService.addToProject(this.id, form.user, form.role);
      await this.router.navigate([`/project/${this.id}`]);
    }
  }
}
