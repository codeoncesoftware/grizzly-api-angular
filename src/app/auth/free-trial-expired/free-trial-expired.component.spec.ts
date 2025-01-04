import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTrialExpiredComponent } from './free-trial-expired.component';

describe('FreeTrialExpiredComponent', () => {
  let component: FreeTrialExpiredComponent;
  let fixture: ComponentFixture<FreeTrialExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeTrialExpiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTrialExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
