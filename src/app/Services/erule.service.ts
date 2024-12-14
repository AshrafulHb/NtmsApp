import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../Interfaces/response-api';
import { EbillingRules } from '../Interfaces/ebilling-rules';

@Injectable({
  providedIn: 'root',
})
export class EruleService {
  private apiUrl: string = environment.endpoint + 'EbillingRule/';
  constructor(private http: HttpClient) {}

  load(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiUrl}GetRule`);
  }

  create(request: EbillingRules): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.apiUrl}Create`, request);
  }

  edit(request: EbillingRules): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.apiUrl}Edit`, request);
  }
  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.apiUrl}Delete/${id}`);
  }
}
