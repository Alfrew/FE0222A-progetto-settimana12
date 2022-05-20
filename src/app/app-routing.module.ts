import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { MainPage } from "./components/main.page";

const routes: Routes = [
  {
    path: "",
    component: MainPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: "movies",
        loadChildren: () => import("./components/movies/movies.module").then((m) => m.MoviesModule),
      },
      {
        path: "user",
        loadChildren: () => import("./components/user/user.module").then((m) => m.UserModule),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "login",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
