import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerStatsComponent } from './producer-stats.component';

describe('ProducerStatsComponent', () => {
  let component: ProducerStatsComponent;
  let fixture: ComponentFixture<ProducerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducerStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
