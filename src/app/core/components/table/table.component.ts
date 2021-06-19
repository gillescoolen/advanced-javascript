import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements AfterContentInit {
  @Input() data$: Observable<T[]> = of([]);
  @Input() hiddenColumns: string[] = [];
  @Output() deleteEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Input() showActions: (data: T) => boolean = this.show;
  @Output() viewEvent = new EventEmitter();

  columns: string[] = [];
  private dataSource: MatTableDataSource<T> | null = null;

  @ViewChild(MatSort)
  private sort: MatSort | null = null;

  @ViewChild(MatPaginator)
  private paginator: MatPaginator | null = null;

  show(data: T) {
    return true;
  }

  ngAfterContentInit() {
    this.data$.subscribe(data => {
      this.columns = data.length === 0 ? [] : Object.getOwnPropertyNames(data[0]);
      this.columns = this.columns.filter(value => !this.hiddenColumns.includes(value));
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  get source() {
    return this.dataSource ? this.dataSource : [];
  }

  get hasDeleteEvent() {
    return this.deleteEvent.observers.length > 0;
  }

  get hasEditEvent() {
    return this.editEvent.observers.length > 0;
  }

  get hasViewEvent() {
    return this.viewEvent.observers.length > 0;
  }

  get hasAction() {
    return this.hasDeleteEvent || this.hasViewEvent || this.hasEditEvent;
  }

  correctColumnName(column: string) {
    return `${column.charAt(0).toUpperCase()}${column.slice(1)}`;
  }

  constructor(private readonly activatedRoute: ActivatedRoute) {
  }
}
