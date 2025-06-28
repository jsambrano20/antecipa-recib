using Antecipacao.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Antecipacao.Core.DTO.EmpresaDtos
{
    public class CriarEmpresaDto
    {
        [Required(ErrorMessage = "O CNPJ é obrigatório.")]
        [StringLength(18, MinimumLength = 14, ErrorMessage = "O CNPJ deve ter entre 14 e 18 caracteres.")]
        public string Cnpj { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O faturamento mensal é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O faturamento mensal deve ser maior que zero.")]
        public decimal FaturamentoMensal { get; set; }

        [Required(ErrorMessage = "O ramo é obrigatório.")]
        public RamoEmpresa Ramo { get; set; }
    }
}

