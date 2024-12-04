import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ereading } from '../Interfaces/ereading';
import { ResponseApi } from '../Interfaces/response-api';
import { Wreading } from '../Interfaces/wreading';

@Injectable({
  providedIn: 'root',
})
export class WreadingService {
  private apiUrl: string = environment.endpoint + 'Wreading/';
  constructor(private http: HttpClient) {}

  load(
    meterId: number,
    firstDate: string,
    lastDate: string
  ): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.apiUrl}Load?meterId=${meterId}&firstDate=${firstDate}&lastdate=${lastDate}`
    );
  }
  loadLastReading(meterId: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.apiUrl}LastReading?meterId=${meterId}`
    );
  }
  create(request: Wreading): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.apiUrl}Create`, request);
  }

  edit(request: Wreading): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.apiUrl}Edit`, request);
  }
  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.apiUrl}Delete/${id}`);
  }
}
