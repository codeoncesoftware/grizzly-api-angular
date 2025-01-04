import { TestBed } from '@angular/core/testing';

import { GrizzlyAiService } from './grizzly-ai.service';

describe('GrizzlyAiService', () => {
  let service: GrizzlyAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrizzlyAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
