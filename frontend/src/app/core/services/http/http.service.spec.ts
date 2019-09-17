import { TestBed } from '@angular/core/testing';
import { HttpService } from '@app/core/services/http/http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('HttpService', () => {
  let service: HttpService;
  const http = {
    get: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });

    service = new HttpService(http as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request', (done) => {
    const mock = [
      { id: 1 },
      { id: 2 },
    ];

    http.get.mockImplementationOnce(() => of(mock));

    service
      .get('/test')
      .subscribe((res) => {
        expect(http.get).toHaveBeenCalledWith('/test');
        expect(res.length).toEqual(2);
        expect(res).toEqual(mock);

        done();
      });
  });

});
