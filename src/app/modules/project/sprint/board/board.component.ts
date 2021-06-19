import { Component, OnInit } from '@angular/core';
import { UserStoryStatus } from '../../../../core/types/user-story-status.enum';
import { SprintService } from '../../../../core/services/sprint.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../../core/types/member.type';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserService } from '../../../../core/services/user.service';
import { Sprint } from '../../../../core/types/sprint.type';
import { UserStory } from '../../../../core/types/user-story.type';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  members$: Observable<Member[]> = of([]);
  stories$: Observable<UserStory[]> = of([]);
  sprint$: Observable<Sprint[]> = of([]);
  title = '';

  constructor(private readonly sprintService: SprintService, private readonly userService: UserService, private readonly activatedRoute: ActivatedRoute) {
    const projectId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.members$ = sprintService.getUsersAndStories(projectId);
    this.sprint$ = sprintService.active(projectId);
    this.stories$ = sprintService.getStories(projectId);
    this.sprint$.subscribe(sprint => this.title = sprint[0].title);
  }

  ngOnInit(): void {
  }

  getByStatus(status: string, tasks: UserStory[]) {
    return tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  async drop(event: CdkDragDrop<{ status: string, member: Member }>) {
    const task = {
      ...event.item.data,
      status: event.container.data.status,
      assignee: event.container.data.member ? this.userService.getUserRef(event.container.data.member.id) : null
    }

    const id = this.activatedRoute.snapshot.paramMap.get('id') ?? ''
    
    await this.sprintService.updateStory(task, id);
  }

  getStatuses(): string[] {
    return Object.values(UserStoryStatus).filter(s => s !== '');
  }
}
