import { TestBed } from '@angular/core/testing';
import { AuthService } from '@app/auth/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpService } from '@app/core/services/http/http.service';

describe('AuthService', () => {
  let service: AuthService;
  const http = {
    post: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, HttpService],
    });

    service = new AuthService(http as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST to api/agent/auth/login', (done) => {
    const mock = {
      agent: 1,
      extension: 1,
      username: 'test',
    };

    http.post.mockImplementationOnce(() => of(mock));

    service
      .login({ agent: 1, extension: 1 })
      .subscribe((res) => {
        expect(res).toEqual(mock);

        done();
      });
  });

});
