import { Router } from "@angular/router";
import { User } from "../interfaces/user";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../interfaces/auth-data";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  URL = "http://localhost:4201";
  private authSubject = new BehaviorSubject<null | AuthData>(null);
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map((user) => !!user));
  autologoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  /**
   * Login http post request for json-server-auth, with autoLogout method
   * @param data an object with user's email and password
   * @returns the http post request
   */
  login(data: { email: string; password: string }) {
    return this.http.post<AuthData>(`${this.URL}/login`, data).pipe(
      tap((data) => {
        this.authSubject.next(data);
        localStorage.setItem("user", JSON.stringify(data));
        const expirationDate = this.jwtHelper.getTokenExpirationDate(data.accessToken) as Date;
        this.autoLogut(expirationDate);
      })
    );
  }

  /**
   * Restore the user if is present a valid token in the localstorage
   * @returns
   */
  restoreUser() {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      return;
    }
    const user: AuthData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(user.accessToken)) {
      return;
    }
    this.authSubject.next(user);
    const expirationDate = this.jwtHelper.getTokenExpirationDate(user.accessToken) as Date;
    this.autoLogut(expirationDate);
  }

  /**
   * Send and register the new user in the json server
   * @param data user's data from the signup form
   * @returns the http post request
   */
  signup(data: any) {
    return this.http.post(`${this.URL}/register`, data);
  }

  /**
   * Logout the user and delete the token from the local storage
   */
  logout() {
    this.authSubject.next(null);
    this.router.navigate(["/login"]);
    localStorage.removeItem("user");
    if (this.autologoutTimer) {
      clearTimeout(this.autologoutTimer);
    }
  }

  /**
   * Logout the user automatically when the token is expired
   * @param expirationDate of the user token
   */
  autoLogut(expirationDate: Date) {
    const expMs = expirationDate.getTime() - new Date().getTime();
    this.autologoutTimer = setTimeout(() => {
      this.logout();
    }, expMs);
  }
}
