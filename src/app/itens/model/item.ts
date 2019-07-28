export class Item {
    id?: number;
    nome: string;
    tipoUnidadeDeMedida: 1 | 2 | 3;
    unidadeDeMedida: number;
    perecivel: boolean;
    preco: number;
    dataDeValidade: Date;
    dataDeFabricacao: Date;
}
