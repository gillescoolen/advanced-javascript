import { Component, OnInit } from '@angular/core';
import { Status } from '../../../../shared/types/task.enum';
import { SprintService } from '../../../../shared/services/sprint.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../../shared/types/member.type';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserService } from '../../../../shared/services/user.service';
import { Sprint } from '../../../../shared/types/sprint.type';
import { Task } from '../../../../shared/types/task.type';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {
  members$: Observable<Member[]> = of([]);
  tasks$: Observable<Task[]> = of([]);
  sprint$: Observable<Sprint[]> = of([]);
  title = '';
  description = '';

  constructor(private readonly sprintService: SprintService, private readonly userService: UserService, private readonly activatedRoute: ActivatedRoute) {
    const projectId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.members$ = sprintService.getUsersAndTasks(projectId);
    this.sprint$ = sprintService.getActiveSprint(projectId);
    this.tasks$ = sprintService.getTasks(projectId);
    this.sprint$.subscribe(sprint => this.title = sprint[0].title);
    this.sprint$.subscribe(sprint => this.description = sprint[0].description);
  }

  ngOnInit(): void {
  }

  getTasksByStatus(status: string, tasks: Task[]) {
    return tasks.filter(task => task.status.toLowerCase() === status.toLowerCase());
  }

  async drop(event: CdkDragDrop<{ status: string, member: Member }>) {
    const task = {
      ...event.item.data,
      status: event.container.data.status,
      assigned: event.container.data.member ? this.userService.getRef(event.container.data.member.id) : null
    }

    const id = this.activatedRoute.snapshot.paramMap.get('id') ?? ''
    
    await this.sprintService.updateStory(task, id);
  }

  getStatuses(): string[] {
    return Object.values(Status).filter(s => s !== '');
  }
}
