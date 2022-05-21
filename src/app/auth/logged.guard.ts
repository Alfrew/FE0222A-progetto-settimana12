import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { map, Observable, take } from "rxjs";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class LoggedGuard implements CanActivate {
  constructor(private authSrv: AuthService, private router: Router) {}
  /**
   * guard to protect login and signup if already logged
   * @param route
   * @param state
   * @returns to the home if already logged
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authSrv.isLoggedIn$.pipe(
      take(1),
      map((isLogged) => {
        if (!isLogged) {
          return true;
        }
        return this.router.createUrlTree(["/movies/popular"]);
      })
    );
  }
}
