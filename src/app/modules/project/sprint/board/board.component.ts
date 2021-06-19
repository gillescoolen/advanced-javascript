import { Component, OnInit } from '@angular/core';
import { UserStoryStatus } from '../../../../core/types/user-story-status.enum';
import { SprintService } from '../../../../core/services/sprint.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../../core/types/member.type';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserService } from '../../../../core/services/user.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Sprint } from '../../../../core/types/sprint.type';
import * as moment from 'moment/moment';
import { UserStory } from '../../../../core/types/user-story.type';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  statusEnum = UserStoryStatus;
  members$: Observable<Member[]> = of([]);
  stories$: Observable<UserStory[]> = of([]);
  sprint$: Observable<Sprint[]> = of([]);
  title = '';

  public chartDataSets: ChartDataSets[] = [];
  public chartLabels: Label[] = [];
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            stepSize: 1
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  constructor(private readonly sprintService: SprintService, private readonly userService: UserService, private readonly activatedRoute: ActivatedRoute) {
    const projectId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.members$ = sprintService.getUsersAndStories(projectId);
    this.sprint$ = sprintService.active(projectId);
    this.stories$ = sprintService.getStories(projectId);
    this.sprint$.subscribe(s => this.title = s[0].title);
  }

  ngOnInit(): void {
    this.stories$.subscribe(stories => {
      this.chartDataSets = [];

      const total = stories.reduce((a, b) => b.storyPoints + a, 0);
      const data = [total];
      const storyData = [total];

      for (let i = 0; i < this.chartLabels.length - 1; ++i) {
        data.push(i + 1 === this.chartLabels.length - 1 ? 0 : data[i] - total / (this.chartLabels.length - 1));
      }

      for (const label of this.chartLabels) {
        const date = moment(label);
        const currentStories = stories.filter(s => {

          if (!s || s.status !== 'Done') {
            return;
          }

          const storyDate = moment(s.updatedAt.toDate());

          if (storyDate.isSame(date, 'day')) {
            return s;
          }
        });

        const totalPoints = currentStories.reduce((a, b) => b.storyPoints + a, 0);

        if (date.isBefore(moment())) {
          if (total - totalPoints < total) {
            storyData.push(storyData[storyData.length - 1] - totalPoints);
          } else {
            storyData.push(total > storyData[storyData.length - 1] ? storyData[storyData.length - 1] : total);
          }
        }
      }

      this.chartDataSets.push({ data, label: 'Time' });
      this.chartDataSets.push({ data: storyData, label: 'Progress', lineTension: 0.0 });
    });

    this.sprint$.subscribe(sprint => {
      this.chartLabels = [];

      for (const m = moment(sprint[0].startDate.toDate()); m.isBefore(moment(sprint[0].endDate.toDate())); m.add(1, 'days')) {
        this.chartLabels.push(m.format('MMMM Do'));
      }
    });
  }

  getByStatus(status: string, tasks: UserStory[]) {
    return tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  async drop(event: CdkDragDrop<{ status: string, member: Member }>) {
    await this.sprintService.updateStory({
      ...event.item.data,
      status: event.container.data.status,
      assignee: event.container.data.member ? this.userService.getUserRef(event.container.data.member.id) : null
    }, this.activatedRoute.snapshot.paramMap.get('id') ?? '');
  }

  getStatuses(): string[] {
    return Object.values(UserStoryStatus).filter(s => s !== '');
  }
}
