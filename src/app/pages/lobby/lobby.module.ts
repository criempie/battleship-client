import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayPageComponent } from './components/play-page/play-page.component';
import { LobbyRoutingModule } from 'src/app/pages/lobby/lobby-routing.module';
import { FieldComponent } from 'src/app/pages/lobby/components/field/field.component';
import { CellComponent } from 'src/app/pages/lobby/components/cell/cell.component';

@NgModule({
  declarations: [PlayPageComponent, FieldComponent, CellComponent],
  providers: [],
  imports: [CommonModule, LobbyRoutingModule],
})
export class LobbyModule {}
