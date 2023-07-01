import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouchbaseQueryDetailsComponent } from './couchbase-query-details.component';

describe('CouchbaseQueryDetailsComponent', () => {
  let component: CouchbaseQueryDetailsComponent;
  let fixture: ComponentFixture<CouchbaseQueryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouchbaseQueryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouchbaseQueryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
