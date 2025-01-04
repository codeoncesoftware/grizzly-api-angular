import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityproviderListComponent } from './identityprovider-list.component';

describe('IdentityproviderListComponent', () => {
  let component: IdentityproviderListComponent;
  let fixture: ComponentFixture<IdentityproviderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentityproviderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityproviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
