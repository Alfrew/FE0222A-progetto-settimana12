import { NgModule } from "@angular/core";
import { LoginPage } from "./login.page";
import { SignupPage } from "./signup.page";
import { FormsModule } from "@angular/forms";
import { LoggedGuard } from "./logged.guard";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { TokenInterceptor } from "./token.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
@NgModule({
  declarations: [LoginPage, SignupPage],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
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
