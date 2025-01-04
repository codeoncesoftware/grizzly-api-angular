import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSwaggerModalComponent } from './export-swagger-modal.component';

describe('ExportSwaggerModalComponent', () => {
  let component: ExportSwaggerModalComponent;
  let fixture: ComponentFixture<ExportSwaggerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportSwaggerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSwaggerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
