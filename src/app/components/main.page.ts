import { Subscription } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Component({
  template: `
    <mat-toolbar color="primary"> <h1>myMovies</h1> </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <h4 class="name">Welcome</h4>
        <p class="designation">{{ username | titlecase }}</p>

        <mat-divider></mat-divider>

        <button mat-button class="menu-button" routerLink="/movies/popular">
          <mat-icon>home</mat-icon>
          <span>Popular Movies</span>
        </button>
        <button mat-button class="menu-button" routerLink="/movies/top">
          <mat-icon>star</mat-icon>
          <span>Top Movies</span>
        </button>
        <button mat-button class="menu-button" routerLink="/movies/favorites">
          <mat-icon>favorite</mat-icon>
          <span>Favorites</span>
        </button>
        <button mat-button class="menu-button" routerLink="/user">
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </button>

        <mat-divider></mat-divider>

        <button mat-button class="menu-button logout" (click)="onLogout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-sidenav>
      <mat-sidenav-content>
        <div class="content mat-elevation-z">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      mat-toolbar {
        color: white;
        h1 {
          font-size: 2rem;
        }
      }

      mat-sidenav {
        width: 200px;
        border-right: none;
        background: gray;
        padding: 16px;
        text-align: center;
      }

      .content {
        height: calc(100vh - 130px);
        border-radius: 10px;
        margin: 16px;
        margin-left: 32px;
        padding: 16px;
        overflow: auto;
      }

      mat-sidenav-container {
        height: calc(100vh - 65px);
      }

      .menu-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 1rem;

        mat-icon {
          margin-right: 8px;
        }
      }

      .name {
        margin-top: 8px;
        font-weight: normal;
      }

      .designation {
        margin-top: 2px;
        font-size: 2rem;
        color: lightgrey;
        line-height: 32px;
      }

      .logout {
        align-self: end;
      }
      mat-divider {
        margin-top: 16px;
        margin-bottom: 16px;
        background-color: rgba(255, 255, 255, 0.5);
      }
    `,
  ],
})
export class MainPage implements OnInit {
  username!: string;
  sub!: Subscription;

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.onGetUsername();
  }

  /**
   * Get the user name
   */
  onGetUsername() {
    this.sub = this.authSrv.user$.subscribe((data) => {
      if (!data) {
        return;
      }
      this.username = data.user.name;
    });
  }

  /**
   * Logout from the site and delete the localstorage
   */
  onLogout() {
    this.authSrv.logout();
    this.username = "";
  }

  /**
   * Remove the subscription when the component is destroyed
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
