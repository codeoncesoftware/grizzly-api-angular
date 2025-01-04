import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenfaasHeaderModalComponent } from './openfaas-header-modal.component';

describe('OpenfaasHeaderModalComponent', () => {
  let component: OpenfaasHeaderModalComponent;
  let fixture: ComponentFixture<OpenfaasHeaderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenfaasHeaderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenfaasHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
