using Antecipacao.Core.DTO;
using Antecipacao.Core.DTO.EmpresaDtos;
using Antecipacao.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antecipacao.Application.Interfaces
{
    public interface IEmpresaAppService
    {
        Task<List<EmpresaDto>> GetAllAsync();
        Task<EmpresaDto?> GetByIdAsync(long id);
        Task<EmpresaDto> AddAsync(CriarEmpresaDto dto);
        Task<bool> UpdateAsync(AtualizarEmpresaDto dto);
        Task<bool> DeleteAsync(long id);
    }
}
