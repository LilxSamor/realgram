import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FortuneCookieService {
  private apiUrl: string = 'https://0gjyh8tux4.execute-api.us-east-1.amazonaws.com/prod/';
  
  constructor(private http: HttpClient) {}

  getFortuneCookieOfTheDay() {
    return this.http.get<any>(this.apiUrl);
  }
}
