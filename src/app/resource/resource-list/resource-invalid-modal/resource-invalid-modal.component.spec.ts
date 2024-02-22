import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceInvalidModalComponent } from './resource-invalid-modal.component';

describe('ResourceInvalidModalComponent', () => {
  let component: ResourceInvalidModalComponent;
  let fixture: ComponentFixture<ResourceInvalidModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceInvalidModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceInvalidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
