import { SharedModule } from '../../shared.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;

  const locationStub = {
    back: jasmine.createSpy('back')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      providers: [{provide: Location, useValue: locationStub} ],
      declarations: [ BackButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    const location = fixture.debugElement.injector.get(Location);
    const comp = new BackButtonComponent(location);

    comp.goBack();

    expect(location.back).toHaveBeenCalled();
  });
});
