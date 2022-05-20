import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule],
  exports: [CommonModule, RouterModule, HttpClientModule],
})
export class SharedModule {}
