import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import {catchError, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {SignerService} from "../services/signer.service";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {UiEventsService} from "../services/ui-events.service";
import {HttpLogsService} from "../services/http-logs.service";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor(
    private signerService: SignerService,
    private uiEventsService: UiEventsService,
    private logService: HttpLogsService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.uiEventsService.clientState.next('request');

    // Add a random requestId to the request headers if it is not already present
    if (!request.headers.has("RequestId")) {
      request = request.clone({
        setHeaders: {
          "RequestId": window.crypto.randomUUID()
        }
      });
    }

    // If the request should be authorized, sign it
    if (request.headers.has("authorization")) {
      this.uiEventsService.clientState.next('signature');
      return fromPromise(this.signerService.sign(request)).pipe(
        switchMap(signature => {
            request = request.clone({
              setHeaders: {
                "Authorization": `Bearer ${localStorage.getItem("sessionToken")}`,
                "Signature": signature
              }
            });

            this.uiEventsService.clientState.next('request');
            this.logService.pushLogData('Sending request', {
              request,
              headers: request.headers.keys().map(key => ({[key]: request.headers.get(key)}))
            });


            return next.handle(request);
          }
        )
      ).pipe(tap({
        next: (e) => {
          if (e instanceof HttpResponse) {
            this.uiEventsService.clientState.next('idle')
            this.logService.pushLogData('Received response', e);
          }
        },
        error: () => this.uiEventsService.clientState.next('idle'),
      }))
    }

    return next.handle(request).pipe(tap({
      next: (e) => {
        if (e instanceof HttpResponse) {
          this.uiEventsService.clientState.next('idle')
        }
      },
      error: () => this.uiEventsService.clientState.next('idle'),
    }));
  }
}
