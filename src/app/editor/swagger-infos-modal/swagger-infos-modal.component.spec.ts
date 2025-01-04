import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwaggerInfosModalComponent } from './swagger-infos-modal.component';

describe('SwaggerInfosModalComponent', () => {
  let component: SwaggerInfosModalComponent;
  let fixture: ComponentFixture<SwaggerInfosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwaggerInfosModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwaggerInfosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
