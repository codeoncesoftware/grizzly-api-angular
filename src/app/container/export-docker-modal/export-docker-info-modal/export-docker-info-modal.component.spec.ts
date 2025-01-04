import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDockerInfoModalComponent } from './export-docker-info-modal.component';

describe('ExportDockerInfoModalComponent', () => {
  let component: ExportDockerInfoModalComponent;
  let fixture: ComponentFixture<ExportDockerInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportDockerInfoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDockerInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
