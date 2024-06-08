import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationModalComponent } from './organisation-modal.component';

describe('OrganisationModalComponent', () => {
  let component: OrganisationModalComponent;
  let fixture: ComponentFixture<OrganisationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
