using Antecipacao.Core.DTO.NotaFiscalDtos;
using Antecipacao.Core.Entities;

namespace Antecipacao.Core.Extensions
{
    public static class NotaFiscalExtensions
    {
        public static NotaFiscalDto ToDto(this NotaFiscal entity)
        {
            return new NotaFiscalDto
            {
                Id = entity.Id,
                NumeroNota = entity.NumeroNota,
                Valor = entity.Valor,
                DataVencimento = entity.DataVencimento,
                EmpresaId = entity.EmpresaId,
                EstaNaAntecipacao = entity.EstaNaAntecipacao,
            };
        }

        public static NotaFiscal ToEntity(this NotaFiscalDto dto)
        {
            return new NotaFiscal
            {
                Id = dto.Id,
                NumeroNota = dto.NumeroNota,
                Valor = dto.Valor,
                DataVencimento = dto.DataVencimento,
                EmpresaId = dto.EmpresaId,
                EstaNaAntecipacao = dto.EstaNaAntecipacao
            };
        }

        public static NotaFiscal ToEntity(this CriarNotaFiscalDto dto)
        {
            return new NotaFiscal
            {
                NumeroNota = dto.NumeroNota,
                Valor = dto.Valor,
                DataVencimento = dto.DataVencimento,
                EmpresaId = dto.EmpresaId
            };
        }

        public static NotaFiscal ToEntity(this AtualizarNotaFiscalDto dto)
        {
            return new NotaFiscal
            {
                Id = dto.Id,
                NumeroNota = dto.NumeroNota,
                Valor = dto.Valor,
                DataVencimento = dto.DataVencimento,
                EmpresaId = dto.EmpresaId
            };
        }
    }
}

