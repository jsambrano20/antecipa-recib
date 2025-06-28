using Antecipacao.Application.Interfaces;
using Antecipacao.Core.DTO.AntecipacaoDtos;
using Antecipacao.Core.DTO.NotaFiscalDtos;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Antecipacao.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AplicacaoAntecipacaoController : ControllerBase
    {
        private readonly IAplicacaoAntecipacaoService _service;

        public AplicacaoAntecipacaoController(IAplicacaoAntecipacaoService service)
        {
            _service = service;
        }

        [HttpPost("calcular")]
        public async Task<ActionResult<ResultadoAntecipacao?>> CalcularAntecipacao([FromBody] CarrinhoAntecipacao carrinho)
        {
            try
            {
                var resultado = await _service.CalcularAntecipacaoAsync(carrinho.EmpresaId, carrinho.NotasFiscaisIds);
                return Ok(resultado);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro interno ao processar a solicitação.");
            }
        }

        [HttpPost("carrinho/{empresaId}/adicionar/{notaFiscalId}")]
        public async Task<ActionResult> AdicionarNotaAoCarrinho(long empresaId, long notaFiscalId)
        {
            var sucesso = await _service.AdicionarNotaAoCarrinhoAsync(empresaId, notaFiscalId);
            if (!sucesso) return BadRequest("Falha ao adicionar nota fiscal ao carrinho.");
            return Ok(new { message = "Nota fiscal adicionada ao carrinho com sucesso" });
        }

        [HttpDelete("carrinho/{empresaId}/remover/{notaFiscalId}")]
        public async Task<ActionResult> RemoverNotaDoCarrinho(long empresaId, long notaFiscalId)
        {
            var sucesso = await _service.RemoverNotaDoCarrinhoAsync(empresaId, notaFiscalId);
            if (!sucesso) return BadRequest("Falha ao remover nota fiscal do carrinho.");
            return Ok(new { message = "Nota fiscal removida do carrinho com sucesso" });
        }

        [HttpGet("carrinho/{empresaId}")]
        public async Task<ActionResult<List<NotaFiscalDto>>> ObterNotasNoCarrinho(long empresaId)
        {
            var notasFiscais = await _service.ObterNotasNoCarrinhoAsync(empresaId);
            return Ok(notasFiscais);
        }
    }
}

