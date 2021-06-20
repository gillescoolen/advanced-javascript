import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProjectDto } from '../../../shared/types/project.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../shared/services/project.service';

@Component({
  selector: 'app-archived-projects',
  templateUrl: './archived-projects.component.html',
  styleUrls: ['./archived-projects.component.scss']
})
export class ArchivedProjectsComponent {
  projects$: Observable<ProjectDto[]> = of([]);

  constructor(private readonly router: Router, private readonly projectService: ProjectService, private readonly activatedRoute: ActivatedRoute) {
    this.projects$ = this.projectService.getProjects(this.activatedRoute.snapshot.data.user, true);
  }

  async edit(id: string) {
    await this.router.navigate([`/project/${id}/edit`]);
  }
}
