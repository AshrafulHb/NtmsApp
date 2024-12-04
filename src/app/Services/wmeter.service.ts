import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Emeter } from '../Interfaces/emeter';
import { ResponseApi } from '../Interfaces/response-api';
import { Wmeter } from '../Interfaces/wmeter';

@Injectable({
  providedIn: 'root',
})
export class WmeterService {
  private apiUrl: string = environment.endpoint + 'Wmeter/';

  constructor(private http: HttpClient) {}

  list(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}List`);
  }

  create(request: Wmeter): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.apiUrl}Create`, request);
  }

  edit(request: Wmeter): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.apiUrl}Edit`, request);
  }
  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.apiUrl}Delete/${id}`);
  }
}
