import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'itens',
    loadChildren: () => import('./itens/itens.module').then((m) => m.ItensModule)
  },
  {
    path: '',
    redirectTo: '/itens',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
