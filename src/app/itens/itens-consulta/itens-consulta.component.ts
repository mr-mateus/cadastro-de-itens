import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ItensService } from '../itens.service';

@Component({
  selector: 'app-itens-consulta',
  templateUrl: './itens-consulta.component.html',
  styleUrls: ['./itens-consulta.component.css']
})
export class ItensConsultaComponent implements OnInit {
  breadcrumb = [];
  homePage;

  colunas = [
    { field: 'nome', header: 'Nome' },
    { field: 'unidadeDeMedida', header: 'Quantidade' },
    { field: 'preco', header: 'Preço' },
    { field: 'perecivel', header: 'Perecível' },
    { field: 'dataDeValidade', header: 'Validade' },
    { field: 'dataDeFabricacao', header: 'Fabricação' },
    { header: 'Ações' }
  ];

  itens: Array<any> = [];

  constructor(
    private itensService: ItensService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit() {
    this.carregaBreadcrumb();
    this.carregaItens();
  }

  novoItem() {
    this.router.navigate(['itens/cadastro']);
  }

  public editar(id: number) {
    this.router.navigate([`itens/cadastro/${id}`]);
  }

  public excluir(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esse item?',
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.itensService.deleteItem(id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Item excluído'
          });
          this.carregaItens();
        });
      }
    });
  }

  private carregaItens() {
    this.itensService.getItens().subscribe(itens => {
      this.itens = itens;
    });
  }

  private carregaBreadcrumb() {
    this.breadcrumb = [
      { label: 'Consultar Itens' }
    ];

    this.homePage = { icon: 'pi pi-home', routerLink: ['/'] };
  }
}
