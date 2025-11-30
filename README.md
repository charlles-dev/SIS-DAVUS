<div align="center">
  <img src="https://raw.githubusercontent.com/gist/charlles-dev/ea4a545ad53992160f4d490976500420/raw/7882fc5b7af8925833800920b8eab5294fb00d8f/davus02.svg"width=200px" />
  
  <h1>Davus Engenharia</h1>
  <h3>Sistema de Controle de Estoque e Patrimônio</h3>
  
  <p>
    <strong>Versão 2.0.0</strong> | Arquitetura Serverless & Zero Cost
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-Enabled-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </p>
  
  <p>
    <a href="#-visão-geral">Visão Geral</a> •
    <a href="#-arquitetura-serverless">Arquitetura</a> •
    <a href="#-instalação-e-setup">Instalação</a> •
    <a href="#-deploy">Deploy</a>
  </p>
</div>

---

## 📋 Visão Geral

O **Davus System** é uma aplicação robusta de **Controle de Estoque e Patrimônio** desenvolvida com arquitetura moderna e escalável. O sistema gerencia movimentações de materiais, ativos patrimoniais com QR Code, evidências de avarias e relatórios financeiros, utilizando o poder do **Supabase** para backend, autenticação e banco de dados em tempo real.

### ✨ Funcionalidades Principais

- **📦 Gestão de Estoque**: Entradas e saídas, controle de estoque mínimo e alertas
- **🏷️ Patrimônio**: Rastreamento de ativos, localização e status (Disponível, Em Uso, Manutenção)
- **📸 Evidências**: Upload de fotos de avarias ou entregas via Supabase Storage
- **🔐 RBAC Estrito**: Perfis de acesso para Admin, Gestor (Manager) e Almoxarife (Operator) via RLS (Row Level Security)
- **📊 Dashboard Analytics**: Visão financeira e operacional em tempo real

---

## 🏗 Arquitetura Serverless

Este projeto utiliza uma stack **Serverless** para garantir alta disponibilidade, segurança e custo zero de manutenção de servidores.

### 🎯 Stack Tecnológica

| Componente | Tecnologia | Função |
|------------|------------|--------|
| **Frontend** | React + Vite + Shadcn/UI | Interface do usuário rápida e responsiva |
| **Backend** | Supabase (BaaS) | Autenticação, Banco de Dados e API automática |
| **Database** | PostgreSQL 16 | Banco de dados relacional robusto |
| **Storage** | Supabase Storage | Armazenamento de imagens e documentos |
| **Auth** | Supabase Auth | Gestão de usuários e sessões segura |

### 🔄 Fluxo de Dados

1. **Frontend (Vercel)**: Aplicação React consome diretamente os serviços do Supabase.
2. **Supabase Client**: Gerencia conexão segura, cache e renovação de tokens.
3. **PostgreSQL + RLS**: O banco de dados valida cada requisição com base nas regras de segurança (Row Level Security), garantindo que usuários só acessem o que têm permissão.

---

## 🚀 Instalação e Setup Local

### 📋 Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (Free Tier)

### 1️⃣ Configuração do Supabase

1. Crie um novo projeto no Supabase.
2. Execute os scripts SQL (disponíveis na pasta `/database`) para criar as tabelas e políticas de segurança.
3. Obtenha a `SUPABASE_URL` e `SUPABASE_ANON_KEY` nas configurações do projeto (API).

### 2️⃣ Configuração do Projeto

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/davus-engenharia.git
cd davus-engenharia

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local na raiz e adicione:
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🔐 Variáveis de Ambiente (.env.local)

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-anonima
```

---

## 🚢 Deploy em Produção

### 📝 Resumo do Processo

O deploy é automatizado mas requer configuração inicial manual.

#### 1. Banco de Dados (Supabase)

- Criar projeto e habilitar extensões `uuid-ossp` e `pg_trgm`
- Criar bucket de storage público: `davus-media`
- Executar scripts SQL para tabelas e RLS

#### 2. Frontend (Vercel)

- Importar repositório do GitHub
- Build settings: Default do Vite (`npm run build`, output `dist`)
- Configurar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

---

## 🛡️ Segurança e RBAC

O sistema implementa controle de acesso baseado em funções (RBAC) diretamente no banco de dados via **Row Level Security (RLS)**.

| Perfil | Permissões |
|--------|-----------|
| **ADMIN** | Acesso total ao sistema |
| **MANAGER** | Gerenciamento de estoque e ativos |
| **OPERATOR** | Registro de movimentações e checkouts |

---

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido como trabalho acadêmico com a participação dos seguintes membros:

### Desenvolvedores

- **[@charlles-dev](https://github.com/charlles.dev)**
- **[@Flaviano rodrigues](https://github.com/flavianorodrigues147-a11y)**
- **[@Weidy Lucena](https://github.com/Weidyzk)**
- **[@Savio Bezzera](https://github.com/saviobezerra)**
- **[@Rafael Leal](https://github.com/rafaelalm-Leal)**
- **[@Edielson Miranda](https://github.com/EdiConha)**

### Orientação Acadêmica

- **[@profanacgpb](https://github.com/profanacgpb)** - Professora Orientadora

---

## 📄 Licença

Este projeto é **privado** e de propriedade exclusiva da **Davus Engenharia**. 

**Todos os direitos reservados © 2025.**

⚠️ Este repositório não aceita contribuições externas e destina-se exclusivamente ao uso interno da equipe.

---

<div align="center">
  
  <p><strong>Davus Engenharia</strong></p>
  <p>Sistema de Controle de Estoque e Patrimônio</p>
  <p>Desenvolvido com ❤️ usando tecnologias open-source</p>
</div>
