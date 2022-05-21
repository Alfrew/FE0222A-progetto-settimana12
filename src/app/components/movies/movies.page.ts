import { Subscription } from "rxjs";
import { User } from "src/app/interfaces/user";
import { Movie } from "src/app/interfaces/movie";
import { MoviesService } from "./movies.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Favorite } from "src/app/interfaces/favorite";
import { AuthService } from "src/app/auth/auth.service";
import { WatchList } from "src/app/interfaces/watch-list";

@Component({
  template: `
    <div fxLayout="row wrap" fxLayoutGap="16px grid">
      <!-- Spinner and error message -->
      <mat-spinner color="primary" style="margin:0 auto" *ngIf="loading"></mat-spinner>
      <div class="center" *ngIf="!movies && !loading">
        <h2>Movies not found</h2>
      </div>
      <!-- Movies card -->
      <div fxFlex="25%" fxFlex.xs="100%" fxFlex.sm="50%" fxFlex.md="33%" *ngFor="let movie of movies">
        <mat-card>
          <img mat-card-image src="https://image.tmdb.org/t/p/w500{{ movie.poster_path }}" />
          <mat-card-content>
            <p>Average score: {{ movie.vote_average }}/10</p>
          </mat-card-content>
          <mat-card-actions>
            <!-- Favorites buttons -->
            <button color="accent" mat-button (click)="onDeleteFavorite(movie.id)" *ngIf="checkFavorite(movie)"><mat-icon>favorite</mat-icon></button>
            <button mat-button (click)="onPostFavorite(movie)" *ngIf="!checkFavorite(movie)"><mat-icon>favorite_border</mat-icon></button>
            <!-- Watchlists buttons -->
            <button color="accent" mat-button (click)="onRemoveWatchlist(movie.id)" *ngIf="checkWatchList(movie)"><mat-icon>remove_red_eye</mat-icon></button>
            <button mat-button (click)="onAddWatchlist(movie)" *ngIf="!checkWatchList(movie)"><mat-icon>remove_red_eye</mat-icon></button>
            <!-- Infos buttons -->
            <button mat-button *ngIf="path == 'top'" [routerLink]="['/movies/top', movie.id]"><mat-icon>info</mat-icon></button>
            <button mat-button *ngIf="path == 'popular'" [routerLink]="['/movies/popular', movie.id]"><mat-icon>info</mat-icon></button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      mat-card-actions {
        display: flex;
        justify-content: space-between;
      }
      .center {
        text-align: center;
        margin: 0 auto;
      }
    `,
  ],
})
export class MoviesPage implements OnInit {
  user!: User;
  path!: string;
  loading = true;
  userId!: number;
  movies!: Movie[];
  sub!: Subscription;
  watchlist!: WatchList;
  favorites!: Favorite[];

  constructor(private movieSrv: MoviesService, private authSrv: AuthService, private router: ActivatedRoute) {
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }

  ngOnInit(): void {
    this.getPath();
    this.onGetUserId();
    this.onGetWatchlist(this.userId);
    this.onGetFavorites(this.userId);
  }

  /**
   * Get the path from the url to check if the movies are top-rated or popular
   */
  getPath() {
    this.sub = this.router.params.subscribe(() => {
      this.path = this.router.snapshot.url[0].path;
    });
  }
  /**
   * Get the user id
   */
  onGetUserId() {
    this.sub = this.authSrv.user$.subscribe((data) => {
      if (!data) {
        return;
      }
      this.userId = data.user.id;
    });
  }

  /**
   * Get the top-rated movies from the server
   */
  onGetTop() {
    this.sub = this.movieSrv.GetAllTop().subscribe((data) => {
      this.movies = data;
      this.loading = false;
    });
  }
  /**
   * Get the popular movies from the server
   */
  onGetPopular() {
    this.sub = this.movieSrv.GetAllPopular().subscribe((data) => {
      this.movies = data;
      this.loading = false;
    });
  }

  /**
   * Get the favorites by user id from the server
   * @param userId
   */
  onGetFavorites(userId: number) {
    this.sub = this.movieSrv.GetFavorites(userId).subscribe((data) => {
      this.favorites = data;
      if (this.path == "popular") {
        this.onGetPopular();
      }
      if (this.path == "top") {
        this.onGetTop();
      }
    });
  }
  /**
   * Check if the movie is one of the user's favorite by id
   * @param movie to check
   * @returns the movie if the movie is in the favorites or undefined
   */
  checkFavorite(movie: Movie) {
    return this.favorites.find((el) => el.movieId == movie.id);
  }
  /**
   * Post a favorite movie in the server and create a fake favorite in the local array to show the filled like immediately
   * @param movie to add to the favorites
   */
  onPostFavorite(movie: Movie) {
    const fakeId = this.favorites.length;
    this.favorites.push({
      userId: this.userId,
      movieId: movie.id,
      id: fakeId,
    });
    this.sub = this.movieSrv.PostFavorite(this.userId, movie.id).subscribe((data) => {
      this.favorites = this.favorites.filter((fav) => fav.id !== fakeId);
      this.favorites.push(data);
    });
  }
  /**
   * Delete the favorite movie by movieId from the server
   * @param movieId
   */
  onDeleteFavorite(movieId: number) {
    const favorite = this.favorites.find((favorite) => favorite.movieId == movieId);
    this.favorites = this.favorites.filter((fav) => fav !== favorite);
    if (!favorite) {
      return;
    }
    this.sub = this.movieSrv.DeleteFavorite(favorite.id).subscribe();
  }

  /**
   * Get the watchlist by user id from the server
   * @param userId
   */
  onGetWatchlist(userId: number) {
    this.sub = this.movieSrv.GetWatchlist(userId).subscribe((data) => {
      this.watchlist = data;
    });
  }
  /**
   * Check if the movie is in the user's watchlist by id
   * @param movie to check
   * @returns the movie if the movie is in the watchlist or undefined
   */
  checkWatchList(movie: Movie) {
    return this.watchlist.list.find((el) => el.movieId == movie.id);
  }
  /**
   * Put the update watchlist with the added movie on the server
   * @param movie to add in the watchlist
   */
  onAddWatchlist(movie: Movie) {
    const watchMovie = {
      movieId: movie.id,
      title: movie.title,
    };
    this.watchlist.list.push(watchMovie);
    this.sub = this.movieSrv.PutWatchlist(this.watchlist.id, this.watchlist).subscribe();
  }
  /**
   * Put the update watchlist with the removed movie on the server
   * @param movieId
   */
  onRemoveWatchlist(movieId: number) {
    this.watchlist.list = this.watchlist.list.filter((movieW) => movieW.movieId !== movieId);
    this.sub = this.movieSrv.PutWatchlist(this.watchlist.id, this.watchlist).subscribe();
  }

  /**
   * Remove the subscription when the component is destroyed
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
