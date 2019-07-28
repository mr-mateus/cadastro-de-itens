import { Injectable } from '@angular/core';
import { Item } from './model/item';
import { of, Observable, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItensService {

  constructor() { }

  salvar(item: Item): Observable<Item> {
    let itens = JSON.parse(localStorage.getItem('itens')) ? JSON.parse(localStorage.getItem('itens')) as Array<Item> : [] as Array<Item>;
    if (item.id) {
      itens = itens.map((itemArray) => {
        return +item.id === +itemArray.id ? item : itemArray;
      });
    } else {
      item.id = itens.length + 1;
      itens.push(item);
    }
    localStorage.setItem('itens', JSON.stringify(itens));
    return of(item);
  }

  getItem(id: number): Observable<Item> {
    const itens = JSON.parse(localStorage.getItem('itens')) ? JSON.parse(localStorage.getItem('itens')) as Array<Item> : [] as Array<Item>;
    const itemFound = itens.find(item => +item.id === +id);
    if (itemFound) {
      return of(itemFound);
    } else {
      return throwError(new Error('item não encontrado'));
    }
  }

  getItens(): Observable<Array<any>> {
    const itensStored = JSON
    .parse(localStorage.getItem('itens')) ? JSON.parse(localStorage.getItem('itens')) as Array<Item> : [] as Array<Item>;
    return of(itensStored)
      .pipe(
        delay(1000),
        map(itens => {
          const itensTransform = itens.map(item => {
            const tipoDeUnidadeDeMedidaLabel = item.tipoUnidadeDeMedida === 1 ? 'Lt' : item.tipoUnidadeDeMedida === 2 ? 'Kg' : 'Un';
            const unidadeDeMedidaLabel = item.unidadeDeMedida.toString().replace('.', ',');
            return {
              id: item.id,
              nome: item.nome,
              perecivel: item.perecivel ? 'Sim' : 'Não',
              dataDeValidade: item.dataDeValidade ? new Date(item.dataDeValidade) : null,
              dataDeFabricacao: new Date(item.dataDeFabricacao),
              tipoDeUnidadeDeMedida: tipoDeUnidadeDeMedidaLabel,
              unidadeDeMedida: `${unidadeDeMedidaLabel} ${tipoDeUnidadeDeMedidaLabel}`,
              preco: item.preco
            };
          });
          return itensTransform;
        })
      );
  }

  deleteItem(id: number): Observable<void> {
    let itens = JSON.parse(localStorage.getItem('itens')) ? JSON.parse(localStorage.getItem('itens')) as Array<Item> : [] as Array<Item>;
    const deletedItem = itens.find(item => +item.id === +id);
    if (deletedItem) {
      itens = itens.filter(item => +item.id !== +id);
      localStorage.setItem('itens', JSON.stringify(itens));
      return of(undefined);
    } else {
      return throwError(new Error('Item não encontrado'));
    }
  }
}
