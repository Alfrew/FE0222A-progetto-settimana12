import { InfoPage } from "./info.page";
import { NgModule } from "@angular/core";
import { MoviesPage } from "./movies.page";
import { MaterialModule } from "src/app/material.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MoviesRoutingModule } from "./movies-routing.module";
import { FavoritesMoviesPage } from "./favorites-movies.page";

@NgModule({
  declarations: [FavoritesMoviesPage, MoviesPage, InfoPage],
  imports: [MoviesRoutingModule, MaterialModule, SharedModule],
})
export class MoviesModule {}
