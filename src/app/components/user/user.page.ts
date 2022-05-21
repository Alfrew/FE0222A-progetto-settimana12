import { Subscription } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { MoviesService } from "../movies/movies.service";
import { WatchList } from "src/app/interfaces/watch-list";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  template: `
    <div fxLayout="column" fxLayoutAlign="center center">
      <!-- Error message -->
      <div class="center" *ngIf="!userName && !loading">
        <h2>User not found</h2>
      </div>
      <!-- User info card -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Info</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Name: {{ userName | titlecase }}</p>
          <p>Email: {{ userMail }}</p>
        </mat-card-content>
      </mat-card>
      <!-- Watchlist drag and drop -->
      <mat-spinner color="primary" style="margin:0 auto" *ngIf="!watchlist"></mat-spinner>
      <div *ngIf="watchlist">
        <h2>Watch List</h2>
        <div cdkDropList class="list" (cdkDropListDropped)="drop($event)">
          <div class="box" *ngIf="watchlist.list.length == 0">No films in your watchlist</div>
          <div class="box" *ngFor="let movie of watchlist.list" cdkDrag>
            {{ movie.title }} <button mat-button (click)="onRemoveWatchlist(movie.movieId)"><mat-icon>closed</mat-icon></button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .list {
        margin-top: 12px;
        width: 500px;
        max-width: 100%;
        border: solid 1px #ccc;
        min-height: 60px;
        display: block;
        background: white;
        border-radius: 4px;
        overflow: hidden;
      }

      .box {
        padding: 20px 10px;
        border-bottom: solid 1px #ccc;
        color: rgba(0, 0, 0, 0.87);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        cursor: move;
        background: white;
        font-size: 14px;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .example-box:last-child {
        border: none;
      }

      .example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class UserPage implements OnInit {
  loading = true;
  userId!: number;
  userName!: string;
  userMail!: string;
  sub!: Subscription;
  watchlist!: WatchList;

  constructor(private authSrv: AuthService, private movieSrv: MoviesService) {
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }

  ngOnInit(): void {
    this.onGetUserData();
    this.onGetWatchlist(this.userId);
    this.loading = false;
  }

  /**
   * Get the user data
   */
  onGetUserData() {
    this.sub = this.authSrv.user$.subscribe((data) => {
      if (!data) {
        return;
      }
      this.userName = data.user.name;
      this.userMail = data.user.email;
      this.userId = data.user.id;
    });
  }

  /**
   * Rearrange the watchlist elements order by the drag and drop
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.watchlist.list, event.previousIndex, event.currentIndex);
    this.onPutWatchlist();
  }

  /**
   * Put the local updated watchlist
   */
  onPutWatchlist() {
    this.sub = this.movieSrv.PutWatchlist(this.userId, this.watchlist).subscribe();
  }
  /**
   * Check if the movie is in the user's watchlist by id
   * @param movie to check
   * @returns the movie if the movie is in the watchlist or undefined
   */
  onGetWatchlist(id: number) {
    this.sub = this.movieSrv.GetWatchlist(id).subscribe((data) => {
      this.watchlist = data;
    });
  }
  /**
   * Put the update watchlist with the removed movie on the server
   * @param movieId
   */
  onRemoveWatchlist(movieId: number) {
    this.watchlist.list = this.watchlist.list.filter((movieW) => movieW.movieId !== movieId);
    this.onPutWatchlist();
  }

  /**
   * Remove the subscription when the component is destroyed
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
