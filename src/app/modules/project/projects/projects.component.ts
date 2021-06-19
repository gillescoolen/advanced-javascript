import { Component } from '@angular/core';
import { ProjectService } from '../../../core/services/project.service';
import { Observable, of } from 'rxjs';
import { AbstractProject } from '../../../core/types/project.type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects$: Observable<AbstractProject[] | []> = of([]);

  constructor(private readonly router: Router, private readonly projectService: ProjectService, private readonly activatedRoute: ActivatedRoute) {
    this.projects$ = this.projectService.allAbstract(this.activatedRoute.snapshot.data.user);
  }

  showInteract(project: AbstractProject) {
    return this.activatedRoute.snapshot.data.user.uid === project.ownerId;
  }

  async edit(id: string) {
    await this.router.navigate([`/project/${id}/edit`]);
  }

  async view(id: string) {
    await this.router.navigate([`/project/${id}`]);
  }
}
