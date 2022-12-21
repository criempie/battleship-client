import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayPageComponent } from './components/play-page/play-page.component';
import { LobbyRoutingModule } from 'src/app/pages/lobby/lobby-routing.module';
import { FieldComponent } from 'src/app/pages/lobby/components/field/field.component';
import { CellComponent } from 'src/app/pages/lobby/components/cell/cell.component';
import { CookieService } from 'ngx-cookie-service';
import { CreatePageComponent } from './components/create-page/create-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PlayPageComponent,
    FieldComponent,
    CellComponent,
    CreatePageComponent,
  ],
  providers: [CookieService],
  imports: [CommonModule, LobbyRoutingModule],
})
export class LobbyModule {}
