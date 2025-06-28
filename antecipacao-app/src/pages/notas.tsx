import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { CriarNotaFiscal, Empresa } from "@/types/dtos";
import { empresasApi, notasFiscaisApi } from "@/services/api";
import { title } from "@/components/primitives";
import { formatarCnpj } from "@/utils/formatters";
import { toast } from "react-toastify";

export default function NotasPage() {
  const [notaFiscal, setNotaFiscal] = useState<CriarNotaFiscal>({
    numeroNota: "",
    valor: 0,
    dataVencimento: "",
    empresaId: 0,
  });
  const [valorRaw, setValorRaw] = useState("");
  const [erroValor, setErroValor] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);

  function validarValor(valor: number): string {
    if (valor <= 0) return "O valor deve ser maior que zero";
    const partes = valor.toFixed(2).split(".");
    const parteInteira = partes[0];
    const parteDecimal = partes[1];
    if (parteInteira.length + parteDecimal.length > 18) {
      return "Valor excede o limite permitido de 18 dígitos (com 2 decimais)";
    }
    return "";
  }

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      const response = await empresasApi.listar();
      setEmpresas(response.data);
    } catch (err) {
      toast.error("Erro ao carregar empresas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await notasFiscaisApi.criar(notaFiscal);
      toast.success("Nota fiscal cadastrada com sucesso!");
      setValorRaw("");
      setNotaFiscal({
        numeroNota: "",
        valor: 0,
        dataVencimento: "",
        empresaId: 0,
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Erro ao cadastrar nota fiscal"
      );
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow p-6 space-y-6">
          <h1 className={title()}>Cadastro de Nota Fiscal</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="empresa"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Empresa
              </label>
              <select
                id="empresa"
                value={
                  notaFiscal.empresaId === 0
                    ? ""
                    : notaFiscal.empresaId.toString()
                }
                onChange={(e) =>
                  setNotaFiscal({
                    ...notaFiscal,
                    empresaId:
                      e.target.value === "" ? 0 : parseInt(e.target.value),
                  })
                }
                required
                className="mt-1 block w-full border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-2 shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id.toString()}>
                    {empresa.nome} - {formatarCnpj(empresa.cnpj)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="numero"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Número da Nota Fiscal
              </label>
              <input
                id="numeroNota"
                type="text"
                value={notaFiscal.numeroNota || ""}
                onChange={(e) =>
                  setNotaFiscal({
                    ...notaFiscal,
                    numeroNota: e.target.value || "",
                  })
                }
                placeholder="Número da nota fiscal"
                required
                min="1"
                className="mt-1 block w-full border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-2 shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="valor"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Valor (R$)
              </label>
              <input
                id="valor"
                type="text"
                inputMode="decimal"
                value={valorRaw}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/[^\d]/g, "");
                  const valor = parseFloat(apenasNumeros) / 100;
                  const erro = validarValor(valor);
                  setErroValor(erro);
                  setNotaFiscal({
                    ...notaFiscal,
                    valor: isNaN(valor) ? 0 : valor,
                  });
                  setValorRaw(
                    isNaN(valor)
                      ? ""
                      : valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                  );
                }}
                placeholder="Ex: R$ 12.000,00"
                required
                className={`mt-1 block w-full border ${erroValor ? "border-red-500" : "border-gray-300 dark:border-zinc-700"} rounded-md px-3 py-2 shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${erroValor ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
              />
              <p
                className={`text-sm mt-1 ${erroValor ? "text-red-500" : "text-gray-500"}`}
              >
                {erroValor || "Informe o valor da nota fiscal"}
              </p>
            </div>
            <div>
              <label
                htmlFor="dataVencimento"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Data de Vencimento
              </label>
              <input
                id="dataVencimento"
                type="date"
                value={notaFiscal.dataVencimento}
                onChange={(e) => {
                  const valor = e.target.value;
                  const hoje = new Date();
                  const selecionada = new Date(valor);
                  hoje.setHours(0, 0, 0, 0);
                  selecionada.setHours(0, 0, 0, 0);
                  if (selecionada <= hoje) {
                    alert("A data de vencimento deve ser maior que hoje.");
                    return;
                  }

                  setNotaFiscal({ ...notaFiscal, dataVencimento: valor });
                }}
                onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                required
                min={getMinDate()}
                onKeyDown={(e) => e.preventDefault()}
                className="mt-1 block w-full border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-2 shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                A data de vencimento deve ser maior que hoje
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || empresas.length === 0}
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Cadastrar Nota Fiscal"}
            </button>

            {empresas.length === 0 && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md border border-yellow-300 mt-4">
                Nenhuma empresa cadastrada. Cadastre uma empresa primeiro.
              </div>
            )}
          </form>
        </div>
      </section>
    </DefaultLayout>
  );
}
