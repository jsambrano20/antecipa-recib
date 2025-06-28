using System.ComponentModel.DataAnnotations;

namespace Antecipacao.Core.DTO.NotaFiscalDtos
{
    public class AtualizarNotaFiscalDto
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "O número da nota fiscal é obrigatório.")]
        public string NumeroNota { get; set; }

        [Required(ErrorMessage = "O valor é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "A data de vencimento é obrigatória.")]
        [DataType(DataType.Date, ErrorMessage = "A data de vencimento deve estar em formato válido.")]
        public DateTime DataVencimento { get; set; }

        [Required(ErrorMessage = "O ID da empresa é obrigatório.")]
        public long EmpresaId { get; set; }
    }
}

