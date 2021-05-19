import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private rootUrl = environment.baseUrl;
  private key = environment.key;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getUserCurrentWeather(params: any) {
    params = {
      ...params,
      appid: this.key
    }
    return this.http.get<any>(this.rootUrl, { params })
  }

}
