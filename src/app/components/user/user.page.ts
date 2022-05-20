import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { AuthData } from "src/app/interfaces/auth-data";
import { User } from "src/app/interfaces/user";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Movie } from "src/app/interfaces/movie";
import { UserService } from "./user.service";
import { WatchMovie } from "src/app/interfaces/watch-movie";

@Component({
  template: `
    <div fxLayout="column" fxLayoutAlign="center center" *ngIf="user">
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Info</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Name: {{ user.name }}</p>
          <p>Email: {{ user.email }}</p>
        </mat-card-content>
      </mat-card>

      <div>
        <h2>Watch List</h2>
        <div cdkDropList class="list" (cdkDropListDropped)="drop($event)">
          <div class="box" *ngIf="user.watchlist.length == 0">No films in your watchlist</div>
          <div class="box" *ngFor="let movie of user.watchlist" cdkDrag>
            {{ movie.title }} <button mat-button (click)="onRemoveWatchlist(movie)"><mat-icon>closed</mat-icon></button>
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
  user!: User;
  sub!: Subscription;
  userId!: number;
  constructor(private authSrv: AuthService, private userSrv: UserService) {}

  ngOnInit(): void {
    this.sub = this.authSrv.user$.subscribe((data) => {
      if (!data) {
        return;
      }
      this.userId = data.user.id;
    });
    this.onGetUser(this.userId);
  }

  onGetUser(id: number) {
    this.sub = this.userSrv.GetUser(id).subscribe((data) => {
      this.user = data;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.user.watchlist, event.previousIndex, event.currentIndex);
    this.onPutWatchlist();
  }

  onPutWatchlist() {
    this.sub = this.userSrv.PutWatchlist(this.userId, this.user).subscribe();
  }

  onRemoveWatchlist(movie: WatchMovie) {
    this.user.watchlist = this.user.watchlist.filter((movieW) => movieW.id !== movie.id);
    this.sub = this.userSrv.PutWatchlist(this.userId, this.user).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
