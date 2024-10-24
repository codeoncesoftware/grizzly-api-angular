import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbsourceModalTypeComponent } from './dbsource-modal-type.component';

describe('DbsourceModalTypeComponent', () => {
  let component: DbsourceModalTypeComponent;
  let fixture: ComponentFixture<DbsourceModalTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbsourceModalTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbsourceModalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
