import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerMessageComponent } from './commons';

describe('AlerMessageComponent', () => {
  let component: AlerMessageComponent;
  let fixture: ComponentFixture<AlerMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlerMessageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AlerMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
