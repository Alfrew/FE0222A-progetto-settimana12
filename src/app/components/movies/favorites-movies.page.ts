import { Subscription } from "rxjs";
import { Movie } from "src/app/interfaces/movie";
import { MoviesService } from "./movies.service";
import { Component, OnInit } from "@angular/core";
import { Favorite } from "src/app/interfaces/favorite";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  template: `
    <div fxLayout="row wrap" fxLayoutGap="16px grid">
      <mat-spinner color="primary" style="margin:0 auto" *ngIf="loading"></mat-spinner>
      <div class="center" *ngIf="!movies && !loading">
        <h2>Favorites not found</h2>
      </div>
      <div fxFlex="25%" fxFlex.xs="100%" fxFlex.sm="50%" fxFlex.md="33%" *ngFor="let movie of movies">
        <mat-card>
          <img mat-card-image src="https://image.tmdb.org/t/p/w500{{ movie.poster_path }}" />
          <mat-card-content>
            <p>{{ movie.original_title }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="onDeleteFavorite(movie)"><mat-icon>closed</mat-icon></button>
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
      }
    `,
  ],
})
export class FavoritesMoviesPage implements OnInit {
  movies: Movie[] = [];
  userId!: number;
  loading = true;
  sub!: Subscription;
  favorites!: Favorite[];
  constructor(private movieSrv: MoviesService, private authSrv: AuthService) {
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }

  ngOnInit(): void {
    this.sub = this.authSrv.user$.subscribe((data) => {
      if (!data) {
        return;
      }
      this.userId = data.user.id;
    });
    this.onGetFavorites(this.userId);
    setTimeout(() => {
      this.onGetMovies();
    }, 500);
  }

  onGetMovies() {
    this.sub = this.movieSrv.GetAllPopular().subscribe((data) => {
      this.movies = this.movies.concat(data.filter((data) => this.checkFavorite(data)));
      this.loading = false;
    });
    this.sub = this.movieSrv.GetAllTop().subscribe((data) => {
      this.movies = this.movies.concat(data.filter((data) => this.checkFavorite(data)));
    });
  }

  onGetFavorites(userId: number) {
    this.sub = this.movieSrv.GetFavorites(userId).subscribe((data) => {
      this.favorites = data;
    });
  }

  checkFavorite(movie: Movie) {
    return this.favorites.find((el) => el.movieId == movie.id);
  }

  onDeleteFavorite(movie: Movie) {
    this.movies = this.movies.filter((mov) => mov.id !== movie.id);
    const favorite = this.favorites.find((favorite) => favorite.movieId == movie.id);
    this.favorites = this.favorites.filter((fav) => fav !== favorite);
    if (!favorite) {
      return;
    }
    this.sub = this.movieSrv.DeleteFavorite(favorite.id).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
