import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { MainPage } from "./components/main.page";
import { MaterialModule } from "./material.module";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [AppComponent, MainPage],
  imports: [BrowserModule, BrowserAnimationsModule, AuthModule, AppRoutingModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
