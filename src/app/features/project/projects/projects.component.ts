import { Component } from '@angular/core';
import { ProjectService } from '../../../shared/services/project.service';
import { Observable, of } from 'rxjs';
import { ProjectDto } from '../../../shared/types/project.type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects$: Observable<ProjectDto[] | []> = of([]);

  constructor(
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.projects$ = this.projectService.getProjects(this.activatedRoute.snapshot.data.user, false);
  }

  showInteract(project: ProjectDto) {
    return this.activatedRoute.snapshot.data.user.uid === project.ownerId;
  }

  async edit(id: string) {
    await this.router.navigate([`/project/${id}/edit`]);
  }

  async view(id: string) {
    await this.router.navigate([`/project/${id}`]);
  }
}
