import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculetTableComponent } from './calculet-table.component';

describe('CalculetTableComponent', () => {
  let component: CalculetTableComponent;
  let fixture: ComponentFixture<CalculetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculetTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
