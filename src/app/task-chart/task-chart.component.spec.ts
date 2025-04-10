import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskChartComponent } from './task-chart.component';

describe('TaskChartComponent', () => {
  let component: TaskChartComponent;
  let fixture: ComponentFixture<TaskChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
