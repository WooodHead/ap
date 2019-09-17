import { TestBed, inject } from '@angular/core/testing';

import { NotificatorService } from '@app/core/services/notificator/notificator.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificatorService],
    });
  });

  it('should be created', inject([NotificatorService], (service: NotificatorService) => {
    expect(service).toBeTruthy();
  }));
});
