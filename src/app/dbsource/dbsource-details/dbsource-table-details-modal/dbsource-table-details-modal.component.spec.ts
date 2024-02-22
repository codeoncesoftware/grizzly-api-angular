import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbsourceTableDetailsModalComponent } from './dbsource-table-details-modal.component';

describe('DbsourceTableDetailsModalComponent', () => {
  let component: DbsourceTableDetailsModalComponent;
  let fixture: ComponentFixture<DbsourceTableDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbsourceTableDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbsourceTableDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
