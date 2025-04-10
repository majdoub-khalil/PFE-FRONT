import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgencyChartComponent } from './urgency-chart.component';

describe('UrgencyChartComponent', () => {
  let component: UrgencyChartComponent;
  let fixture: ComponentFixture<UrgencyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrgencyChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgencyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
