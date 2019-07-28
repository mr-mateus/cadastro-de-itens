import { CommonModule, registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ItensConsultaRoutingModule } from './itens-consulta-routing.module';
import { ItensConsultaComponent } from './itens-consulta.component';
import { MenuComponent } from 'src/app/shared/menu/menu.component';
import { click } from 'src/test-utils/click-element';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ItensConsultaComponent', () => {
  let component: ItensConsultaComponent;
  let fixture: ComponentFixture<ItensConsultaComponent>;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItensConsultaComponent,
        MenuComponent],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        RouterTestingModule,
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
        ConfirmationService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItensConsultaComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve apresentar a unidade de medida Lt', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 1,
      unidadeDeMedida: 90
    }]));

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody tr').querySelectorAll('td')[1].innerText).toEqual('90 Lt');
  }));

  it('deve apresentar a unidade de medida Kg', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 2,
      unidadeDeMedida: 90
    }]));

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody tr').querySelectorAll('td')[1].innerText).toEqual('90 Kg');
  }));

  it('deve apresentar a unidade de medida Un', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 3,
      unidadeDeMedida: 90
    }]));

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody tr').querySelectorAll('td')[1].innerText).toEqual('90 Un');
  }));

  it('deve redirecionar para itens/cadastro/1', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{
      id: 1,
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 3,
      unidadeDeMedida: 90
    }]));

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const botaoEditar = fixture.nativeElement.querySelector('tbody tr').querySelectorAll('td button')[0];
    click(botaoEditar);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['itens/cadastro/1']);
  }));

  it('deve excluir um registro', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{
      id: 333,
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 3,
      unidadeDeMedida: 90
    }]));

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    spyOn(component['itensService'], 'deleteItem').and.returnValue(of(undefined));
    const botaoExcluir = fixture.nativeElement.querySelector('tbody tr').querySelectorAll('td button')[1];
    click(botaoExcluir);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    const confirmarExcluir = fixture.nativeElement.querySelectorAll('p-confirmdialog button')[0];
    click(confirmarExcluir);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    expect(component['itensService'].deleteItem).toHaveBeenCalledWith(333);
  }));

  it('deve redirecionar para a página de cadastro', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.novoItem();
    flush();
    expect(router.navigate).toHaveBeenCalledWith(['itens/cadastro']);
  }));
});
