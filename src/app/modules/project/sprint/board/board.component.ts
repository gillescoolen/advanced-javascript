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

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public chartDataSets: ChartDataSets[] = [];
  public chartLabels: Label[] = [];
  private startDate: Date;
  private endDate: Date;
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
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

      const total = stories.reduce((sum, u) => u.storyPoints + sum, 0);
      const estimatedData = [total];
      const actualData = [total];

      for (let i = 0; i < this.chartLabels.length - 1; ++i) {
        estimatedData.push(i + 1 === this.chartLabels.length - 1 ? 0 : estimatedData[i] - total / (this.chartLabels.length - 1));
      }

      this.getRange(this.startDate, this.endDate, 'days').forEach(d => {
        const currentStories = stories.filter(s => {
          if (!s || s.status !== 'Done') return;

          const storyDate = moment(s.updatedAt.toDate());
          if (storyDate.isSame(d, 'day')) {
            return s;
          }
        });

        const totalPoints = currentStories.reduce((sum, u) => u.storyPoints + sum, 0);
        if (d.isBefore(moment())) {
          if (total - totalPoints < total) {
            actualData.push(actualData[actualData.length - 1] - totalPoints);
          } else {
            actualData.push(total > actualData[actualData.length - 1] ? actualData[actualData.length - 1] : total);
          }
        }
      });

      this.chartDataSets.push({ data: estimatedData, label: 'Estimated Effort' });
      this.chartDataSets.push({ data: actualData, label: 'Actual Effort', lineTension: 0.0 });
    });

    this.sprint$.subscribe(sprint => {
      this.chartLabels = [];
      this.startDate = sprint[0].startDate.toDate();
      this.endDate = sprint[0].endDate.toDate();

      this.getRange(this.startDate, this.endDate, 'days').forEach(d => {
        this.chartLabels.push(d.format('MMMM Do'));
      });
    });
  }

  getRange(startDate, endDate, type): moment.Moment[] {
    let fromDate = moment(startDate)
    let toDate = moment(endDate)
    let diff = toDate.diff(fromDate, type)
    let range = []
    for (let i = 0; i <= diff; i++) {
      range.push(moment(startDate).add(i, type))
    }
    return range;
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
