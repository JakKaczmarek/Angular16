import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NbpService {
  private apiUrl = 'http://api.nbp.pl/api/exchangerates/tables/A';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}?format=json`);
  }

  getDataByDate(date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${date}/?format=json`);
  }
}
