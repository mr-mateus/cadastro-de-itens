import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./itens-consulta/itens-consulta.module').then((m) => m.ItensConsultaModule)
    },
    {
        path: 'cadastro',
        loadChildren: () => import('./item-cadastro/item-cadastro.module').then((m) => m.ItemCadastroModule)
    }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItensRoutingModule { }
