import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportModelsComponent } from './export-models.component';

describe('ExportModelsComponent', () => {
  let component: ExportModelsComponent;
  let fixture: ComponentFixture<ExportModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
