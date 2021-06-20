import { AfterContentInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements AfterContentInit {
  @Input() data$: Observable<T[]> = of([]);
  @Input() showColumns: string[] = [];
  @Output() deleteEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Input() showInteractions: (data: T) => boolean = this.show;
  @Output() viewEvent = new EventEmitter();
  columns: string[] = [];
  private source: MatTableDataSource<T> | null = null;

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  show(data: T) {
    return true;
  }

  ngAfterContentInit() {
    this.data$.subscribe(data => {
      this.columns = data.length === 0 ? [] : Object.getOwnPropertyNames(data[0]);
      this.columns = this.columns.filter(value => this.showColumns.includes(value));
      this.source = new MatTableDataSource(data);
    });
  }

  toUpperCase(name: string) {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  }

  get data() {
    return this.source ? this.source : [];
  }

  get canDelete() {
    return this.deleteEvent.observers.length > 0;
  }

  get canEdit() {
    return this.editEvent.observers.length > 0;
  }

  get canOpen() {
    return this.viewEvent.observers.length > 0;
  }

  get canInteract() {
    return this.canDelete || this.canOpen || this.canEdit;
  }

}
