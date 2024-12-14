import { Injectable } from '@angular/core';
import { Emeter } from '../Interfaces/emeter';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class EmeterService {
  private apiUrl: string = environment.endpoint + 'Emeter/';
  constructor(private http: HttpClient) {}

  list(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}List`);
  }
  listActive(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}ListActive`);
  }

  create(request: Emeter): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.apiUrl}Create`, request);
  }

  edit(request: Emeter): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.apiUrl}Edit`, request);
  }
  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.apiUrl}Delete/${id}`);
  }
}
