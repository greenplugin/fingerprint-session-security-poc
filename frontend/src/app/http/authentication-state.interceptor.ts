import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {UserService} from "../services/user.service";
import {UiEventsService} from "../services/ui-events.service";

@Injectable()
export class AuthenticationStateInterceptor implements HttpInterceptor {

  constructor(private userService: UserService, private uiEventsService: UiEventsService){
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.userService.logout();
        }

        if (error.status === 403) {
          this.uiEventsService.signatureStatus.next(false);
        }

        return throwError(() => error);
      })
    );
  }
}
