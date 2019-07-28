import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ItensConsultaRoutingModule } from './itens-consulta-routing.module';
import { ItensConsultaComponent } from './itens-consulta.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

registerLocaleData(localePt);


@NgModule({
  declarations: [ItensConsultaComponent],
  imports: [
    CommonModule,
    ItensConsultaRoutingModule,
    MenuModule,
    BreadcrumbModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    }]
})
export class ItensConsultaModule { }
