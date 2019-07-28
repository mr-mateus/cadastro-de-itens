import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { localePt } from 'src/app/locales/pt';
import { ItensService } from '../itens.service';
import { Item } from '../model/item';

@Component({
  selector: 'app-item-cadastro',
  templateUrl: './item-cadastro.component.html',
  styleUrls: ['./item-cadastro.component.css']
})
export class ItemCadastroComponent implements OnInit{
  
  itemForm: FormGroup;
  breadcrumb: Array<MenuItem> = [];
  homePage: MenuItem;
  pt = localePt;
  tiposUnidadeDeMedida: SelectItem[];
  unidadeDeMedidaFormat = { prefix: '', thousands: '.', decimal: ',', precision: 0, nullable: true };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private itensService: ItensService) { }

  ngOnInit() {
    this.carregaFormulario();
    this.handleParams();
    this.carregaBreadCrumb();
    this.carregarUnidadesDeMedida();
    this.setDataDeValidadeValidators();
  }


  private handleParams() {
    if (this.activatedRoute.snapshot.params.id) {
      this.itensService.getItem(+this.activatedRoute.snapshot.params.id).subscribe(item => {
        const dataDeValidade = item.dataDeValidade ? new Date(item.dataDeValidade) : '';
        if (dataDeValidade instanceof Date) {
          dataDeValidade.setHours(0, 0, 0, 0);
        }

        const dataDeFabricacao = new Date(item.dataDeFabricacao);
        dataDeFabricacao.setHours(0, 0, 0, 0);
        this.itemForm.patchValue(
          {
            id: item.id,
            nome: item.nome,
            tipoUnidadeDeMedida: item.tipoUnidadeDeMedida,
            unidadeDeMedida: item.unidadeDeMedida,
            preco: item.preco,
            perecivel: item.perecivel,
            dataDeValidade,
            dataDeFabricacao
          }
        );
        this.mudaUnidadeDeMedida();
        this.itemForm.controls.unidadeDeMedida.enable();
      }, error => {
        this.router.navigate(['itens']);
      });
    }
  }

  salvar() {
    if (this.itemForm.valid) {
      const item = this.itemForm.value as Item;
      this.itensService.salvar(item)
        .subscribe(() => {
          this.router.navigate(['itens']);
        });
    } else {
      this.marcarTodosComoDirty();
    }
  }

  cancelar() {
    this.router.navigate(['itens']);
  }


  public mudaUnidadeDeMedida() {
    this.itemForm.controls.unidadeDeMedida.enable();

    switch (this.itemForm.controls.tipoUnidadeDeMedida.value) {
      case 1:
        this.unidadeDeMedidaFormat = { prefix: '', thousands: '.', decimal: ',', precision: 3, nullable: true };
        break;

      case 2:
        this.unidadeDeMedidaFormat = { prefix: '', thousands: '.', decimal: ',', precision: 3, nullable: true };
        break;

      case 3:
        this.unidadeDeMedidaFormat = { prefix: '', thousands: '.', decimal: ',', precision: 0, nullable: true };
        break;
    }
  }

  validadeEstaVencida() {
    if(this.itemForm.controls.dataDeValidade.value){
      const dataDeValidade = new Date(this.itemForm.controls.dataDeValidade.value);
      if(dataDeValidade) {
        dataDeValidade.setHours(0, 0, 0, 0);
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);
        return dataDeValidade.getTime() < dataAtual.getTime();
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private marcarTodosComoDirty() {
    Object.keys(this.itemForm.controls).forEach(key => {
      this.itemForm.get(key).markAsDirty();
    });
  }

  private setDataDeValidadeValidators() {
    const dataDeValidadeControl = this.itemForm.get('dataDeValidade');
    this.itemForm.get('perecivel').valueChanges
      .subscribe(perecivel => {
        if (perecivel) {
          dataDeValidadeControl.setValidators(Validators.required);
        } else {
          dataDeValidadeControl.setValidators(null);
        }
        dataDeValidadeControl.updateValueAndValidity();
      });
  }


  private carregarUnidadesDeMedida() {
    this.tiposUnidadeDeMedida = [
      { label: 'Litro', value: 1 },
      { label: 'Quilograma', value: 2 },
      { label: 'Unidade', value: 3 }
    ];
  }

  private carregaFormulario() {
    this.itemForm = this.fb.group({
      id: [''],
      nome: ['', Validators.compose([
        Validators.required, Validators.maxLength(50)
      ])],
      tipoUnidadeDeMedida: ['', Validators.compose([
        Validators.required
      ])],
      unidadeDeMedida: new FormControl({ value: null, disabled: true }, Validators.compose([
        Validators.required
      ])),
      preco: ['', Validators.compose([
        Validators.required
      ])],
      perecivel: [false, Validators.compose([
        Validators.required
      ])],
      dataDeValidade: [''],
      dataDeFabricacao: ['', Validators.compose([
        Validators.required,
      ])]
    }, { validator: dataDeFabricacaoMaiorQueDataDeValidadeValidator });
  }

  private carregaBreadCrumb() {
    this.breadcrumb = [
      { label: 'Cadastrar Item' }
    ];

    this.homePage = { icon: 'pi pi-home', routerLink: ['/'] };
  }
}

function dataDeFabricacaoMaiorQueDataDeValidadeValidator(fg: FormGroup): { [key: string]: boolean } | null {
  const dataDeValidade = new Date(fg.get('dataDeValidade').value);
  if (!fg.get('dataDeValidade').value) {
    return null;
  } else {
    dataDeValidade.setHours(0, 0, 0, 0);
    const dataDeFabricacao = new Date(fg.get('dataDeFabricacao').value);
    dataDeFabricacao.setHours(0, 0, 0, 0);
    if (dataDeFabricacao.getTime() > dataDeValidade.getTime()) {
      fg.get('dataDeFabricacao').setErrors({ dataDeFabricacaoMaiorQueDataDeValidade: true });
      return { dataDeFabricacaoMaiorQueDataDeValidade: true };
    }
    return null;
  }
}
