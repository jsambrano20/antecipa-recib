namespace Antecipacao.Core.DTO.AntecipacaoDtos
{
    public class ResultadoAntecipacao
    {
        public string Empresa { get; set; }
        public string Cnpj { get; set; }
        public decimal Limite { get; set; }
        public List<NotaAntecipada> NotasFiscais { get; set; } = new List<NotaAntecipada>();
        public decimal TotalLiquido { get; set; }
        public decimal TotalBruto { get; set; }
        public decimal TotalDesconto { get; set; }

    }

    public class NotaAntecipada
    {
        public string NumeroNota { get; set; }
        public decimal ValorBruto { get; set; }
        public decimal ValorLiquido { get; set; }
        public decimal ValorDesconto { get; set; }

    }

    public class CarrinhoAntecipacao
    {
        public long EmpresaId { get; set; }
        public List<long> NotasFiscaisIds { get; set; } = new List<long>();
    }
}

