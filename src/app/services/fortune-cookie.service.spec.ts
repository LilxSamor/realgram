import { TestBed } from '@angular/core/testing';

import { FortuneCookieService } from './fortune-cookie.service';

describe('FortuneCookieService', () => {
  let service: FortuneCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FortuneCookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
