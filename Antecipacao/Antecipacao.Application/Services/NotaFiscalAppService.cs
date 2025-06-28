using Antecipacao.Application.Interfaces;
using Antecipacao.Core.DTO.NotaFiscalDtos;
using Antecipacao.Core.Entities;
using Antecipacao.Core.Extensions;
using Antecipacao.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Antecipacao.Application.Services
{
    public class NotaFiscalAppService : INotaFiscalAppService
    {
        private readonly AppDbContext _contexto;

        public NotaFiscalAppService(AppDbContext contexto)
        {
            _contexto = contexto;
        }

        public async Task<List<NotaFiscalDto>> GetAllAsync(long empresaId)
        {
            var query = _contexto.NotasFiscais.AsQueryable();

            if (empresaId > 0)
            {
                query = query.Where(nf => nf.EmpresaId == empresaId);
            }

            return await query
                .Select(nf => nf.ToDto())
                .ToListAsync();
        }

        public async Task<NotaFiscalDto?> GetByIdAsync(long id)
        {
            var entidade = await _contexto.NotasFiscais.FindAsync(id);
            return entidade?.ToDto();
        }

        public async Task<NotaFiscalDto> AddAsync(CriarNotaFiscalDto dto)
        {
            bool existeNota = await _contexto.NotasFiscais
                .AnyAsync(n => n.NumeroNota == dto.NumeroNota && n.EmpresaId == dto.EmpresaId);

            if (existeNota)
            {
                throw new InvalidOperationException($"Já existe uma nota com o número '{dto.NumeroNota}' para esta empresa.");
            }

            var entidade = dto.ToEntity();
            entidade.CriadoEm = DateTime.UtcNow;

            _contexto.NotasFiscais.Add(entidade);
            await _contexto.SaveChangesAsync();

            return entidade.ToDto();
        }

        public async Task<bool> UpdateAsync(AtualizarNotaFiscalDto dto)
        {
            var entidade = await _contexto.NotasFiscais.FindAsync(dto.Id);
            if (entidade == null)
                return false;

            entidade.NumeroNota = dto.NumeroNota;
            entidade.Valor = dto.Valor;
            entidade.DataVencimento = dto.DataVencimento;
            entidade.AtualizadoEm = DateTime.UtcNow;

            _contexto.NotasFiscais.Update(entidade);
            await _contexto.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var entidade = await _contexto.NotasFiscais.FindAsync(id);
            if (entidade == null)
                return false;

            _contexto.NotasFiscais.Remove(entidade);
            await _contexto.SaveChangesAsync();

            return true;
        }
    }
}
