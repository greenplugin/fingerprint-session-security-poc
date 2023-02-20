import { TestBed } from '@angular/core/testing';

import { MonacoInitializerService } from './monaco-initializer.service';

describe('MonacoInitializerService', () => {
  let service: MonacoInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonacoInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
