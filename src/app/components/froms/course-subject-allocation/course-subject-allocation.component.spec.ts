import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSubjectAllocationComponent } from './course-subject-allocation.component';

describe('CourseSubjectAllocationComponent', () => {
  let component: CourseSubjectAllocationComponent;
  let fixture: ComponentFixture<CourseSubjectAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSubjectAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSubjectAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
