import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorRedirectionComponent } from './editor-redirection.component';

describe('EditorRedirectionComponent', () => {
  let component: EditorRedirectionComponent;
  let fixture: ComponentFixture<EditorRedirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorRedirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorRedirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
