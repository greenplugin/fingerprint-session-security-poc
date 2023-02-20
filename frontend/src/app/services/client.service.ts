import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(
    private readonly http: HttpClient
  ) {
  }

  public ping(): Observable<any> {
    return this.http.get<any>(environment.clientBaseUri + "ping", {
      headers: {
        Authorization: ''
      }
    });
  }

  public issueSession(name: string, fingerprint: string, fingerprintData: any | null, avatarUrl: string): Observable<any> {
    return this.http.post<any>(environment.clientBaseUri + "issueSession", {
      name,
      fingerprintData,
      fingerprint,
      avatarImageUrl: avatarUrl
    });
  }

  public verifySession(): Observable<any> {
    return this.http.get<any>(environment.clientBaseUri + "verifySession", {
      headers: {
        Authorization: ''
      },
    })
  }
}
