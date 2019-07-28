import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyModule } from 'ngx-currency';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ItemCadastroRoutingModule } from './item-cadastro-routing.module';
import { ItemCadastroComponent } from './item-cadastro.component';

@NgModule({
  declarations: [ItemCadastroComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ItemCadastroRoutingModule,
    BreadcrumbModule,
    ButtonModule,
    MessageModule,
    InputTextModule,
    SelectButtonModule,
    CalendarModule,
    NgxCurrencyModule,
    CheckboxModule
  ]
})
export class ItemCadastroModule { }
