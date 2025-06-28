using Microsoft.EntityFrameworkCore;
using Antecipacao.Data;
using Antecipacao.Core.Extensions;
using Antecipacao.Application.Interfaces;
using Antecipacao.Core.DTO.AntecipacaoDtos;
using Antecipacao.Core.DTO.NotaFiscalDtos;
using Antecipacao.Core.Extensions.Shared;

namespace Antecipacao.Application.Services
{
    public class AplicacaoAntecipacaoService : IAplicacaoAntecipacaoService
    {
        private readonly AppDbContext _contexto;

        public AplicacaoAntecipacaoService(AppDbContext contexto)
        {
            _contexto = contexto ?? throw new ArgumentNullException(nameof(contexto));
        }

        public async Task<ResultadoAntecipacao?> CalcularAntecipacaoAsync(long empresaId, List<long> notasFiscaisIds)
        {
            var empresa = await _contexto.Empresas
                .Include(e => e.NotasFiscais)
                .FirstOrDefaultAsync(e => e.Id == empresaId);

            if (empresa == null)
                throw new InvalidOperationException("Empresa não encontrada.");

            var notasSelecionadas = empresa.NotasFiscais
                .Where(nf => notasFiscaisIds.Contains(nf.Id))
                .ToList();

            if (!notasSelecionadas.Any())
                throw new InvalidOperationException("Não existe notas para calcular antecipação");

            var limiteCredito = AntecipacaoUtils.CalcularLimiteCredito(empresa.FaturamentoMensal, empresa.Ramo);
            var totalBruto = notasSelecionadas.Sum(nf => nf.Valor);

            if (totalBruto > limiteCredito)
                throw new InvalidOperationException("A empresa não possui limite de crédito suficiente para as notas fiscais selecionadas.");

            var notasAntecipadas = notasSelecionadas.Select(nf =>
            {
                var valorLiquido = AntecipacaoUtils.CalcularValorLiquido(nf.DataVencimento, nf.Valor);
                var desconto = AntecipacaoUtils.CalcularDesconto(nf.DataVencimento, nf.Valor);

                return new NotaAntecipada
                {
                    NumeroNota = nf.NumeroNota,
                    ValorBruto = nf.Valor,
                    ValorLiquido = valorLiquido,
                    ValorDesconto = desconto
                };
            }).ToList();

            var totalLiquido = notasAntecipadas.Sum(na => na.ValorLiquido);
            var totalDesconto = notasAntecipadas.Sum(na => na.ValorDesconto);

            return new ResultadoAntecipacao
            {
                Empresa = empresa.Nome,
                Cnpj = empresa.Cnpj,
                Limite = limiteCredito,
                NotasFiscais = notasAntecipadas,
                TotalBruto = totalBruto,
                TotalLiquido = totalLiquido,
                TotalDesconto = totalDesconto,
            };
        }

        public async Task<bool> AdicionarNotaAoCarrinhoAsync(long empresaId, long notaFiscalId)
        {
            var notaFiscal = await _contexto.NotasFiscais
                .FirstOrDefaultAsync(nf => nf.Id == notaFiscalId && nf.EmpresaId == empresaId);

            if (notaFiscal == null)
                return false;

            notaFiscal.EstaNaAntecipacao = true;
            await _contexto.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RemoverNotaDoCarrinhoAsync(long empresaId, long notaFiscalId)
        {
            var notaFiscal = await _contexto.NotasFiscais
                .FirstOrDefaultAsync(nf => nf.Id == notaFiscalId && nf.EmpresaId == empresaId);

            if (notaFiscal == null)
                return false;

            notaFiscal.EstaNaAntecipacao = false;
            await _contexto.SaveChangesAsync();

            return true;
        }

        public async Task<List<NotaFiscalDto>> ObterNotasNoCarrinhoAsync(long empresaId)
        {
            return await _contexto.NotasFiscais
                .Where(nf => nf.EmpresaId == empresaId && nf.EstaNaAntecipacao)
                .Select(nf => nf.ToDto())
                .ToListAsync();
        }
    }
}
