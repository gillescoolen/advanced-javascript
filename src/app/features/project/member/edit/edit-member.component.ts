import { Component } from '@angular/core';
import { Role } from '../../../../shared/types/role.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../../../shared/services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../../../shared/types/user';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss']
})
export class EditMemberComponent {
  private readonly id;
  private readonly userId;
  user$: Observable<User> = of();
  displayName = '';
  formGroup = new FormGroup({
    role: new FormControl('', [Validators.required])
  });

  private readonly errorMessages = {
    role: {
      required: 'Role is required'
    }
  };

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly userService: UserService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId') ?? '';
    this.user$ = this.userService.getUserById(this.userId);
    this.user$.subscribe(u => this.displayName = u.displayName);
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

  async update() {
    if (!this.formGroup.invalid) {
      const form = this.formGroup.value;
      await this.memberService.updateInProject(this.id, this.userId, form.role);
      await this.router.navigate([`/project/${this.id}`]);
    }
  }
}
