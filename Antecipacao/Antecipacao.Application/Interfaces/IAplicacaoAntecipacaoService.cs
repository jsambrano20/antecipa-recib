using Antecipacao.Core.DTO.AntecipacaoDtos;
using Antecipacao.Core.DTO.NotaFiscalDtos;

namespace Antecipacao.Application.Interfaces
{
    public interface IAplicacaoAntecipacaoService
    {
        Task<ResultadoAntecipacao?> CalcularAntecipacaoAsync(long empresaId, List<long> notasFiscaisIds);
        Task<bool> AdicionarNotaAoCarrinhoAsync(long empresaId, long notaFiscalId);
        Task<bool> RemoverNotaDoCarrinhoAsync(long empresaId, long notaFiscalId);
        Task<List<NotaFiscalDto>> ObterNotasNoCarrinhoAsync(long empresaId);
    }
}
