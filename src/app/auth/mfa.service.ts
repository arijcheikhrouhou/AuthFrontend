import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TotpSetupResponse {
  qrCodeImage: string;
  secret: string;
}

@Injectable({
  providedIn: 'root',
})
export class MfaService {
  private baseUrl = 'http://localhost:8080/api/mfa';

  constructor(private http: HttpClient) {}

  setup(): Observable<TotpSetupResponse> {
    return this.http.post<TotpSetupResponse>(`${this.baseUrl}/setup`, {});
  }

  enable(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/enable`, { code });
  }

  disable(): Observable<any> {
    return this.http.post(`${this.baseUrl}/disable`, {});
  }
}
