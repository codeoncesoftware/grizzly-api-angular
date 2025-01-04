import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityproviderDetailsComponent } from './identityprovider-details.component';

describe('IdentityproviderDetailsComponent', () => {
  let component: IdentityproviderDetailsComponent;
  let fixture: ComponentFixture<IdentityproviderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentityproviderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityproviderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
