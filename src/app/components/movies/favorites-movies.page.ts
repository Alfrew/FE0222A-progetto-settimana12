import { Subscription } from "rxjs";
import { Movie } from "src/app/interfaces/movie";
import { MoviesService } from "./movies.service";
import { Component, OnInit } from "@angular/core";
import { Favorite } from "src/app/interfaces/favorite";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  template: `
    <div fxLayout="row wrap" fxLayoutGap="16px grid">
      <!-- Spinner and error message -->
      <mat-spinner color="primary" style="margin:0 auto" *ngIf="loading"></mat-spinner>
      <div class="center" *ngIf="!movies && !loading">
        <h2>Favorites not found</h2>
      </div>
      <div class="center" *ngIf="movies.length == 0 && !loading">
        <h2>You've not favorites movies</h2>
        <p>Here you'll find your favorites movies list</p>
      </div>
      <!-- Favorites card -->
      <div fxFlex="25%" fxFlex.xs="100%" fxFlex.sm="50%" *ngFor="let movie of movies">
        <mat-card>
          <img mat-card-image src="https://image.tmdb.org/t/p/w500{{ movie.poster_path }}" />
          <mat-card-content>
            <p>Release: {{ movie.release_date }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="onDeleteFavorite(movie.id)"><mat-icon>closed</mat-icon></button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      mat-card-actions {
        display: flex;
        justify-content: end;
      }
      .center {
        text-align: center;
        margin: 0 auto;
      }
    `,
  ],
})
export class FavoritesMoviesPage implements OnInit {
  loading = true;
  userId!: number;
  sub!: Subscription;
  movies: Movie[] = [];
  favorites!: Favorite[];

  constructor(private movieSrv: MoviesService, private authSrv: AuthService) {
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }

  ngOnInit(): void {
    this.onGetUserId();
    this.onGetFavorites(this.userId);
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
   * Get all movies, both top and popular
   */
  onGetAllMovies() {
    this.sub = this.movieSrv.GetAllPopular().subscribe((data) => {
      this.movies = this.movies.concat(data.filter((data) => this.checkFavorite(data)));
      this.loading = false;
    });
    this.sub = this.movieSrv.GetAllTop().subscribe((data) => {
      this.movies = this.movies.concat(data.filter((data) => this.checkFavorite(data)));
    });
  }

  /**
   * Get the favorites by user id from the server
   * @param userId
   */
  onGetFavorites(userId: number) {
    this.sub = this.movieSrv.GetFavorites(userId).subscribe((data) => {
      this.favorites = data;
      this.onGetAllMovies();
    });
  }
  /**
   * Check if the movie is one of the user's favorite by id
   * @param movie to check
   * @returns the movie if the movie is in the favorites or undefined
   */
  checkFavorite(movie: Movie) {
    return this.favorites.find((favorite) => favorite.movieId == movie.id);
  }
  /**
   * Delete the favorite movie by movieId from the server
   * @param movieId
   */
  onDeleteFavorite(movieId: number) {
    this.movies = this.movies.filter((movie) => movie.id !== movieId);
    const favorite = this.favorites.find((favorite) => favorite.movieId == movieId);
    this.favorites = this.favorites.filter((fav) => fav !== favorite);
    if (!favorite) {
      return;
    }
    this.sub = this.movieSrv.DeleteFavorite(favorite.id).subscribe();
  }

  /**
   * Remove the subscription when the component is destroyed
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
