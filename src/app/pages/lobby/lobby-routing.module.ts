import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePageComponent } from './components/create-page/create-page.component';
import { PlayPageComponent } from './components/play-page/play-page.component';

const routes: Routes = [
  { path: '', component: CreatePageComponent },
  { path: ':id', component: PlayPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LobbyRoutingModule {}
