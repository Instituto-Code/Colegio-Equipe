# Colégio Equique - documentação do servidor

### Estrutura de pastas

O projeto segue o padrão MVC **(Model-View-Controller)** para organização do código. Abaixo está a explicação de cada pasta e arquivo principal:

- **src/**: Código-fonte do projeto
- **controllers/**: Contém a lógica e as regras de negócio
- **middlewares/**: Contém validações e proteção de rotas
- **models/**: Contém os schemas e modelos do banco de dados
- **routes/**: Define as rotas da aplicação e conecta com os controllers
- **services/**: Configuração de serviços externos (ex.: envio de e-mails com Nodemailer)
- **app.ts**: Arquivo principal da API; aqui são conectados todos os módulos acima

---

### Estilos de código

- Usamos o [Prettier](https://prettier.io/) para padronização do código.

> A configuração do Prettier já vai na raiz do projeto - **prettietrc.json**

- Existem alguns scripts de **organização**

| `npx prettier . --check`    | `npx prettier . --write`            |
| --------------------------- | ----------------------------------- |
| Checar código mal formatado | Ajustar o código com base no padrão |

---

### Scripts importantes

No arquivo **package.json**, temos alguns scripts que facilitam o desenvolvimento e organização do projeto:

| Script                   | Descrição                                                               |
| ------------------------ | ----------------------------------------------------------------------- |
| `npm run dev`            | Inicia o servidor em modo de desenvolvimento com **hot reload**         |
| `npm run build`          | Transpila o código TypeScript para JavaScript (gera a pasta `dist/`)    |
| `npm start`              | Executa a versão compilada da aplicação (em produção)                   |
| `npm run check:prettier` | Verifica se o código está de acordo com o padrão definido pelo Prettier |
| `npm run write:prettier` | Formata automaticamente o código seguindo o padrão do Prettier          |
