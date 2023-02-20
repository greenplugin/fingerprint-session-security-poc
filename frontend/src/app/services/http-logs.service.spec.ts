import { TestBed } from '@angular/core/testing';

import { HttpLogsService } from './http-logs.service';

describe('HttpLogsService', () => {
  let service: HttpLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
