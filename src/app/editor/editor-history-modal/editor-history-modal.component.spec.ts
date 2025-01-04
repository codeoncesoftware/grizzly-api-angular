import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorHistoryModalComponent } from './editor-history-modal.component';

describe('EditorHistoryModalComponent', () => {
  let component: EditorHistoryModalComponent;
  let fixture: ComponentFixture<EditorHistoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorHistoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
