using Antecipacao.Core.Enums;

namespace Antecipacao.Core.DTO.EmpresaDtos
{
    public class EmpresaDto
    {
        public long Id { get; set; }
        public string Cnpj { get; set; }
        public string Nome { get; set; }
        public decimal FaturamentoMensal { get; set; }
        public string Ramo { get; set; }
        public decimal LimiteCredito { get; set; }
    }
}

