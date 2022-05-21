import { Subscription } from "rxjs";
import { Movie } from "src/app/interfaces/movie";
import { MoviesService } from "./movies.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  template: `
    <!-- Spinner and error message -->
    <mat-spinner color="primary" style="margin:0 auto" *ngIf="loading"></mat-spinner>
    <div class="center" *ngIf="!movie && !loading">
      <h2>Movie not found</h2>
    </div>

    <!-- Movies card -->
    <div fxLayout="row wrap" fxLayoutAlign="center center" *ngIf="movie">
      <mat-card style="width:50vw">
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
  path!: string;
  movie!: Movie;
  loading = true;
  sub!: Subscription;

  constructor(private router: ActivatedRoute, private movieSrv: MoviesService) {
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }

  ngOnInit(): void {
    this.onGetPath();
  }

  /**
   * Get the path from the url to check if the movie is top-rated or popular
   */
  onGetPath() {
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

  /**
   * Get the specified top-rated movie by id from the server
   * @param id of the movie
   */
  onGetTop(id: number) {
    this.movieSrv.GetTop(id).subscribe((data) => {
      this.movie = data;
      this.loading = false;
    });
  }
  /**
   * Get the specified popular movie by id from the server
   * @param id of the movie
   */
  onGetPopular(id: number) {
    this.movieSrv.GetPopular(id).subscribe((data) => {
      this.movie = data;
      this.loading = false;
    });
  }

  /**
   * Remove the subscription when the component is destroyed
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
