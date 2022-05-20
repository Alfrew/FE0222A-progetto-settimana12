import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable, switchMap, take } from "rxjs";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSrv: AuthService) {}

  /**
   * Intercept the request and if is a login request it add the token to the request
   * @param request http
   * @param next http request handler
   * @returns the request or the newReq with the token in the header
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authSrv.user$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          return next.handle(request);
        }
        const newReq = request.clone({
          headers: request.headers.set("Authorization", `Bearer ${user?.accessToken}`),
        });
        return next.handle(newReq);
      })
    );
  }
}
