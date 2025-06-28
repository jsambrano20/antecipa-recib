using Antecipacao.Core.DTO.EmpresaDtos;
using Antecipacao.Core.Entities;
using Antecipacao.Core.Extensions.Shared;

namespace Antecipacao.Core.Extensions
{
    public static class EmpresaExtensions
    {
        public static EmpresaDto ToDto(this Empresa entity)
        {
            return new EmpresaDto
            {
                Id = entity.Id,
                Cnpj = entity.Cnpj,
                Nome = entity.Nome,
                FaturamentoMensal = entity.FaturamentoMensal,
                Ramo = entity.Ramo.ToString(),
                LimiteCredito = AntecipacaoUtils.CalcularLimiteCredito(entity.FaturamentoMensal, entity.Ramo)
            };
        }

        public static Empresa ToEntity(this EmpresaDto dto)
        {
            return new Empresa
            {
                Id = dto.Id,
                Cnpj = dto.Cnpj,
                Nome = dto.Nome,
                FaturamentoMensal = dto.FaturamentoMensal,
                Ramo = Enum.Parse<Enums.RamoEmpresa>(dto.Ramo)
            };
        }

        public static Empresa ToEntity(this CriarEmpresaDto dto)
        {
            return new Empresa
            {
                Cnpj = dto.Cnpj,
                Nome = dto.Nome,
                FaturamentoMensal = dto.FaturamentoMensal,
                Ramo = dto.Ramo
            };
        }

        public static Empresa ToEntity(this AtualizarEmpresaDto dto)
        {
            return new Empresa
            {
                Id = dto.Id,
                Cnpj = dto.Cnpj,
                Nome = dto.Nome,
                FaturamentoMensal = dto.FaturamentoMensal,
                Ramo = dto.Ramo
            };
        }
    }
}

