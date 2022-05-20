import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TokenInterceptor } from "./token.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SignupPage } from "./signup.page";
import { LoginPage } from "./login.page";
import { LoggedGuard } from "./logged.guard";
import { MaterialModule } from "../material.module";

@NgModule({
  declarations: [LoginPage, SignupPage],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: "login",
        component: LoginPage,
        canActivate: [LoggedGuard],
      },
      {
        path: "signup",
        component: SignupPage,
        canActivate: [LoggedGuard],
      },
    ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {}
