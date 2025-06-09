import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  private apiUrl = 'http://localhost:3000/auth'; 

  constructor(private http: HttpClient) {}

  
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }


  register(user: {
    name: string,
    email: string,
    password: string,
    user_type: string,
    grade: string,
    location: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}
