import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Fido2Service {

  constructor(private http: HttpClient) { }

  assertionOptions(requestBody: any): Observable<HttpResponse<any>> {
    return this.http.post<any>('/jans-fido2/restv1/assertion/options', requestBody, { observe: 'response' });
  }
  assertionResult(requestBody: any): Observable<HttpResponse<any>> {
    return this.http.post<any>('/jans-fido2/restv1/assertion/result', requestBody, { observe: 'response' });
  }

  /* REGISTER */

  attestationOptions(requestBody: any): Observable<HttpResponse<any>> {
    return this.http.post<any>('/jans-fido2/restv1/attestation/options', requestBody, { observe: 'response' });
  }

  attestationResult(requestBody: any): Observable<HttpResponse<any>> {
    return this.http.post<any>('/jans-fido2/restv1/attestation/result', requestBody, { observe: 'response' });
  }
}
