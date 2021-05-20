import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl;
  const appKey = environment.key;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        WeatherService,
      ]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET with query params: getUserCurrentWeather', () => {
    const mockUrl = `${baseUrl}?lat=123&lon=124&appid=${appKey}`;
    const params = {
      lat: 123,
      lon: 124,
    }

    service.getUserCurrentWeather(params).subscribe();

    const mockReq = httpMock.expectOne(mockUrl);
    expect(mockReq.request.method).toEqual('GET');
    httpMock.verify();
  })
});
