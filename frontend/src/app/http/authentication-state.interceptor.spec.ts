import { TestBed } from '@angular/core/testing';

import { AuthenticationStateInterceptor } from './authentication-state.interceptor';

describe('AuthenticationStateInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthenticationStateInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthenticationStateInterceptor = TestBed.inject(AuthenticationStateInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
