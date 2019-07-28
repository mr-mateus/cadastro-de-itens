import { NgModule } from '@angular/core';
import { ItensRoutingModule } from './itens-routing.module';
import { ItensService } from './itens.service';



@NgModule({
  declarations: [],
  imports: [
    ItensRoutingModule
  ],
  providers: [ItensService]

})
export class ItensModule { }
