import { TestBed } from '@angular/core/testing';

import { PictureDataService } from './picture-data.service';

describe('PictureDataService', () => {
  let service: PictureDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PictureDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
