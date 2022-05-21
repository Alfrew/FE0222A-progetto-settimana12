import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  template: `
    <div class="login-wrapper" fxLayout="row" fxLayoutAlign="center center">
      <mat-card class="box">
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        <form class="form" #form="ngForm" (ngSubmit)="onSignup(form)">
          <mat-card-content>
            <mat-form-field class="full-width">
              <input matInput placeholder="Name" ngModel name="name" type="text" required />
              <mat-error *ngIf="errorMessage">{{ errorMessage }}!</mat-error>
            </mat-form-field>
            <mat-form-field class="full-width">
              <input matInput placeholder="Email" ngModel name="email" type="email" required />
              <mat-error *ngIf="errorMessage">{{ errorMessage }}!</mat-error>
            </mat-form-field>
            <mat-form-field class="full-width">
              <input matInput placeholder="Password" ngModel name="password" type="password" required />
              <mat-error *ngIf="errorMessage">{{ errorMessage }}!</mat-error>
            </mat-form-field>
          </mat-card-content>
          <button mat-stroked-button color="primary" class="btn-block">Register</button>
        </form>
        <p>Already registered? <a class="link" routerLink="/login">Login Here</a></p>
      </mat-card>
    </div>
  `,
  styles: [
    `
      html,
      body {
        height: 100%;
      }
      body {
        margin: 0;
        font-family: Roboto, "Helvetica Neue", sans-serif;
        min-height: 100vh;
        background: #e2e2e2;
      }
      .form {
        margin-bottom: 24px;
      }
      .link {
        cursor: pointer;
        text-decoration: underline;
      }
      .app-header {
        justify-content: space-between;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
        box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
      }
      .login-wrapper {
        height: 100%;
        background: #333;
      }
      .positronx {
        text-decoration: none;
        color: #ffffff;
      }
      .box {
        position: relative;
        top: 0;
        opacity: 1;
        float: left;
        padding: 60px 50px 40px 50px;
        width: 100%;
        background: #666;
        border-radius: 10px;
        transform: scale(1);
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        z-index: 5;
        max-width: 330px;
      }
      .box.back {
        transform: scale(0.95);
        -webkit-transform: scale(0.95);
        -ms-transform: scale(0.95);
        top: -20px;
        opacity: 0.8;
        z-index: -1;
      }
      .box:before {
        content: "";
        width: 100%;
        height: 30px;
        border-radius: 10px;
        position: absolute;
        top: -10px;
        background: rgba(51, 51, 51, 0.6);
        left: 0;
        transform: scale(0.95);
        -webkit-transform: scale(0.95);
        -ms-transform: scale(0.95);
        z-index: -1;
      }
      .login-wrapper .form {
        min-width: 100%;
        max-width: 300px;
        width: 100%;
      }
      .login-wrapper .full-width,
      .login-wrapper .btn-block {
        width: 100%;
      }
      .login-wrapper mat-card-header {
        text-align: center;
        width: 100%;
        display: block;
        font-weight: 700;
      }
      .login-wrapper mat-card-header mat-card-title {
        font-size: 30px;
        margin: 0;
      }
      .login-wrapper .mat-card {
        padding: 40px 70px 50px;
      }
      .login-wrapper .mat-stroked-button {
        border: 1px solid currentColor;
        line-height: 54px;
        background: #fff7fa;
      }
      .login-wrapper .mat-form-field-appearance-legacy .mat-form-field-infix {
        padding: 0.8375em 0;
      }
    `,
  ],
})
export class SignupPage implements OnInit {
  errorMessage = undefined;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async onSignup(form: any) {
    try {
      await this.authSrv.signup(form.value).toPromise();
      await this.authSrv.newWatchlist().toPromise();
      form.reset();
      this.errorMessage = undefined;
      this.router.navigate(["/login"]);
    } catch (error: any) {
      this.errorMessage = error.error;
      alert(this.errorMessage);
      console.error(this.errorMessage);
    }
  }
}
