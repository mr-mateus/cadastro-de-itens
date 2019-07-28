import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItensConsultaComponent } from './itens-consulta.component';


const routes: Routes = [
  {
    path: '',
    component: ItensConsultaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItensConsultaRoutingModule { }
