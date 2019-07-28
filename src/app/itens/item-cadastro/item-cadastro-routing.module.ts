import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemCadastroComponent } from './item-cadastro.component';


const routes: Routes = [
  {
      path: '',
      component: ItemCadastroComponent
  },
  {
      path: ':id',
      component: ItemCadastroComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemCadastroRoutingModule { }
