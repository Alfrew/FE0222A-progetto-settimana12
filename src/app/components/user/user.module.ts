import { UserPage } from "./user.page";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { UserRoutingModule } from "./user-routing.module";

@NgModule({
  declarations: [UserPage],
  imports: [CommonModule, UserRoutingModule, MaterialModule],
})
export class UserModule {}
