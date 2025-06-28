using Antecipacao.Core.Enums;
using System;

namespace Antecipacao.Core.Extensions.Shared
{
    public static class AntecipacaoUtils
    {
        public static decimal CalcularLimiteCredito(decimal faturamentoMensal, RamoEmpresa ramo)
        {
            if (faturamentoMensal >= 10000 && faturamentoMensal <= 50000)
                return faturamentoMensal * 0.50m;

            if (faturamentoMensal >= 50001 && faturamentoMensal <= 100000)
                return ramo == RamoEmpresa.Servicos
                    ? faturamentoMensal * 0.55m
                    : faturamentoMensal * 0.60m;

            if (faturamentoMensal > 100000)
                return ramo == RamoEmpresa.Produtos
                    ? faturamentoMensal * 0.60m
                    : faturamentoMensal * 0.65m;

            return 0;
        }

        public static decimal CalcularValorLiquido(DateTime dataVencimento, decimal valorBruto)
        {
            var diasAteVencimento = (dataVencimento - DateTime.Now).Days;
            if (diasAteVencimento <= 0)
                return 0;

            const decimal taxaMensal = 0.0465m;
            var meses = (decimal)diasAteVencimento / 30m;
            var fatorDesconto = (decimal)Math.Pow((double)(1 + taxaMensal), (double)meses);
            var valorLiquido = valorBruto / fatorDesconto;
            return valorLiquido;
        }

        public static decimal CalcularDesconto(DateTime dataVencimento, decimal valorBruto)
        {
            var valorLiquido = CalcularValorLiquido(dataVencimento, valorBruto);
            var desconto = valorBruto - valorLiquido;
            return desconto;
        }
    }
}
