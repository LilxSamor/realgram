import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl: string = 'https://jd3j6o4pjl.execute-api.us-east-1.amazonaws.com/prod/weather';

  constructor(private http: HttpClient) {}

  getLatestWeather() {
    return this.http.get<any>(this.apiUrl);
  }
}
