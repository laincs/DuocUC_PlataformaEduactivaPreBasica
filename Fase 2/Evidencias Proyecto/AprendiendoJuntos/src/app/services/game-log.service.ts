import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameLogService {
  private apiUrl = 'http://localhost:3000/game_logs';

  constructor(private http: HttpClient) {}

  
  getAllLogs(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
