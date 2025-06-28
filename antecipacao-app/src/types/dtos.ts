export enum RamoEmpresa {
  Servicos = 1,
  Produtos = 2,
}

export interface Empresa {
  id: number;
  cnpj: string;
  nome: string;
  faturamentoMensal: number;
  ramo: RamoEmpresa;
  limiteCredito: number;
}

export interface CriarEmpresa {
  cnpj: string;
  nome: string;
  faturamentoMensal: number;
  ramo: RamoEmpresa;
}

export interface NotaFiscal {
  id: number;
  numeroNota: string;
  valor: number;
  dataVencimento: string;
  empresaId: number;
  estaNaAntecipacao: boolean;
  valorLiquido: number;
}

export interface CriarNotaFiscal {
  numeroNota: string;
  valor: number;
  dataVencimento: string;
  empresaId: number;
}

export interface CarrinhoAntecipacao {
  empresaId: number;
  notasFiscaisIds: number[];
}

export interface NotaAntecipada {
  numeroNota: string;
  valorBruto: number;
  valorLiquido: number;
  valorDesconto: number;
}

export interface ResultadoAntecipacao {
  empresa: string;
  cnpj: string;
  limite: number;
  notasFiscais: NotaAntecipada[];
  totalLiquido: number;
  totalBruto: number;
  totalDesconto: number;
}
