import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPageComponent } from './addpage.component';

describe('AddpageComponent', () => {
  let component: AddPageComponent;
  let fixture: ComponentFixture<AddPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
