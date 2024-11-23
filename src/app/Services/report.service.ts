import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl: string = environment.endpoint + 'Report/';
  constructor(private http: HttpClient) {}

  report(
    tenantId: number,
    firstDate: string,
    lastDate: string
  ): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.apiUrl}Report?tenantId=${tenantId}&firstDate=${firstDate}&lastdate=${lastDate}`
    );
  }
}
