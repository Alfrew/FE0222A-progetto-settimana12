import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { UserPage } from "./user.page";
import { MaterialModule } from "src/app/material.module";

@NgModule({
  declarations: [UserPage],
  imports: [CommonModule, UserRoutingModule, MaterialModule],
})
export class UserModule {}
