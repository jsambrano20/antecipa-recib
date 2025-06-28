# 📦 Projeto de Antecipação de Recebíveis

Este repositório contém uma **aplicação full-stack** para antecipação de recebíveis, com:

- 🔹 **Backend em .NET 9**
- 🔹 **Frontend em React com TypeScript, Vite e HeroUI**
- 🔹 **Banco de Dados SQL Server via Docker**

---

## 🛠️ Tecnologias Utilizadas

- **.NET 9** – Backend com ASP.NET Core
- **React + TypeScript** – Frontend moderno com Vite
- **HeroUI** – Componentes visuais
- **SQL Server** – Banco relacional
- **Docker** – Containerização do banco de dados

> 💡 **Dica:** Se o container já existir, use:
>
> ```bash
> docker start sqlserver_antecipacao
> ```

---

### 📦 2. Aplicar Migrações no Banco de Dados

```bash
cd Antecipacao/Antecipacao.Data
dotnet ef database update
```

---

### 🧠 3. Rodar o Backend

```bash
cd Antecipacao/Antecipacao.API
dotnet run
```

---

### 🌐 4. Rodar o Frontend

```bash
cd antecipacao-app
npm install
npm run dev
```

---

### 🔗 Acessos Locais

* Backend (API): [http://localhost:5001](http://localhost:5001)
* Frontend: [http://localhost:5173](http://localhost:5173)

---

## 💡 Melhorias Futuras

* ✅ **Testes Automatizados:** Unitários, de integração e E2E
* ✅ **CI/CD:** Pipeline de build, testes e deploy
* ✅ **Logging e Tratamento de Erros:** Centralizado e estruturado
* ✅ **Autenticação e Autorização:** Implementar controle de acesso
* ✅ **Validação de Dados:** Tanto no frontend quanto no backend
* ✅ **Performance:** Otimizar queries, API e frontend
* ✅ **Documentação da API:** Swagger ou similar

---

📁 Estrutura clara e orientada a **DDD** com foco em escalabilidade e manutenibilidade.

---

