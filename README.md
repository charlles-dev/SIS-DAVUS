<div align="center">
  <img src="https://raw.githubusercontent.com/gist/charlles-dev/ea4a545ad53992160f4d490976500420/raw/7882fc5b7af8925833800920b8eab5294fb00d8f/davus02.svg"width=200px" />
  
  <h1>Davus Engenharia</h1>
  <h3>Sistema de Controle de Estoque e Patrimônio</h3>
  
  <p>
    <strong>Versão 1.5.1</strong> | Arquitetura Serverless Hybrid & Zero Cost
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Supabase-Enabled-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
  
  <p>
    <a href="#-visão-geral">Visão Geral</a> •
    <a href="#-arquitetura-zero-cost">Arquitetura</a> •
    <a href="#-instalação-e-setup">Instalação</a> •
    <a href="#-documentação">Documentação</a> •
    <a href="#-deploy">Deploy</a>
  </p>
</div>

---

## 📋 Visão Geral

O **Davus System** é uma aplicação robusta de **Controle de Estoque e Patrimônio** desenvolvida para mitigar as limitações de infraestrutura gratuita (Free Tier). O sistema gerencia movimentações de materiais, ativos patrimoniais com QR Code, evidências de avarias e relatórios financeiros, utilizando estratégias avançadas de cache e engenharia de software para garantir performance mesmo em ambientes serverless com "cold starts".

### ✨ Funcionalidades Principais

- **📦 Gestão de Estoque**: Entradas e saídas (FIFO), controle de estoque mínimo e alertas
- **🏷️ Patrimônio**: Rastreamento de ativos, localização e status (Disponível, Em Uso, Manutenção)
- **📸 Evidências**: Upload de fotos de avarias ou entregas via S3 (Supabase Storage)
- **🔐 RBAC Estrito**: Perfis de acesso para Admin, Gestor (Manager) e Almoxarife (Operator)
- **📊 Dashboard Analytics**: Visão financeira e operacional com cache otimizado

---

## 🏗 Arquitetura "Zero Cost"

Este projeto utiliza uma stack estrategicamente selecionada para rodar com **custo zero** em produção, contornando limitações de CPU e memória.

<div align="center">
  <img src="https://raw.githubusercontent.com/gist/charlles-dev/410bff640e5083963d93204204e09d77/raw/524bfa3aa59c4e68bae9ce4ee9dbcc1f784c8aca/davus03.svg" alt="Diagrama de Arquitetura" width="500px" />
</div>

### 🎯 Stack Tecnológica

| Componente | Tecnologia | Provedor (Free Tier) | Estratégia de Otimização |
|------------|------------|----------------------|--------------------------|
| **Frontend** | React + Vite + Shadcn/UI | Vercel | Optimistic UI, Retry Pattern no React Query, Compressão de imagens no cliente |
| **Backend** | Django Rest Framework | Render | "Waking Pixel" para mitigar Cold Start, UptimeRobot Keep-Alive |
| **Database** | PostgreSQL 16 | Supabase | Uso obrigatório do Transaction Pooler (Porta 6543) |
| **Cache/Queue** | Redis | Upstash | Cache de API e Broker para mensageria leve |
| **Workers** | Python Threading + CRON | GitHub Actions | Substituição de Workers pagos por CRON externo disparando Webhooks seguros |

### 🔄 Fluxo de Dados

1. **Frontend (Vercel)** → Edge Network com cache de assets
2. **Backend (Render)** → Container Docker com Gunicorn + Django
3. **Database (Supabase)** → PostgreSQL via Transaction Pooler
4. **Cache (Upstash)** → Redis serverless para response cache

---

## 🚀 Instalação e Setup Local

### 📋 Pré-requisitos

- Python 3.11+
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (Free Tier)
- Conta no [Upstash](https://upstash.com) (Free Tier)

### 1️⃣ Configuração do Backend

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/davus-engenharia.git
cd davus-engenharia/backend

# Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate no Windows

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# IMPORTANTE: Use a porta 6543 do Supabase no DATABASE_URL

# Execute as migrações
python manage.py migrate

# Crie um superusuário
python manage.py createsuperuser

# Inicie o servidor
python manage.py runserver
```

### 2️⃣ Configuração do Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure o .env.local
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🔐 Variáveis de Ambiente

### Backend (.env)

```bash
SECRET_KEY=sua-chave-secreta-django
DEBUG=True
ALLOWED_HOSTS=*

# Supabase Database (IMPORTANTE: Usar porta 6543 - Transaction Pooler)
DATABASE_URL=postgres://user:pass@pooler.supabase.com:6543/postgres

# Upstash Redis
REDIS_URL=rediss://default:pass@upstash.io:6379

# Supabase Storage
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-service-role-key

# GitHub Actions CRON
CRON_API_KEY=chave-secreta-para-github-actions

# Email (SendGrid ou Gmail SMTP)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

### Frontend (.env.local)

```bash
VITE_API_URL=https://davus-backend.onrender.com/api/v1
```

---

## 📚 Documentação Técnica

A documentação completa do projeto encontra-se na pasta `/docs`. Recomenda-se a leitura na seguinte ordem:

1. **[TDD (Technical Design Document)](docs/TDD.md)** - Visão macro, arquitetura e decisões técnicas
2. **[Schema & Dicionário de Dados](docs/1.%20Database%20Schema%20%26%20Data%20Dictionary.md)** - Estrutura do banco SQL e Models
3. **[Especificação de API](docs/2.%20API%20Specification%20%26%20Contracts.md)** - Endpoints, contratos JSON e tratamento de erros
4. **[Arquitetura Frontend](docs/3.%20Frontend%20Architecture%20%26%20Component%20Guide.md)** - Guia de componentes, React Query e Stores
5. **[Async Tasks](docs/4.%20Async%20Tasks%20%26%20Background%20Workers.md)** - Lógica de cron jobs via GitHub Actions
6. **[Manual de DevOps](docs/5.%20DevOps%20%26%20Infrastructure%20Manual.md)** - Guia passo-a-passo para deploy

---

## 🚢 Deploy em Produção

### 📝 Resumo do Processo

O deploy é automatizado mas requer configuração inicial manual devido à natureza "Free Tier".

#### 1. Banco de Dados (Supabase)

- Criar projeto e habilitar extensões `uuid-ossp` e `pg_trgm`
- Copiar a **Connection String do Transaction Pooler** (porta 6543)
- Criar bucket de storage público: `davus-media`

#### 2. Cache (Upstash)

- Criar database Redis
- Copiar endpoint `rediss://...` (com SSL habilitado)

#### 3. Backend (Render)

```yaml
Runtime: Python 3
Build Command: pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
Start Command: gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120
```

Configurar todas as variáveis de ambiente listadas acima.

#### 4. Frontend (Vercel)

- Importar repositório do GitHub
- Build settings: Default do Vite (`npm run build`, output `dist`)
- Configurar `VITE_API_URL` apontando para o Render

#### 5. Keep-Alive (UptimeRobot)

- Criar monitor HTTP(s) para `https://[seu-backend].onrender.com/health/`
- Intervalo: 5 minutos
- **Efeito**: Reduz cold start de 30s para 2-3s

#### 6. Tarefas Agendadas (GitHub Actions)

Configurar workflow `.github/workflows/daily_checks.yml` para acordar o servidor e processar e-mails.

> 📖 **Para instruções detalhadas**, consulte o [Manual de DevOps](docs/5.%20DevOps%20%26%20Infrastructure%20Manual.md)

---

## 🛡️ Segurança e RBAC

O sistema implementa controle de acesso baseado em funções (RBAC) com três níveis:

| Perfil | Permissões | Restrições |
|--------|-----------|------------|
| **ADMIN** | Acesso irrestrito, Hard Delete, Ajustes manuais | - |
| **MANAGER** | Leitura/Escrita em Estoque e Ativos, Aprovação de compras | Não pode excluir histórico de auditoria |
| **OPERATOR** | Criação de Movimentações (IN/OUT), Check-in/Check-out | Não vê valores monetários (R$) |

---

## 🎯 Estratégias de Performance

### Frontend

- ✅ **Optimistic UI** com React Query
- ✅ **Retry Pattern** automático (3 tentativas)
- ✅ **Compressão de imagens** no cliente (WebP, max 500KB)
- ✅ **Service Worker** para cache de assets
- ✅ **Debounce** em inputs de busca

### Backend

- ✅ **Transaction Pooler** do Supabase (porta 6543)
- ✅ **Response Cache** no Redis (Upstash)
- ✅ **Lock Pessimista** em operações de estoque
- ✅ **Índices compostos** em colunas de filtro frequente

### Infraestrutura

- ✅ **UptimeRobot** mantém servidor acordado
- ✅ **GitHub Actions** substitui workers pagos
- ✅ **Edge Network** da Vercel para CDN global

---

## 🐛 Troubleshooting

### Backend demora muito para responder

**Causa**: Cold start do Render (servidor hibernou após 15 min).

**Solução**: Configure o UptimeRobot para fazer ping a cada 5 minutos no endpoint `/health/`.

### Erro de conexão com o banco de dados

**Causa**: Uso da porta 5432 (Session) ao invés da 6543 (Transaction Pooler).

**Solução**: Verifique se `DATABASE_URL` está usando a porta **6543** do Supabase.

### Imagens muito grandes

**Causa**: Compressão não está sendo aplicada no cliente.

**Solução**: Verifique se `ImageCompressor.ts` está sendo chamado antes do upload.

---

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido como trabalho acadêmico com a participação dos seguintes membros:

### Desenvolvedores

- **[@charlles-dev](https://github.com/charlles.dev)** - Desenvolvedor Full Stack
- **[@Flaviano rodrigues](https://github.com/flavianorodrigues147-a11y)** - Desenvolvedor Backend - Banco de Dados
- **[@Weidy Lucena](https://github.com/Weidyzk)** - Desenvolvedor Backend
- **[@Savio Bezzera](https://github.com/saviobezerra)** - Desenvolvedor Backend
- **[@Rafael Leal](https://github.com/rafaelalm-Leal)** - Desenvolvedor Backend
- **[@Edielson Miranda](https://github.com/EdiConha)** - Desenvolvedor Backend

### Orientação Acadêmica

- **[@profanacgpb](https://github.com/profanacgpb)** - Professora Orientadora

> 💡 **Agradecimento especial** à nossa orientadora, que foi fundamental para o sucesso deste projeto, fornecendo direcionamento técnico e apoio durante todo o desenvolvimento.

---

## 📄 Licença

Este projeto é **privado** e de propriedade exclusiva da **Davus Engenharia**. 

**Todos os direitos reservados © 2025.**

⚠️ Este repositório não aceita contribuições externas e destina-se exclusivamente ao uso interno da equipe.

---

<div align="center">
  <img src="https://raw.githubusercontent.com/gist/charlles-dev/410bff640e5083963d93204204e09d77/raw/524bfa3aa59c4e68bae9ce4ee9dbcc1f784c8aca/davus03.svg" alt="Davus Icon" width="60px" />
  
  <p><strong>Davus Engenharia</strong></p>
  <p>Sistema de Controle de Estoque e Patrimônio</p>
  <p>Desenvolvido com ❤️ usando tecnologias open-source</p>
</div>
