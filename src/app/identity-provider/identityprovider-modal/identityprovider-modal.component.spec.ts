import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityproviderModalComponent } from './identityprovider-modal.component';

describe('IdentityproviderModalComponent', () => {
  let component: IdentityproviderModalComponent;
  let fixture: ComponentFixture<IdentityproviderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentityproviderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityproviderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
