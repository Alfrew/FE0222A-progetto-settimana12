import { Subscription } from "rxjs";
import { User } from "src/app/interfaces/user";
import { Movie } from "src/app/interfaces/movie";
import { MoviesService } from "./movies.service";
import { Component, OnInit } from "@angular/core";
import { UserService } from "../user/user.service";
import { Favorite } from "src/app/interfaces/favorite";
import { AuthService } from "src/app/auth/auth.service";
import { WatchMovie } from "src/app/interfaces/watch-movie";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  template: `
    <div fxLayout="row wrap" fxLayoutGap="16px grid">
      <mat-spinner color="primary" style="margin:0 auto" *ngIf="loading"></mat-spinner>
      <div class="center" *ngIf="!movies && !loading">
        <h2>Movies not found</h2>
      </div>
      <div fxFlex="25%" fxFlex.xs="100%" fxFlex.sm="50%" fxFlex.md="33%" *ngFor="let movie of movies">
        <mat-card>
          <img mat-card-image src="https://image.tmdb.org/t/p/w500{{ movie.poster_path }}" />
          <mat-card-content>
            <p>Average score: {{ movie.vote_average }}/10</p>
          </mat-card-content>
          <mat-card-actions>
            <button color="accent" mat-button (click)="onDeleteFavorite(movie)" *ngIf="checkFavorite(movie)"><mat-icon>favorite</mat-icon></button>
            <button mat-button (click)="onPostFavorite(movie)" *ngIf="!checkFavorite(movie)"><mat-icon>favorite_border</mat-icon></button>
            <button color="accent" mat-button (click)="onRemoveWatchlist(movie)" *ngIf="checkWatchList(movie)"><mat-icon>remove_red_eye</mat-icon></button>
            <button mat-button (click)="onPutWatchlist(movie)" *ngIf="!checkWatchList(movie)"><mat-icon>remove_red_eye</mat-icon></button>
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
      }
    `,
  ],
})
export class MoviesPage implements OnInit {
  user!: User;
  loading = true;
  userId!: number;
  movies!: Movie[];
  sub!: Subscription;
  favorites!: Favorite[];
  path!: string;
  constructor(private movieSrv: MoviesService, private authSrv: AuthService, private userSrv: UserService, private router: ActivatedRoute) {
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
    this.sub = this.router.params.subscribe((params: Params) => {
      this.path = this.router.snapshot.url[0].path;
    });
    this.onGetUser(this.userId);
    this.onGetFavorites(this.userId);
    setTimeout(() => {
      if (this.path == "popular") {
        this.onGetPopular();
      }
      if (this.path == "top") {
        this.onGetTop();
      }
    }, 500);
  }

  onGetTop() {
    this.sub = this.movieSrv.GetAllTop().subscribe((data) => {
      this.movies = data;
      this.loading = false;
    });
  }

  onGetPopular() {
    this.sub = this.movieSrv.GetAllPopular().subscribe((data) => {
      this.movies = data;
      this.loading = false;
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
  checkWatchList(movie: Movie) {
    return this.user.watchlist.find((el) => el.id == movie.id);
  }

  onGetUser(id: number) {
    this.sub = this.userSrv.GetUser(id).subscribe((data) => {
      this.user = data;
    });
  }

  onPutWatchlist(movie: Movie) {
    const watchMovie: WatchMovie = {
      id: movie.id,
      title: movie.title,
    };
    this.user.watchlist.push(watchMovie);
    this.sub = this.userSrv.PutWatchlist(this.userId, this.user).subscribe();
  }

  onRemoveWatchlist(movie: Movie) {
    this.user.watchlist = this.user.watchlist.filter((movieW) => movieW.id !== movie.id);
    this.sub = this.userSrv.PutWatchlist(this.userId, this.user).subscribe();
  }

  onPostFavorite(movie: Movie) {
    const fakeId = this.favorites.length;
    this.favorites.push({
      movieId: movie.id,
      userId: this.userId,
      id: fakeId,
    });
    this.sub = this.movieSrv.PostFavorite(this.userId, movie.id).subscribe((data) => {
      this.favorites = this.favorites.filter((fav) => fav.id !== fakeId);
      this.favorites.push(data);
    });
  }

  onDeleteFavorite(movie: Movie) {
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
