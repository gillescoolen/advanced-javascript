import { Component, OnInit } from '@angular/core';
import { Status } from '../../../../shared/types/status.enum';
import { SprintService } from '../../../../shared/services/sprint.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../../shared/types/member.type';
import { UserService } from '../../../../shared/services/user.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Sprint } from '../../../../shared/types/sprint.type';
import * as moment from 'moment/moment';
import { Task } from '../../../../shared/types/task.type';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  status = Status;
  members$: Observable<Member[]> = of([]);
  tasks$: Observable<Task[]> = of([]);
  sprint$: Observable<Sprint[]> = of([]);
  title = '';

  public showLegend = true;
  public chartType: ChartType = 'line';
  public dataSets: ChartDataSets[] = [];
  public labels: Label[] = [];

  private startDate: Date;
  private endDate: Date;
  
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
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label || '';

          if (label) label += ': ';

          label += +(Math.round(Number(Number(tooltipItem.yLabel) + "e+" + 1)) + "e-" + 1);

          return label + 'sp';
        }
      }
    }
  };

  public lineChartColors: Color[] = [
    {
      backgroundColor: '#00000000',
      borderColor: '#4D5360FF',
      pointBackgroundColor: '#00000000',
      pointBorderColor: '#00000000',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#949FB1CC'
    },
    {
      backgroundColor: '#00000000',
      borderColor: '#3F51B5FF',
      pointBackgroundColor: '#949FB1',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#949FB1CC'
    },
    {
      backgroundColor: '#00000000',
      borderColor: '#27D507FF',
      pointBackgroundColor: '#949FB1',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#949FB1CC'
    }
  ];

  constructor(
    private readonly sprintService: SprintService,
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    const projectId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.members$ = sprintService.getUsersAndTasks(projectId);
    this.sprint$ = sprintService.getActiveSprint(projectId);
    this.tasks$ = sprintService.getTasks(projectId);
    this.sprint$.subscribe(sprint => this.title = sprint[0].title);
  }

  ngOnInit(): void {
    this.tasks$.subscribe(tasks => {
      this.dataSets = [];

      const totalAmount = tasks.reduce((sum, u) => u.points + sum, 0);
      const estimated = [totalAmount];
      const actual = [totalAmount];
      const finishedTasks = [];

      for (let i = 0; i < this.labels.length - 1; ++i) 
        estimated
          .push(i + 1 === this.labels.length - 1 ? 0 : estimated[i] - totalAmount / (this.labels.length - 1));

      this.getRange(this.startDate, this.endDate, 'days').forEach(date => {
        const currentTasks = tasks.filter(task => {
          if (!task || task.status !== this.status.DONE) return;

          const date = moment(task.updatedAt.toDate());

          if (date.isSame(date, 'day')) return task;
        });

        const totalPoints = currentTasks.reduce((sum, task) => task.points + sum, 0);

        if (date.isBefore(moment())) {
          totalAmount - totalPoints < totalAmount
            ? actual.push(actual[actual.length - 1] - totalPoints)
            : actual.push(totalAmount > actual[actual.length - 1] ? actual[actual.length - 1] : totalAmount);
        }

        finishedTasks.push(currentTasks.length);
      });

      this.dataSets.push({ data: estimated, label: 'Estimated Effort', borderDash: [5, 5] });
      this.dataSets.push({ data: actual, label: 'Actual Effort', lineTension: 0.0 });
      this.dataSets.push({ data: finishedTasks, label: 'Finished Tasks', lineTension: 0.0 });
    });

    this.sprint$.subscribe(sprint => {
      this.labels = [];
      this.startDate = sprint[0].startDate.toDate();
      this.endDate = sprint[0].endDate.toDate();

      this.getRange(this.startDate, this.endDate, 'days').forEach(d => {
        this.labels.push(d.format('MMMM Do'));
      });
    });
  }

  getRange(startDate, endDate, type): moment.Moment[] {
    const fromDate = moment(startDate)
    const toDate = moment(endDate)
    const diff = toDate.diff(fromDate, type)
    const range = []

    for (let i = 0; i <= diff; i++) range.push(moment(startDate).add(i, type))
    
    return range;
  }
}