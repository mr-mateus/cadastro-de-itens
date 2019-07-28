import { async, ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { ItemCadastroComponent } from './item-cadastro.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemCadastroRoutingModule } from './item-cadastro-routing.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { NgxCurrencyModule } from 'ngx-currency';
import { CheckboxModule } from 'primeng/checkbox';
import { click } from 'src/test-utils/click-element';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { Item } from '../model/item';
import { ItensService } from '../itens.service';

class ItemCadastroComponentPage {
  get botaoCancelar() {
    return this.query('[name=botaoCancelar]');
  }

  get botaoSalvar() {
    return this.query('[name=botaoSalvar]');
  }

  get messageNomeObrigatorio() {
    return this.query('[name=messageNomeObrigatorio]');
  }

  get messageTipoUnidadeDeMedidaObrigatorio() {
    return this.query('[name=messageTipoUnidadeDeMedidaObrigatorio]');
  }

  get messageUnidadeDeMedidaObrigatorio() {
    return this.query('[name=messageUnidadeDeMedidaObrigatorio]');
  }

  get messagePrecoObrigatorio() {
    return this.query('[name=messagePrecoObrigatorio]');
  }

  get messageDataDeValidadeObrigatorio() {
    return this.query('[name=messageDataDeValidadeObrigatorio]');
  }

  get messageDataDeValidadeVencida() {
    return this.query('[name=messageDataDeValidadeVencida]');
  }

  get messageDataDeFabricacaoMaiorQueDataDeValidade() {
    return this.query('[name=messageDataDeFabricacaoMaiorQueDataDeValidade]');
  }

  get messageDataDeFabricacaoObrigatorio() {
    return this.query('[name=messageDataDeFabricacaoObrigatorio]');
  }

  get tpLt() {
    return this.query('[name=tpLt]');
  }

  get tpKg() {
    return this.query('[name=tpKg]');
  }

  get tpUn() {
    return this.query('[name=tpUn]');
  }

  constructor(
    private fixture: ComponentFixture<ItemCadastroComponent>
  ) { }

  clicarBotaoCancelar() {
    click(this.botaoCancelar);
  }

  clicarBotaoSalvar() {
    click(this.botaoSalvar);
  }

  private query(selector: string): any {
    return this.fixture.nativeElement.querySelector(selector);
  }

  private queryAll(selector: string): Array<any> {
    return this.fixture.nativeElement.querySelectorAll(selector);
  }
}

@Component({ template: 'Itens' })
export class ItensConsultaMockComponent { }

export const routes: Routes = [
  { path: '', redirectTo: 'itens', pathMatch: 'full' },
  { path: 'itens', component: ItensConsultaMockComponent },
  { path: 'itens/cadastro', component: ItemCadastroComponent },
  { path: 'itens/cadastro/:id', component: ItemCadastroComponent }
];

describe('ItemCadastroComponent', () => {
  let component: ItemCadastroComponent;
  let fixture: ComponentFixture<ItemCadastroComponent>;
  let itemCadastroComponentPage: ItemCadastroComponentPage;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
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
      ],
      declarations: [
        ItemCadastroComponent,
        ItensConsultaMockComponent
      ],
      providers: [ItensService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCadastroComponent);

    router = TestBed.get(Router);

    itemCadastroComponentPage = new ItemCadastroComponentPage(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixture.ngZone.run(() => {
      router.initialNavigation();
    });
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve redirecionar para a página de listagem', fakeAsync(() => {
    spyOn(router, 'navigate').and.callThrough();
    fixture.ngZone.run(() => {
      itemCadastroComponentPage.clicarBotaoCancelar();
      fixture.detectChanges();
      flush();
      expect(router.navigate).toHaveBeenCalledWith(['itens']);
    });
  }));

  describe('edição de item', () => {
    it('deve redirecionar para a página de listagem caso o item não seja encontrado', fakeAsync(() => {
      const activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      activatedRoute.snapshot.params = { id: 9999 };
      spyOn(router, 'navigate').and.callThrough();
      fixture.ngZone.run(() => {
        component.ngOnInit();
        fixture.detectChanges();
        flush();
      });
      expect(router.navigate).toHaveBeenCalledWith(['itens']);
    }));

    it('deve apresentar o item e editar', fakeAsync(() => {
      const activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      activatedRoute.snapshot.params = { id: 1 };
      const item: Item = {
        id: 1,
        nome: 'teste',
        perecivel: false,
        dataDeFabricacao: new Date(),
        dataDeValidade: null,
        preco: 100,
        tipoUnidadeDeMedida: 1,
        unidadeDeMedida: 90
      };

      spyOnLocalStorage('itens', JSON.stringify([item]));
      component.ngOnInit();
      fixture.detectChanges();
      flush();
      component.itemForm.controls.nome.setValue('alterado');
      fixture.detectChanges();
      flush();

      spyOn(router, 'navigate').and.callThrough();
      fixture.ngZone.run(() => {
        itemCadastroComponentPage.clicarBotaoSalvar();
        fixture.detectChanges();
        flush();
      });
      expect(router.navigate).toHaveBeenCalledWith(['itens']);
      const itens = JSON.parse(localStorage.getItem('itens')) as Array<Item>;
      const itemAlterado = itens[0];
      expect(itemAlterado.nome).toEqual('alterado');
    }));

    it('deve apresentar o item e editar a data de validade', fakeAsync(() => {
      const activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      activatedRoute.snapshot.params = { id: 1 };
      const item: Item = {
        id: 1,
        nome: 'teste',
        perecivel: false,
        dataDeFabricacao: new Date(),
        dataDeValidade: new Date(),
        preco: 100,
        tipoUnidadeDeMedida: 1,
        unidadeDeMedida: 90
      };

      spyOnLocalStorage('itens', JSON.stringify([item]));
      component.ngOnInit();
      fixture.detectChanges();
      flush();
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      component.itemForm.controls.dataDeValidade.setValue(amanha);
      fixture.detectChanges();
      flush();

      spyOn(router, 'navigate').and.callThrough();
      fixture.ngZone.run(() => {
        itemCadastroComponentPage.clicarBotaoSalvar();
        fixture.detectChanges();
        flush();
      });
      expect(router.navigate).toHaveBeenCalledWith(['itens']);
      const itens = JSON.parse(localStorage.getItem('itens')) as Array<Item>;
      const itemAlterado = itens[0];
      expect(new Date(itemAlterado.dataDeValidade).getDate()).toEqual(new Date().getDate() + 1);
    }));
  });

  describe('formulario válido', () => {
    beforeEach(() => {
      spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    });
    it('deve salvar os dados quando o produto não for perecível e não for informado data de validade', fakeAsync(() => {
      spyOn<any>(component['itensService'], 'salvar').and.callFake(() => of(undefined));

      component.itemForm.controls.nome.setValue('teste');
      component.itemForm.controls.nome.markAsDirty();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(1);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      component.itemForm.controls.unidadeDeMedida.setValue('10');
      component.itemForm.controls.unidadeDeMedida.markAsDirty();
      component.itemForm.controls.preco.setValue('100');
      component.itemForm.controls.preco.markAsDirty();
      component.itemForm.controls.dataDeFabricacao.setValue(new Date());
      component.itemForm.controls.dataDeFabricacao.markAsDirty();
      fixture.detectChanges();
      flush();

      itemCadastroComponentPage.clicarBotaoSalvar();

      fixture.detectChanges();
      flush();

      expect(component['itensService'].salvar).toHaveBeenCalled();
    }));

    it('deve salvar os dados quando o produto não for perecível e for informado data de validade', fakeAsync(() => {
      spyOn(component['itensService'], 'salvar').and.callFake(() => of(undefined));

      component.itemForm.controls.nome.setValue('teste');
      component.itemForm.controls.nome.markAsDirty();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(1);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      component.itemForm.controls.unidadeDeMedida.setValue('10');
      component.itemForm.controls.unidadeDeMedida.markAsDirty();
      component.itemForm.controls.preco.setValue('100');
      component.itemForm.controls.preco.markAsDirty();
      component.itemForm.controls.dataDeValidade.setValue(new Date());
      component.itemForm.controls.dataDeValidade.markAsDirty();
      component.itemForm.controls.dataDeFabricacao.setValue(new Date());
      component.itemForm.controls.dataDeFabricacao.markAsDirty();
      fixture.detectChanges();
      flush();

      itemCadastroComponentPage.clicarBotaoSalvar();

      fixture.detectChanges();
      flush();

      expect(component['itensService'].salvar).toHaveBeenCalled();
    }));

    it('deve salvar os dados quando o produto for perecível e for informado data de validade', fakeAsync(() => {
      spyOn(component['itensService'], 'salvar').and.callFake(() => of(undefined));

      component.itemForm.controls.nome.setValue('teste');
      component.itemForm.controls.nome.markAsDirty();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(1);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      component.itemForm.controls.unidadeDeMedida.setValue('10');
      component.itemForm.controls.unidadeDeMedida.markAsDirty();
      component.itemForm.controls.preco.setValue('100');
      component.itemForm.controls.preco.markAsDirty();
      component.itemForm.controls.perecivel.setValue(true);
      component.itemForm.controls.perecivel.markAsDirty();
      component.itemForm.controls.dataDeValidade.setValue(new Date());
      component.itemForm.controls.dataDeValidade.markAsDirty();
      component.itemForm.controls.dataDeFabricacao.setValue(new Date());
      component.itemForm.controls.dataDeFabricacao.markAsDirty();
      fixture.detectChanges();
      flush();

      itemCadastroComponentPage.clicarBotaoSalvar();

      fixture.detectChanges();
      flush();

      expect(component['itensService'].salvar).toHaveBeenCalled();
    }));

    it('deve salvar os dados quando o produto for perecível e estiver vencido', fakeAsync(() => {
      spyOn(component['itensService'], 'salvar').and.callFake(() => of(undefined));

      component.itemForm.controls.nome.setValue('teste');
      component.itemForm.controls.nome.markAsDirty();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(1);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      component.itemForm.controls.unidadeDeMedida.setValue('10');
      component.itemForm.controls.unidadeDeMedida.markAsDirty();
      component.itemForm.controls.preco.setValue('100');
      component.itemForm.controls.preco.markAsDirty();
      component.itemForm.controls.perecivel.setValue(true);
      component.itemForm.controls.perecivel.markAsDirty();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      component.itemForm.controls.dataDeValidade.setValue(yesterday);
      component.itemForm.controls.dataDeValidade.markAsDirty();
      component.itemForm.controls.dataDeFabricacao.setValue(yesterday);
      component.itemForm.controls.dataDeFabricacao.markAsDirty();
      fixture.detectChanges();
      flush();

      expect(itemCadastroComponentPage.messageDataDeValidadeVencida).toBeTruthy();

      itemCadastroComponentPage.clicarBotaoSalvar();

      fixture.detectChanges();
      flush();

      expect(component['itensService'].salvar).toHaveBeenCalled();
    }));

    it('deve salvar os dados quando o produto for desmarcado o campo percivel e não for informado a data de validade', fakeAsync(() => {
      spyOn(component['itensService'], 'salvar').and.callFake(() => of(undefined));

      component.itemForm.controls.nome.setValue('teste');
      component.itemForm.controls.nome.markAsDirty();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(1);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      component.itemForm.controls.unidadeDeMedida.setValue('10');
      component.itemForm.controls.unidadeDeMedida.markAsDirty();
      component.itemForm.controls.preco.setValue('100');
      component.itemForm.controls.preco.markAsDirty();
      component.itemForm.controls.perecivel.setValue(true);
      component.itemForm.controls.perecivel.markAsDirty();

      component.itemForm.controls.dataDeValidade.setValue('');
      component.itemForm.controls.dataDeValidade.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageDataDeValidadeObrigatorio).toBeTruthy();

      // quando checkbox percivel for desmarcado deve permitir salvar os dados
      component.itemForm.controls.perecivel.setValue(false);
      component.itemForm.controls.perecivel.markAsDirty();

      component.itemForm.controls.dataDeFabricacao.setValue(new Date());
      component.itemForm.controls.dataDeFabricacao.markAsDirty();
      fixture.detectChanges();
      flush();

      itemCadastroComponentPage.clicarBotaoSalvar();

      fixture.detectChanges();
      flush();

      expect(component['itensService'].salvar).toHaveBeenCalled();
    }));
  });


  it('não deve salvar os dados quando o formulario estiver invalido', fakeAsync(() => {
    spyOn(component['itensService'], 'salvar').and.callFake(() => of(undefined));
    itemCadastroComponentPage.clicarBotaoSalvar();
    fixture.detectChanges();
    flush();
    expect(component['itensService'].salvar).not.toHaveBeenCalled();
    expect(itemCadastroComponentPage.messageNomeObrigatorio).toBeTruthy();
    expect(itemCadastroComponentPage.messageTipoUnidadeDeMedidaObrigatorio).toBeTruthy();
    expect(itemCadastroComponentPage.messageUnidadeDeMedidaObrigatorio).toBeNull();
    expect(itemCadastroComponentPage.messagePrecoObrigatorio).toBeTruthy();
    expect(itemCadastroComponentPage.messageDataDeValidadeObrigatorio).toBeNull();
    expect(itemCadastroComponentPage.messageDataDeFabricacaoObrigatorio).toBeTruthy();
  }));

  describe('formularios invalidos', () => {
    afterEach(fakeAsync(() => {
      spyOn<any>(component['itensService'], 'salvar').and.callFake(() => of(undefined));
      itemCadastroComponentPage.clicarBotaoSalvar();
      flush();
      expect(component['itensService'].salvar).not.toHaveBeenCalled();
    }));

    it('deve informar que o nome é obrigatório', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      component.itemForm.controls.nome.setValue('');
      component.itemForm.controls.nome.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageNomeObrigatorio).toBeTruthy();
    }));

    it('deve informar que o tipo de unidade de medida é obtigatório', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(null);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageTipoUnidadeDeMedidaObrigatorio).toBeTruthy();
    }));

    it('unidade de medida deve ser "lt" e deve informar que a unidade de medida é obtigatório', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(1);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      component.mudaUnidadeDeMedida();
      fixture.detectChanges();
      flush();
      component.itemForm.controls.unidadeDeMedida.setValue('');
      component.itemForm.controls.unidadeDeMedida.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageUnidadeDeMedidaObrigatorio).toBeTruthy();
      expect(itemCadastroComponentPage.tpUn).toBeNull();
      expect(itemCadastroComponentPage.tpKg).toBeNull();
      expect(itemCadastroComponentPage.tpLt).toBeTruthy();
    }));

    it('unidade de medida deve ser "kg" e deve informar que a unidade de medida é obrigatório', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(2);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      component.mudaUnidadeDeMedida();
      fixture.detectChanges();
      flush();
      component.itemForm.controls.unidadeDeMedida.setValue('');
      component.itemForm.controls.unidadeDeMedida.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageUnidadeDeMedidaObrigatorio).toBeTruthy();
      expect(itemCadastroComponentPage.tpLt).toBeNull();
      expect(itemCadastroComponentPage.tpUn).toBeNull();
      expect(itemCadastroComponentPage.tpKg).toBeTruthy();
    }));

    it('unidade de medida deve ser "un" e deve informar que a unidade de medida é obrigatório', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      component.itemForm.controls.tipoUnidadeDeMedida.setValue(3);
      component.itemForm.controls.tipoUnidadeDeMedida.markAsDirty();
      component.mudaUnidadeDeMedida();
      fixture.detectChanges();
      flush();
      component.itemForm.controls.unidadeDeMedida.setValue('');
      component.itemForm.controls.unidadeDeMedida.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageUnidadeDeMedidaObrigatorio).toBeTruthy();
      expect(itemCadastroComponentPage.tpKg).toBeNull();
      expect(itemCadastroComponentPage.tpLt).toBeNull();
      expect(itemCadastroComponentPage.tpUn).toBeTruthy();
    }));

    it('deve informar que a preço é obrigatório', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      component.itemForm.controls.preco.setValue('');
      component.itemForm.controls.preco.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messagePrecoObrigatorio).toBeTruthy();
    }));

    it('deve informar que a data de validade do item esta vencida e o campo deve continuar valido', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      component.itemForm.controls.dataDeValidade.setValue(yesterday);
      component.itemForm.controls.dataDeValidade.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageDataDeValidadeVencida).toBeTruthy();
      expect(component.itemForm.controls.dataDeValidade.valid).toBeTruthy();
    }));

    it('quando o item for perecivel deve informar que a data de validade é obrigatória', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      const today = new Date();
      component.itemForm.controls.perecivel.setValue(true);
      component.itemForm.controls.dataDeValidade.setValue(null);
      component.itemForm.controls.dataDeValidade.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageDataDeValidadeObrigatorio).toBeTruthy();
      expect(component.itemForm.controls.dataDeValidade.errors).toBeTruthy();
    }));

    it('deve informar que a data de fabricação é obrigatória', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      component.itemForm.controls.dataDeFabricacao.setValue(null);
      component.itemForm.controls.dataDeFabricacao.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageDataDeFabricacaoObrigatorio).toBeTruthy();
      expect(component.itemForm.controls.dataDeFabricacao.errors).toBeTruthy();
    }));

    fit('deve informar que a data de fabricação não pode ser menor que a data de validade', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      component.itemForm.controls.dataDeValidade.setValue(yesterday);
      component.itemForm.controls.dataDeValidade.markAsDirty();
      fixture.detectChanges();
      flush();
      component.itemForm.controls.dataDeFabricacao.setValue(today);
      component.itemForm.controls.dataDeFabricacao.markAsDirty();
      fixture.detectChanges();
      flush();
      expect(itemCadastroComponentPage.messageDataDeFabricacaoMaiorQueDataDeValidade).toBeTruthy();
      expect(component.itemForm.controls.dataDeFabricacao.errors).toBeTruthy();
    }));
  });
});

export function spyOnLocalStorage(keyAccess: string, valueString: string): void {
  let store = {};
  store[keyAccess] = valueString;

  spyOn(localStorage, 'getItem').and.callFake((key: string): string => {
    return store[key] || null;
  });
  spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
    delete store[key];
  });
  spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
    return store[key] = value as string;
  });
  spyOn(localStorage, 'clear').and.callFake(() => {
    store = {};
  });
}
