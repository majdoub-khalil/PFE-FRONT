import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySnapshotComponent } from './monthly-snapshot.component';

describe('MonthlySnapshotComponent', () => {
  let component: MonthlySnapshotComponent;
  let fixture: ComponentFixture<MonthlySnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlySnapshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
