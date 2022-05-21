import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, concat, map, merge, mergeMap, throwError } from "rxjs";
import { Favorite } from "src/app/interfaces/favorite";
import { Movie } from "src/app/interfaces/movie";
import { WatchList } from "src/app/interfaces/watch-list";

@Injectable({
  providedIn: "root",
})
export class MoviesService {
  constructor(private http: HttpClient) {}
  url = "http://localhost:4201/";

  /**
   * Get all movies from server
   * @returns array of movies
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
   * Get specified movie by id from server
   * @param id of the item
   * @returns the specified movie
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
   * Get specified movie filtered by userId from server
   * @param userId of the user
   * @returns the specified movie
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
   * Post a new movie on the server
   * @param userId
   * @param movieId
   * @returns the http post request
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
  /**
   * Delete a favorite movie by id on the server
   * @param id of the favorite movie
   * @returns
   */
  DeleteFavorite(id: number) {
    return this.http.delete(`${this.url}favorites/` + id).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }

  /**
   * Put the updated watchlist on the server
   * @param id of the watchlist
   * @param item the updated watchlist
   * @returns the http put request
   */
  PutWatchlist(id: number, item: WatchList) {
    return this.http.put<WatchList>(`${this.url}watchLists/${id}`, item).pipe(
      catchError((err) => {
        return throwError(this.errorSwitch(err.status));
      })
    );
  }

  /**
   * Get the watchlist by id from the server
   * @param id of the watchlist
   * @returns the specified watchlist
   */
  GetWatchlist(id: number) {
    return this.http.get<WatchList>(`${this.url}watchLists/${id}`).pipe(
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
