namespace Antecipacao.Core.DTO.NotaFiscalDtos
{
    public class NotaFiscalDto
    {
        public long Id { get; set; }
        public string NumeroNota { get; set; }
        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
        public long EmpresaId { get; set; }
        public bool EstaNaAntecipacao { get; set; }
        public decimal ValorLiquido { get; set; }
    }
}

