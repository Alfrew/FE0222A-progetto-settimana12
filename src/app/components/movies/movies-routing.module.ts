import { InfoPage } from "./info.page";
import { NgModule } from "@angular/core";
import { MoviesPage } from "./movies.page";
import { RouterModule, Routes } from "@angular/router";
import { FavoritesMoviesPage } from "./favorites-movies.page";

const routes: Routes = [
  {
    path: "top",
    component: MoviesPage,
  },
  {
    path: "popular",
    component: MoviesPage,
  },
  {
    path: "favorites",
    component: FavoritesMoviesPage,
  },
  {
    path: "top/:id",
    component: InfoPage,
  },
  {
    path: "popular/:id",
    component: InfoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
