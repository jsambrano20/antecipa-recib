using Antecipacao.Application.Interfaces;
using Antecipacao.Core.DTO.EmpresaDtos;
using Antecipacao.Core.DTO.NotaFiscalDtos;
using Antecipacao.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Antecipacao.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotasFiscaisController : ControllerBase
    {
        private readonly INotaFiscalAppService _service;

        public NotasFiscaisController(INotaFiscalAppService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<NotaFiscalDto>>> GetAllAsync(long empresaId)
        {
            var resultado = await _service.GetAllAsync(empresaId);
            return Ok(resultado);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NotaFiscalDto>> GetByIdAsync(long id)
        {
            var resultado = await _service.GetByIdAsync(id);
            if (resultado == null) return NotFound("Nota fiscal não encontrada");
            return Ok(resultado);
        }

        [HttpPost]
        public async Task<ActionResult<NotaFiscalDto>> AddAsync(CriarNotaFiscalDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var criada = await _service.AddAsync(dto);
                return Ok(criada);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(long id, AtualizarNotaFiscalDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID não confere");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var atualizada = await _service.UpdateAsync(dto);
            if (!atualizada) return NotFound("Nota fiscal não encontrada");

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            var excluida = await _service.DeleteAsync(id);
            if (!excluida) return NotFound("Nota fiscal não encontrada");

            return NoContent();
        }
    }
}

