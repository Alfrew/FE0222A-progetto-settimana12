import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { Movie } from "src/app/interfaces/movie";
import { MoviesService } from "./movies.service";

@Component({
  template: `
    <mat-spinner color="primary" style="margin:0 auto" *ngIf="loading"></mat-spinner>
    <div class="center" *ngIf="!movie && !loading">
      <h2>Movie not found</h2>
    </div>
    <div fxLayout="row wrap" fxLayoutAlign="center center" *ngIf="movie">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ movie.title }}</mat-card-title>
        </mat-card-header>
        <img mat-card-image src="https://image.tmdb.org/t/p/w500{{ movie.backdrop_path }}" />
        <mat-card-content>
          <p>
            Average score: {{ movie.vote_average }}/10 <br />
            by {{ movie.vote_count }} users
          </p>
          <p>Release Date: {{ movie.release_date }}</p>
          <p>
            Sinossi: <br />
            {{ movie.overview }}
          </p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button *ngIf="path == 'top'" routerLink="/movies/top"><mat-icon>backspace</mat-icon> Back to Top Movies</button>
          <button mat-button *ngIf="path == 'popular'" routerLink="/movies/popular"><mat-icon>backspace</mat-icon> Back to Popular Movies</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .center {
        text-align: center;
      }
    `,
  ],
})
export class InfoPage implements OnInit {
  movie!: Movie;
  sub!: Subscription;
  loading = true;
  path!: string;
  error!: string;
  constructor(private router: ActivatedRoute, private movieSrv: MoviesService) {
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }
  ngOnInit(): void {
    this.sub = this.router.params.subscribe((params: Params) => {
      this.path = this.router.snapshot.url[0].path;
      const id = +params["id"];
      if (this.path == "popular") {
        this.onGetPopular(id);
      }
      if (this.path == "top") {
        this.onGetTop(id);
      }
    });
  }

  onGetTop(id: number) {
    this.movieSrv.GetTop(id).subscribe((data) => {
      this.movie = data;
      this.loading = false;
    });
  }

  onGetPopular(id: number) {
    this.movieSrv.GetPopular(id).subscribe((data) => {
      this.movie = data;
      this.loading = false;
    });
  }
}
