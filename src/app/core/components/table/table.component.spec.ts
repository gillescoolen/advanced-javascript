import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { MaterialModule } from '../../shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TableComponent', () => {
  let component: TableComponent<any>;
  let fixture: ComponentFixture<TableComponent<any>>;
  let testData: Observable<any[]>;
  let viewButton: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MaterialModule, BrowserAnimationsModule ],
      declarations: [ TableComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{id: 1}]),
          },
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    testData = of([
      {
        id: '1',
        name: 'Test project1',
        description: 'Some description 1',
        owner: 'Owner1',
        status: 'Working',
        archived: false,
        ownerId: '1'
      },
      {
        id: '2',
        name: 'Test project2',
        description: 'Some description 2',
        owner: 'Owner2',
        status: 'Draft',
        archived: false,
        ownerId: '2'
      },
      {
        id: '3',
        name: 'Test project3',
        description: 'Some description 3',
        owner: 'Owner1',
        status: 'Finished',
        archived: true,
        ownerId: '1'
      },
    ]);

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.data$ = testData;
    component.showActions(true);
    spyOn(component.viewEvent, 'emit');
    component.viewEvent.subscribe(data => data);

    fixture.detectChanges();

    viewButton = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.mat-raised-button'))
      .filter(e => e.textContent === 'View')[0];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', () => {
    expect(component.data$).toBeTruthy();
  });

  it('should show a view button', () => {
    expect(viewButton).toBeTruthy();
  });

  it('click on view should emit', () => {
    const expectedEmitValue = '1';

    viewButton.dispatchEvent(new Event('click'));

    expect(component.viewEvent.emit).toHaveBeenCalledWith(expectedEmitValue);
  });
});
