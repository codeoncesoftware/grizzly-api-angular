import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesModalComponent } from './codes-modal.component';

describe('CodesModalComponent', () => {
  let component: CodesModalComponent;
  let fixture: ComponentFixture<CodesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
