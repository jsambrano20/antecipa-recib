# README do Projeto de Antecipação

Este README fornece uma visão geral do projeto, instruções para rodar a aplicação localmente e sugestões de melhorias.
Aplicação full-stack, com um backend em .NET e React

````md
## Como Rodar a Aplicação Localmente

**Pré-requisitos:**
- [.NET 9 SDK](https://dotnet.microsoft.com/)
- React (Typescript, HeroUI e Vite)
- Docker (para o banco de dados)

### 1. Iniciar o Banco de Dados com Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=$(read -s -p 'Digite a senha do SQL Server: ' password && echo $password)" \
  -p 1433:1433 --name sqlserver_antecipacao \
  -d mcr.microsoft.com/mssql/server:2022-latest
````

> **Dica:** Se já estiver rodando, você pode iniciar com `docker start sqlserver_antecipacao`.

---

### 2. Aplicar Migrações no Banco

```bash
cd Antecipacao/Antecipacao.Data
dotnet ef database update
```

---

### 3. Rodar o Backend e Frontend

**Backend (.NET):**

```bash
cd Antecipacao/Antecipacao.API
dotnet run
```

**Frontend (React):**

```bash
cd antecipacao-app
npm install
npm run dev
```

Acesse:

* API: [http://localhost:5001](http://localhost:5001)
* Frontend: [http://localhost:5173](http://localhost:5173)


## Melhorias Possíveis

- **Testes Automatizados:** Implementar testes unitários, de integração e end-to-end para garantir a qualidade do código.
- **CI/CD:** Configurar um pipeline de Integração Contínua/Entrega Contínua (CI/CD) para automatizar o build, teste e deploy da aplicação.
- **Tratamento de Erros e Logging:** Melhorar o tratamento de erros e a implementação de logging .
- **Autenticação e Autorização:** Implementar um sistema de autenticação e autorização.
- **Validação de Entrada:** Reforçar a validação de entrada de dados tanto no frontend quanto no backend.
- **Otimização de Performance:** Otimizar consultas de banco de dados, endpoints da API e o carregamento do frontend.
- **Documentação da API:** Gerar documentação da API.

