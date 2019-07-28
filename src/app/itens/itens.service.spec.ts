import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { ItensService } from './itens.service';
import { Item } from './model/item';


describe('ItensService', () => {
  let service: ItensService;
  beforeEach(() => {
    spyOnLocalStorage();
    service = TestBed.get(ItensService);
  });

  it('deve instanciar o serviço', () => {
    expect(service).toBeTruthy();
  });

  it('deve incluir o registro no localStorage', fakeAsync(() => {
    let item: Item;
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 1,
      unidadeDeMedida: 90
    }).subscribe(itemSalvo => {
      item = itemSalvo;
    });

    flush();

    expect(item.id).toEqual(1);
    const itens = JSON.parse(localStorage.getItem('itens')) as Array<Item>;
    expect(itens.length).toEqual(1);
  }));

  it('deve editar o registro já existente do localStorage', fakeAsync(() => {
    let item: Item;
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 1,
      unidadeDeMedida: 90
    }).subscribe(itemSalvo => {
      item = itemSalvo;
    });
    flush();
    service.salvar({
      nome: 'teste 2',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 1,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    item.nome = 'alterado';
    service.salvar(item).subscribe(itemAtualizado => {
      item = itemAtualizado;
    });
    flush();
    expect(item.id).toEqual(1);
    expect(item.nome).toEqual('alterado');
    const itens = JSON.parse(localStorage.getItem('itens')) as Array<Item>;
    expect(itens.length).toEqual(2);
  }));

  it('deve retornar um array vazio quando não houver itens no localStorage', fakeAsync(() => {
    let itens: any;
    service.getItens().subscribe(itensStored => {
      itens = itensStored;
    });
    tick(1000);
    expect(itens.length).toEqual(0);
  }));

  it('deve deletar o registro localStorage', fakeAsync(() => {
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 1,
      unidadeDeMedida: 90
    }).subscribe();

    flush();

    let itens = JSON.parse(localStorage.getItem('itens')) as Array<Item>;
    expect(itens.length).toEqual(1);
    service.deleteItem(1).subscribe();
    flush();
    itens = JSON.parse(localStorage.getItem('itens')) as Array<Item>;
    expect(itens.length).toEqual(0);
  }));

  it('deve lançar um erro quando o item não for encontrado para exclusão', fakeAsync(() => {
    // localStorage está sem itens
    expect(() => {
      service.deleteItem(2).subscribe();
      flush();
    }).toThrowError();
  }));

  it('deve retornar um item perecivel', fakeAsync(() => {
    service.salvar({
      nome: 'teste',
      perecivel: true,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 1,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    let itens: any;
    service.getItens().subscribe(itensStored => {
      itens = itensStored;
    });
    tick(1000);

    expect(itens[0].perecivel).toEqual('Sim');
  }));

  it('deve retornar um item não perecivel', fakeAsync(() => {
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 1,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    let itens: any;
    service.getItens().subscribe(itensStored => {
      itens = itensStored;
    });
    tick(1000);

    expect(itens[0].perecivel).toEqual('Não');
  }));

  it('deve retornar um item com a unidade de medida igual a Lt', fakeAsync(() => {
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 1,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    let itens: any;
    service.getItens().subscribe(itensStored => {
      itens = itensStored;
    });
    tick(1000);

    expect(itens[0].unidadeDeMedida).toEqual('90 Lt');
  }));

  it('deve retornar um item com a unidade de medida igual a Kg', fakeAsync(() => {
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 2,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    let itens: any;
    service.getItens().subscribe(itensStored => {
      itens = itensStored;
    });
    tick(1000);

    expect(itens[0].unidadeDeMedida).toEqual('90 Kg');
  }));

  it('deve retornar um item com a unidade de medida igual a Un', fakeAsync(() => {
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: new Date(),
      dataDeValidade: null,
      preco: 100,
      tipoUnidadeDeMedida: 3,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    let itens: any;
    service.getItens().subscribe(itensStored => {
      itens = itensStored;
    });
    tick(1000);

    expect(itens[0].unidadeDeMedida).toEqual('90 Un');
  }));

  it('deve retornar um item data de validade', fakeAsync(() => {
    const hoje = new Date();
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: hoje,
      dataDeValidade: hoje,
      preco: 100,
      tipoUnidadeDeMedida: 3,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    let itens: any;
    service.getItens().subscribe(itensStored => {
      itens = itensStored;
    });
    tick(1000);

    expect(itens[0].dataDeValidade.toLocaleDateString()).toEqual(hoje.toLocaleDateString());
  }));

  it('deve retornar o item com id 2', fakeAsync(() => {
    const hoje = new Date();
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: hoje,
      dataDeValidade: hoje,
      preco: 100,
      tipoUnidadeDeMedida: 3,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    service.salvar({
      nome: 'teste 2',
      perecivel: false,
      dataDeFabricacao: hoje,
      dataDeValidade: hoje,
      preco: 100,
      tipoUnidadeDeMedida: 3,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    let item: Item;
    service.getItem(2).subscribe(itemStored => {
      item = itemStored;
    });

    expect(item.nome).toEqual('teste 2');
  }));

  it('deve retornar erro quando o item não for encontrado', fakeAsync(() => {
    const hoje = new Date();
    service.salvar({
      nome: 'teste',
      perecivel: false,
      dataDeFabricacao: hoje,
      dataDeValidade: hoje,
      preco: 100,
      tipoUnidadeDeMedida: 3,
      unidadeDeMedida: 90
    }).subscribe();
    flush();

    expect(() => { service.getItem(99).subscribe(); flush(); }).toThrowError();
  }));
});


export function spyOnLocalStorage(): void {
  let store = {};

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
