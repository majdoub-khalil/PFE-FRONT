import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPageComponent } from './editpage.component';

describe('EditpageComponent', () => {
  let component:EditPageComponent ;
  let fixture: ComponentFixture<EditPageComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPageComponent  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
