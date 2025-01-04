import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDockerModalComponent } from './export-docker-modal.component';

describe('ExportDockerModalComponent', () => {
  let component: ExportDockerModalComponent;
  let fixture: ComponentFixture<ExportDockerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDockerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDockerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
