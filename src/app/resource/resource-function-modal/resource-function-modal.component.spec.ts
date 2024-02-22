import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFunctionModalComponent } from './resource-function-modal.component';

describe('ResourceFunctionModalComponent', () => {
  let component: ResourceFunctionModalComponent;
  let fixture: ComponentFixture<ResourceFunctionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceFunctionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFunctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
