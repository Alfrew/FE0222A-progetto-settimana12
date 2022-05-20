import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, concat, map, merge, mergeMap, throwError } from "rxjs";
import { Favorite } from "src/app/interfaces/favorite";
import { Movie } from "src/app/interfaces/movie";

@Injectable({
  providedIn: "root",
})
export class MoviesService {
  constructor(private http: HttpClient) {}
  url = "http://localhost:4201/";

  /**
   * Get all items from server
   * @returns array of items
   */
  GetAllPopular() {
    return this.http.get<Movie[]>(`${this.url}movie/popular`).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }
  GetAllTop() {
    return this.http.get<Movie[]>(`${this.url}movie/top_rated`).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }
  /**
   * Get specified item by id from server
   * @param id of the item
   * @returns the specified item
   */
  GetPopular(id: number) {
    return this.http.get<Movie>(`${this.url}movie/popular/` + id).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }
  GetTop(id: number) {
    return this.http.get<Movie>(`${this.url}movie/top_rated/` + id).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }

  /**
   * Get specified item by id from server
   * @param id of the item
   * @returns the specified item
   */
  GetFavorites(userId: number) {
    return this.http.get<Favorite[]>(`${this.url}favorites`).pipe(
      map((favorites) => favorites.filter((favorite) => favorite.userId == userId)),
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }
  /**
   * Post new item to server
   * @param item to upload
   * @returns
   */
  PostFavorite(userId: number, movieId: number) {
    const item = {
      userId: userId,
      movieId: movieId,
    };
    return this.http.post<Favorite>(`${this.url}favorites`, item).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }

  DeleteFavorite(id: number) {
    return this.http.delete(`${this.url}favorites/` + id).pipe(
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
