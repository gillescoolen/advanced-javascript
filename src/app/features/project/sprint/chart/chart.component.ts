import { SprintService } from '../../../../shared/services/sprint.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../../shared/types/member.type';
import { UserService } from '../../../../shared/services/user.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Sprint } from '../../../../shared/types/sprint.type';
import * as moment from 'moment/moment';
import { Component, OnInit } from "@angular/core";
import { Task } from "../../../../shared/types/task.type";
import { Status } from "../../../../shared/types/status.enum";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  statusEnum = Status;
  members$: Observable<Member[]> = of([]);
  tasks$: Observable<Task[]> = of([]);
  sprint$: Observable<Sprint[]> = of([]);
  title = '';

  public showLegend = true;
  public chartType: ChartType = 'line';
  public dataSets: ChartDataSets[] = [];
  public labels: Label[] = [];

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

          if (label) {
            label += ': ';
          }

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

  private startDate: Date;
  private endDate: Date;

  constructor(private readonly sprintService: SprintService, private readonly userService: UserService, private readonly activatedRoute: ActivatedRoute) {
    const projectId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.members$ = sprintService.getUsersAndTasks(projectId);
    this.sprint$ = sprintService.getActiveSprint(projectId);
    this.tasks$ = sprintService.getTasks(projectId);
    this.sprint$.subscribe(sprint => this.title = sprint[0].title);
  }

  ngOnInit(): void {
    this.tasks$.subscribe(tasks => {
      this.dataSets = [];

      const total = tasks.reduce((sum, u) => u.points + sum, 0);
      const estimatedData = [total];
      const actualData = [total];
      const finishedTasks = [];

      for (let i = 0; i < this.labels.length - 1; ++i) {
        estimatedData.push(i + 1 === this.labels.length - 1 ? 0 : estimatedData[i] - total / (this.labels.length - 1));
      }

      this.getRange(this.startDate, this.endDate, 'days').forEach(d => {
        const currTasks = tasks.filter(s => {
          if (!s || s.status !== Status.DONE) return;

          const taskDate = moment(s.updatedAt.toDate());
          if (taskDate.isSame(d, 'day')) {
            return s;
          }
        });

        const totalPoints = currTasks.reduce((sum, u) => u.points + sum, 0);
        if (d.isBefore(moment())) {
          if (total - totalPoints < total) {
            actualData.push(actualData[actualData.length - 1] - totalPoints);
          } else {
            actualData.push(total > actualData[actualData.length - 1] ? actualData[actualData.length - 1] : total);
          }
        }

        finishedTasks.push(currTasks.length);
      });

      this.dataSets.push({ data: estimatedData, label: 'Estimated Effort', borderDash: [5, 5] });
      this.dataSets.push({ data: actualData, label: 'Actual Effort', lineTension: 0.0 });
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
    let fromDate = moment(startDate)
    let toDate = moment(endDate)
    let diff = toDate.diff(fromDate, type)
    let range = []

    for (let i = 0; i <= diff; i++) range.push(moment(startDate).add(i, type))

    return range;
  }
}
