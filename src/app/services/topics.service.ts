import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  private apiUrl = 'http://localhost:4444/api';
  constructor(private http: HttpClient, router: Router) { }

  getTopicList(params: any[]): Observable<any> {
    console.log("params==", params)
    return this.http.post<any>(`${this.apiUrl}/topic-list`, params)
  }
}
