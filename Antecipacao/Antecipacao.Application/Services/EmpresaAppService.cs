using Antecipacao.Application.Interfaces;
using Antecipacao.Core.DTO.EmpresaDtos;
using Antecipacao.Core.Entities;
using Antecipacao.Core.Extensions;
using Antecipacao.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Antecipacao.Application.Services
{
    public class EmpresaAppService : IEmpresaAppService
    {
        private readonly AppDbContext _contexto;

        public EmpresaAppService(AppDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<List<EmpresaDto>> GetAllAsync()
        {
            return await _contexto.Empresas
                .Select(x => x.ToDto())
                .ToListAsync();
        }

        public async Task<EmpresaDto?> GetByIdAsync(long id)
        {
            var entidade = await _contexto.Empresas.FindAsync(id);
            return entidade?.ToDto();
        }

        public async Task<EmpresaDto> AddAsync(CriarEmpresaDto dto)
        {
            dto.Cnpj = dto.Cnpj?.Trim().Replace(".", "").Replace("/", "").Replace("-", "");

            var jaExiste = await _contexto.Empresas
                .AnyAsync(e => e.Cnpj == dto.Cnpj);

            if (jaExiste)
                throw new InvalidOperationException("Já existe uma empresa com o CNPJ informado.");

            var entidade = dto.ToEntity();
            entidade.CriadoEm = DateTime.UtcNow;

            _contexto.Empresas.Add(entidade);
            await _contexto.SaveChangesAsync();

            return entidade.ToDto();
        }

        public async Task<bool> UpdateAsync(AtualizarEmpresaDto dto)
        {
            var entidade = await _contexto.Empresas.FindAsync(dto.Id);
            if (entidade == null)
                return false;

            entidade.Cnpj = dto.Cnpj;
            entidade.Nome = dto.Nome;
            entidade.FaturamentoMensal = dto.FaturamentoMensal;
            entidade.Ramo = dto.Ramo;
            entidade.AtualizadoEm = DateTime.UtcNow;

            _contexto.Empresas.Update(entidade);
            await _contexto.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var entidade = await _contexto.Empresas.FindAsync(id);
            if (entidade == null)
                return false;

            _contexto.Empresas.Remove(entidade);
            await _contexto.SaveChangesAsync();

            return true;
        }
    }
}
