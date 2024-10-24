import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateModalComponent } from './generate-modal.component';

describe('GenerateModalComponent', () => {
  let component: GenerateModalComponent;
  let fixture: ComponentFixture<GenerateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
