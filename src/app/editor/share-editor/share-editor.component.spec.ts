import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareEditorComponent } from './share-editor.component';

describe('ShareEditorComponent', () => {
  let component: ShareEditorComponent;
  let fixture: ComponentFixture<ShareEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
