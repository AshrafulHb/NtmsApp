import { Injectable } from '@angular/core';
import { Ereading } from '../Interfaces/ereading';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class EreadingService {
  private apiUrl: string = environment.endpoint + 'EReading/';
  constructor(private http: HttpClient) {}

  /*  list(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}List`);
  }*/

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
  create(request: Ereading): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.apiUrl}Create`, request);
  }

  edit(request: Ereading): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.apiUrl}Edit`, request);
  }
  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.apiUrl}Delete/${id}`);
  }
}
