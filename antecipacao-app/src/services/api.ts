import axios from 'axios';
import { Empresa, CriarEmpresa, NotaFiscal, CriarNotaFiscal, CarrinhoAntecipacao, ResultadoAntecipacao } from '../types/dtos';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Empresas
export const empresasApi = {
  listar: () => api.get<Empresa[]>('/empresas'),
  obter: (id: number) => api.get<Empresa>(`/empresas/${id}`),
  criar: (empresa: CriarEmpresa) => api.post<Empresa>('/empresas', empresa),
  atualizar: (id: number, empresa: CriarEmpresa) => api.put(`/empresas/${id}`, empresa),
  excluir: (id: number) => api.delete(`/empresas/${id}`),
};

// Notas Fiscais
export const notasFiscaisApi = {
  listar: (empresaId?: number) => api.get<NotaFiscal[]>('/notasfiscais', { params: { empresaId } }),
  obter: (id: number) => api.get<NotaFiscal>(`/notasfiscais/${id}`),
  criar: (notaFiscal: CriarNotaFiscal) => api.post<NotaFiscal>('/notasfiscais', notaFiscal),
  atualizar: (id: number, notaFiscal: CriarNotaFiscal) => api.put(`/notasfiscais/${id}`, notaFiscal),
  excluir: (id: number) => api.delete(`/notasfiscais/${id}`),
};

// Antecipação
export const antecipacaoApi = {
  calcular: (carrinho: CarrinhoAntecipacao) => api.post<ResultadoAntecipacao>('/aplicacaoAntecipacao/calcular', carrinho),
  adicionarAoCarrinho: (empresaId: number, notaFiscalId: number) => 
    api.post(`/aplicacaoAntecipacao/carrinho/${empresaId}/adicionar/${notaFiscalId}`),
  removerDoCarrinho: (empresaId: number, notaFiscalId: number) => 
    api.delete(`/aplicacaoAntecipacao/carrinho/${empresaId}/remover/${notaFiscalId}`),
  obterCarrinho: (empresaId: number) => api.get<NotaFiscal[]>(`/aplicacaoAntecipacao/carrinho/${empresaId}`),
};


