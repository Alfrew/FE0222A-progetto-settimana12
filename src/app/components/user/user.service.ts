import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { User } from "src/app/interfaces/user";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  url = "http://localhost:4201/";

  constructor(private http: HttpClient) {}

  PutWatchlist(id: number, item: User) {
    return this.http.put<User>(`${this.url}users/${id}`, item).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }

  GetUser(id: number) {
    return this.http.get<User>(`${this.url}users/${id}`).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }

  /**
   * Basic switch error messages
   * @param status from errors
   * @returns errors message
   */
  private errorSwitch(status: number) {
    let mess = "";
    switch (status) {
      case 404:
        mess = "Resources not found";
        break;
      case 500:
        mess = "Internal Server Error";
        break;
      default:
        mess = "Something went wrong...";
        break;
    }
    return mess;
  }
}
