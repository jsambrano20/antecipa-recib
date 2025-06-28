using Antecipacao.Application.Interfaces;
using Antecipacao.Core.DTO.EmpresaDtos;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Antecipacao.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresasController : ControllerBase
    {
        private readonly IEmpresaAppService _service;

        public EmpresasController(IEmpresaAppService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<EmpresaDto>>> GetAllAsync()
        {
            var resultado = await _service.GetAllAsync();
            return Ok(resultado);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmpresaDto>> GetByIdAsync(long id)
        {
            var resultado = await _service.GetByIdAsync(id);
            if (resultado == null) return NotFound("Empresa não encontrada");
            return Ok(resultado);
        }

        [HttpPost]
        public async Task<ActionResult<EmpresaDto>> AddAsync(CriarEmpresaDto dto)
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
        public async Task<IActionResult> UpdateAsync(long id, AtualizarEmpresaDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID não confere");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var atualizada = await _service.UpdateAsync(dto);
            if (!atualizada) return NotFound("Empresa não encontrada");

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            var excluida = await _service.DeleteAsync(id);
            if (!excluida) return NotFound("Empresa não encontrada");

            return NoContent();
        }
    }
}

