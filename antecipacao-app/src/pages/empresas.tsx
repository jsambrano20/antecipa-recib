import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { CriarEmpresa, RamoEmpresa } from "../types/dtos";
import { empresasApi } from "@/services/api";
import { title } from "@/components/primitives";
import {
  formatarCnpj,
  limparCnpj,
  normalizarDecimal,
} from "@/utils/formatters";
import { toast } from "react-toastify";

export default function EmpresaPage() {
  const [empresa, setEmpresa] = useState<CriarEmpresa>({
    cnpj: "",
    nome: "",
    faturamentoMensal: 0,
    ramo: RamoEmpresa.Servicos,
  });

  const [loading, setLoading] = useState(false);
  const [faturamentoRaw, setFaturamentoRaw] = useState("");
  const [erroFaturamento, setErroFaturamento] = useState("");

  function validarFaturamento(valor: number): string {
    if (valor < 10000) {
      return "O faturamento não pode ser menor que R$ 10.000,00";
    }

    const partes = valor.toFixed(2).split(".");
    const parteInteira = partes[0];
    const parteDecimal = partes[1];

    if (parteInteira.length + parteDecimal.length > 18) {
      return "Valor excede o limite permitido de 18 dígitos (com 2 decimais)";
    }

    return "";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cnpjLimpo = limparCnpj(empresa.cnpj);

    //Implementar a validação de CNPJ se necessário
    // if (!validarCnpj(cnpjLimpo)) {
    //   setError("CNPJ inválido");
    //   setLoading(false);
    //   return;
    // }

    try {
      await empresasApi.criar({
        ...empresa,
        cnpj: cnpjLimpo,
        faturamentoMensal: normalizarDecimal(empresa.faturamentoMensal),
      });
      toast.success("Empresa cadastrada com sucesso!");

      setFaturamentoRaw("");
      setEmpresa({
        cnpj: "",
        nome: "",
        faturamentoMensal: 0,
        ramo: RamoEmpresa.Servicos,
      });
    } catch (err: any) {
      const mensagem =
        err.response?.data?.message || "Erro ao cadastrar empresa";
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow p-6 space-y-6">
          <h1 className={title()}>Cadastro de Empresa</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="cnpj"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                className="mt-1 block w-full border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-2 shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={empresa.cnpj}
                onChange={(e) =>
                  setEmpresa({ ...empresa, cnpj: formatarCnpj(e.target.value) })
                }
                placeholder="00.000.000/0000-00"
                required
                maxLength={18}
              />
              <p className="text-sm text-gray-500 mt-1">
                Digite os 14 números do CNPJ
              </p>
            </div>

            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nome da Empresa
              </label>
              <input
                id="nome"
                type="text"
                className="mt-1 block w-full border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-2 shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={empresa.nome}
                onChange={(e) =>
                  setEmpresa({ ...empresa, nome: e.target.value })
                }
                placeholder="Nome da empresa"
                required
                maxLength={200}
              />
            </div>

            <div>
              <label
                htmlFor="faturamento"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Faturamento Mensal (R$)
              </label>
              <input
                id="faturamento"
                type="text"
                inputMode="decimal"
                className={`mt-1 block w-full border ${
                  erroFaturamento
                    ? "border-red-500"
                    : "border-gray-300 dark:border-zinc-700"
                } rounded-md px-3 py-2 shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
                  erroFaturamento ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                value={faturamentoRaw}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/[^\d]/g, "");
                  const valor = parseFloat(apenasNumeros) / 100;

                  const erro = validarFaturamento(valor);
                  setErroFaturamento(erro);

                  setEmpresa({
                    ...empresa,
                    faturamentoMensal: isNaN(valor) ? 0 : valor,
                  });

                  setFaturamentoRaw(
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
              />
              <p
                className={`text-sm mt-1 ${erroFaturamento ? "text-red-500" : "text-gray-500"}`}
              >
                {erroFaturamento || "Valor mínimo: R$ 10.000,00"}
              </p>
            </div>

            <div>
              <label
                htmlFor="ramo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ramo da Empresa
              </label>
              <select
                id="ramo"
                className="mt-1 block w-full border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-2 shadow-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={empresa.ramo}
                onChange={(e) =>
                  setEmpresa({
                    ...empresa,
                    ramo: parseInt(e.target.value) as RamoEmpresa,
                  })
                }
                required
              >
                <option value={RamoEmpresa.Servicos}>Serviços</option>
                <option value={RamoEmpresa.Produtos}>Produtos</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Cadastrar Empresa"}
            </button>
          </form>
        </div>
      </section>
    </DefaultLayout>
  );
}
