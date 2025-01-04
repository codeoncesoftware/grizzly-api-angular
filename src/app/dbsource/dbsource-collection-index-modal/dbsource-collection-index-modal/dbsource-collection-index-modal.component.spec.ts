import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbsourceCollectionIndexModalComponent } from './dbsource-collection-index-modal.component';

describe('DbsourceCollectionIndexModalComponent', () => {
  let component: DbsourceCollectionIndexModalComponent;
  let fixture: ComponentFixture<DbsourceCollectionIndexModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbsourceCollectionIndexModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbsourceCollectionIndexModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
