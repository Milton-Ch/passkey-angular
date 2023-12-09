import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Fido2Service {

  constructor(private http: HttpClient) { }

  options(username: string): Observable<HttpResponse<any>> {
    const requestBody = {
      username: username
    }
    return this.http.post<any>('/jans-fido2/restv1/assertion/options', requestBody, { observe: 'response' });
  }
}
