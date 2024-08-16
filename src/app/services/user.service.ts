import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4444/api';

  constructor(private http: HttpClient, private router:Router) { }

  checkAuth(param: any): Observable<any> {
    
      return this.http.post<any>(`${this.apiUrl}/auth`, param);
   
      
  }
  getToken(): string | null {
    return localStorage.getItem('user_token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('user_token');
    this.router.navigate(['login']);
  }

}
