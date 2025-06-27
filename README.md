# 🏫 Colégio Equipe - Sistema Escolar

Sistema web completo para gerenciamento escolar, voltado ao ensino fundamental. O **Colégio Equipe** foi desenvolvido com foco em segurança, organização pedagógica e facilidade de uso para coordenadores, professores e responsáveis.

---

## 🚀 Funcionalidades

### 👩‍🏫 Coordenador
- Cadastro de alunos, professores, turmas e disciplinas
- Atribuição de professores a turmas e disciplinas
- Vinculação de alunos aos seus respectivos responsáveis
- Visualização geral de métricas (dashboard administrativo)

### 📚 Professor
- Lançamento de notas por disciplina e tipo de avaliação
- Registro de frequência dos alunos com data e controle de presença/falta
- Cadastro de observações pedagógicas para acompanhamento dos pais
- Visualização das turmas e disciplinas atribuídas

### 👨‍👩‍👧‍👦 Responsável (Pais)
- Acesso aos dados escolares dos filhos
- Visualização de notas, frequência e observações
- Painel pessoal com perfil básico do aluno

---

## 🛠 Tecnologias Utilizadas

### 💻 Frontend (React)
- React.js
- React Router
- Context API para autenticação e estado global
- React Hooks (useState, useEffect, useContext, etc.)
- Fetch para requisições

### 🔧 Backend (Node.js)
- Express
- MongoDB com Mongoose
- JWT para autenticação
- Nodemailer (validação de e-mail opcional)
- Middlewares de autenticação e autorização por role
- CORS configurado para ambiente de produção e desenvolvimento
---

