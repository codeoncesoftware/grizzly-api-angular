import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneFunctionModalComponent } from './clone-function-modal.component';

describe('CloneFunctionModalComponent', () => {
  let component: CloneFunctionModalComponent;
  let fixture: ComponentFixture<CloneFunctionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneFunctionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneFunctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
