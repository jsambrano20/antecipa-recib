using Antecipacao.Core.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antecipacao.Core.Entities
{
    [Table("NOTAS_FISCAIS")]
    public class NotaFiscal : Entity
    {
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

        [ForeignKey("EmpresaId")]
        public Empresa Empresa { get; set; }

        public bool EstaNaAntecipacao { get; set; } = false;
    }
}

