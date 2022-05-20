import { Injectable } from "@angular/core";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authSrv: AuthService, private router: Router) {}
  /**
   * guard to protect the pages if not logged
   * @param route
   * @param state
   * @returns to /login if not logged
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authSrv.isLoggedIn$.pipe(
      take(1),
      map((isLogged) => {
        if (isLogged) {
          return true;
        }
        return this.router.createUrlTree(["/login"]);
      })
    );
  }
}
