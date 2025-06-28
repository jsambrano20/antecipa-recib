using Antecipacao.Core.DTO;
using Antecipacao.Core.DTO.NotaFiscalDtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Antecipacao.Application.Interfaces
{
    public interface INotaFiscalAppService
    {
        Task<List<NotaFiscalDto>> GetAllAsync(long empresaId);
        Task<NotaFiscalDto?> GetByIdAsync(long id);
        Task<NotaFiscalDto> AddAsync(CriarNotaFiscalDto dto);
        Task<bool> UpdateAsync(AtualizarNotaFiscalDto dto);
        Task<bool> DeleteAsync(long id);
    }
}
