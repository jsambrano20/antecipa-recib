import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { antecipacaoApi, empresasApi, notasFiscaisApi } from "@/services/api";
import { Empresa, NotaFiscal, ResultadoAntecipacao } from "@/types/dtos";
import { formatarCnpj } from "@/utils/formatters";
import { toast } from "react-toastify";

export default function CarrinhoPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(0);
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);
  const [notasNoCarrinho, setNotasNoCarrinho] = useState<NotaFiscal[]>([]);
  const [resultado, setResultado] = useState<ResultadoAntecipacao | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    empresasApi
      .listar()
      .then((r) => setEmpresas(r.data))
      .catch(() => toast.error("Erro ao carregar empresas"));
  }, []);

  useEffect(() => {
    if (empresaSelecionada > 0) {
      notasFiscaisApi
        .listar(empresaSelecionada)
        .then((r) => setNotasFiscais(r.data));
      antecipacaoApi
        .obterCarrinho(empresaSelecionada)
        .then((r) => setNotasNoCarrinho(r.data));
    }
  }, [empresaSelecionada]);

  const empresaAtual = empresas.find((e) => e.id === empresaSelecionada);
  const notasDisponiveis = notasFiscais.filter((n) => !n.estaNaAntecipacao);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (str: string) => new Date(str).toLocaleDateString("pt-BR");

  const adicionarAoCarrinho = async (id: number) => {
    try {
      await antecipacaoApi.adicionarAoCarrinho(
        empresaSelecionada,
        id
      );
      const [notas, carrinho] = await Promise.all([
        notasFiscaisApi.listar(empresaSelecionada),
        antecipacaoApi.obterCarrinho(empresaSelecionada),
      ]);
      setNotasFiscais(notas.data);
      setNotasNoCarrinho(carrinho.data);
      setResultado(null);
    } catch {
      toast.error("Erro ao adicionar nota ao carrinho");
    }
  };

  const removerDoCarrinho = async (id: number) => {
    try {
      await antecipacaoApi.removerDoCarrinho(empresaSelecionada, id);
      const [notas, carrinho] = await Promise.all([
        notasFiscaisApi.listar(empresaSelecionada),
        antecipacaoApi.obterCarrinho(empresaSelecionada),
      ]);
      setNotasFiscais(notas.data);
      setNotasNoCarrinho(carrinho.data);
      setResultado(null);
    } catch {
      toast.error("Erro ao remover nota do carrinho");
    }
  };

  const calcularAntecipacao = async () => {
    if (!notasNoCarrinho.length)
      return toast.error("Adicione pelo menos uma nota fiscal");
    setLoading(true);
    toast.error(null);

    try {
      const r = await antecipacaoApi.calcular({
        empresaId: empresaSelecionada,
        notasFiscaisIds: notasNoCarrinho.map((n) => n.id),
      });
      setResultado(r.data);
      toast.success("Antecipação calculada com sucesso!");
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Erro ao calcular antecipação");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="max-w-6xl w-full mx-auto py-10 px-4 space-y-6">
        <h1 className={title()}>Carrinho de Antecipação</h1>

        <div>
          <label className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
            Selecione a Empresa
          </label>
          <select
            value={empresaSelecionada}
            onChange={(e) => {
              const id = parseInt(e.target.value);
              setEmpresaSelecionada(id);
              setNotasFiscais([]);
            }}
            className="w-full border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
          >
            <option value={0}>Selecione uma empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome} - {formatarCnpj(empresa.cnpj)} - {formatCurrency(empresa.limiteCredito)}
              </option>
            ))}
          </select>
        </div>

        {empresaAtual && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
              <h2 className="font-semibold mb-4">Notas Fiscais Disponíveis</h2>
              {notasDisponiveis.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nenhuma nota fiscal disponível.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-zinc-700">
                      <th>Número</th>
                      <th>Valor</th>
                      <th>Vencimento</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notasDisponiveis.map((n) => (
                      <tr
                        key={n.id}
                        className="border-b border-gray-100 dark:border-zinc-800"
                      >
                        <td>{n.numeroNota}</td>
                        <td>{formatCurrency(n.valor)}</td>
                        <td>{formatDate(n.dataVencimento)}</td>
                        <td>
                          <button
                            onClick={() => adicionarAoCarrinho(n.id)}
                            className="text-blue-600 hover:underline"
                          >
                            Adicionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Carrinho de Antecipação</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {notasNoCarrinho.length} itens
                </span>
              </div>
              {notasNoCarrinho.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Carrinho vazio.
                </p>
              ) : (
                <>
                  <table className="w-full text-sm mb-4">
                    <thead>
                      <tr className="text-left border-b border-gray-200 dark:border-zinc-700">
                        <th>Número</th>
                        <th>Valor</th>
                        <th>Vencimento</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notasNoCarrinho.map((n) => (
                        <tr
                          key={n.id}
                          className="border-b border-gray-100 dark:border-zinc-800"
                        >
                          <td>{n.numeroNota}</td>
                          <td>{formatCurrency(n.valor)}</td>
                          <td>{formatDate(n.dataVencimento)}</td>
                          <td>
                            <button
                              onClick={() => removerDoCarrinho(n.id)}
                              className="text-red-600 hover:underline"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    onClick={calcularAntecipacao}
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading ? "Calculando..." : "Calcular Antecipação"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {resultado && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold">Resultado da Antecipação</h2>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <strong>Empresa:</strong> {resultado.empresa}
              </div>
              <div>
                <strong>CNPJ:</strong> {resultado.cnpj}
              </div>
              <div>
                <strong>Limite de Crédito:</strong>{" "}
                {formatCurrency(resultado.limite)}
              </div>
            </div>

            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-zinc-700">
                  <th>Número</th>
                  <th>Valor Bruto</th>
                  <th>Desconto</th>
                  <th>Valor Líquido</th>
                </tr>
              </thead>
              <tbody>
                {resultado.notasFiscais.map((n) => (
                  <tr
                    key={n.numeroNota}
                    className="border-b border-gray-100 dark:border-zinc-800"
                  >
                    <td>{n.numeroNota}</td>
                    <td>{formatCurrency(n.valorBruto)}</td>
                    <td>{formatCurrency(n.valorDesconto)}</td>
                    <td>{formatCurrency(n.valorLiquido)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-medium bg-gray-100 dark:bg-zinc-800">
                  <td>Total</td>
                  <td>{formatCurrency(resultado.totalBruto)}</td>
                  <td>{formatCurrency(resultado.totalDesconto)}</td>
                  <td>{formatCurrency(resultado.totalLiquido)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
