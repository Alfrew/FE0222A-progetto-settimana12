import { InfoPage } from "./info.page";
import { NgModule } from "@angular/core";
import { MoviesPage } from "./movies.page";
import { RouterModule, Routes } from "@angular/router";
import { FavoritesMoviesPage } from "./favorites-movies.page";

const routes: Routes = [
  {
    path: "popular",
    component: MoviesPage,
  },
  {
    path: "top",
    component: MoviesPage,
  },
  {
    path: "favorites",
    component: FavoritesMoviesPage,
  },
  {
    path: "popular/:id",
    component: InfoPage,
  },
  {
    path: "top/:id",
    component: InfoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
