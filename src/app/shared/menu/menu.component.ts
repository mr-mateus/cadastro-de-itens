import { Component, OnInit } from '@angular/core';

class MenuItemCustomizado {
  label: string;
  estaSelecionado: boolean;
  link: string;
  icone?: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItens: Array<MenuItemCustomizado> = [];
  constructor() { }

  ngOnInit() {
    this.menuItens = [
      {
        label: 'Consultar itens',
        estaSelecionado: false,
        link: '/itens',
      },
      {
        label: 'Cadastrar item',
        estaSelecionado: false,
        link: '/itens/cadastro',
        icone: 'pi pi-plus'
      }
    ];
  }
}
