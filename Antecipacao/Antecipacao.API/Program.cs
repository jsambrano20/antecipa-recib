using Antecipacao.Application.Interfaces;
using Antecipacao.Application.Services;
using Antecipacao.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IEmpresaAppService, EmpresaAppService>();
builder.Services.AddScoped<INotaFiscalAppService, NotaFiscalAppService>();
builder.Services.AddScoped<IAplicacaoAntecipacaoService, AplicacaoAntecipacaoService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Usar CORS
app.UseCors();

app.UseAuthorization();

app.MapControllers();

// Configurar para escutar em todas as interfaces
//app.Run("http://0.0.0.0:5000");
app.Run();
