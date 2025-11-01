# 🏗️ SIGA - Sistema de Controle de Estoque e Patrimônio

![SIGA Davus](https://page.gensparksite.com/v1/base64_upload/62f43d6d2f8a434e3d58d5a7964401a6)

Plataforma completa para controle de estoque e patrimônio da **Davus Engenharia**, ajudando a reduzir perdas, organizar bens e produtos, gerar relatórios e apoiar decisões de forma prática e eficiente.

## 🎯 Funcionalidades Principais

### 📦 Gestão de Produtos
- ✅ Cadastro completo de produtos (código, nome, descrição, categoria, fornecedor)
- ✅ Controle de estoque atual, mínimo e máximo
- ✅ Alertas de estoque baixo e produtos zerados
- ✅ Busca e filtros avançados
- ✅ Controle de preços (custo e venda)

### 🔄 Movimentações
- ✅ Registro de entradas, saídas, ajustes, devoluções
- ✅ Histórico completo com usuário e data/hora
- ✅ Controle de perda e transferências
- ✅ Cálculo automático de valores

### 🏢 Patrimônio
- ✅ Cadastro de bens patrimoniais
- ✅ Controle de valor de compra e valor atual
- ✅ Localização e responsável
- ✅ Controle de manutenção e garantia

### 📊 Dashboard e Relatórios
- ✅ Visão geral de produtos e patrimônio
- ✅ KPIs e indicadores
- ✅ Produtos com estoque baixo
- ✅ Movimentações recentes

### 👥 Controle de Acesso
- ✅ Sistema de autenticação com JWT
- ✅ Níveis de permissão (Admin, Gerente, Operador)
- ✅ Auditoria de movimentações

## 🛠️ Stack Técnica

### Frontend
- **Framework:** React 18 com Vite
- **Estilização:** TailwindCSS + Shadcn/UI
- **Roteamento:** React Router DOM
- **Estado:** Context API / Zustand
- **HTTP Client:** Axios
- **Ícones:** Lucide React

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL 15
- **Autenticação:** JWT + bcryptjs
- **Validação:** Express Validator

### DevOps
- **Containerização:** Docker + Docker Compose
- **Proxy Reverso:** Nginx (produção)
- **Versionamento:** Git

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+ (ou Docker)
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <repository-url>
cd webapp
```

### 2. Configure as variáveis de ambiente

```bash
# Copie os arquivos de exemplo
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Com Docker (Recomendado)

```bash
# Inicie todos os serviços
docker-compose up -d

# Aguarde os containers iniciarem
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
```

### 4. Sem Docker (Desenvolvimento)

**Terminal 1 - Banco de Dados:**
```bash
# Certifique-se que o PostgreSQL está rodando
# Crie o banco: siga_davus
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npx prisma db seed
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Acesso ao Sistema

Após iniciar o sistema, acesse:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

**Credenciais padrão:**
- Email: `admin@davus.com`
- Senha: `admin123`

## 📁 Estrutura do Projeto

```
webapp/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (DB, JWT)
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── middleware/      # Middlewares (auth, errors)
│   │   ├── routes/          # Rotas da API
│   │   ├── app.js           # App Express
│   │   └── server.js        # Servidor
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco
│   │   └── seed.js          # Dados iniciais
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── ui/          # Componentes UI base
│   │   │   └── layout/      # Layout da aplicação
│   │   ├── pages/           # Páginas
│   │   ├── services/        # Serviços API
│   │   ├── lib/             # Utilitários
│   │   ├── styles/          # Estilos globais
│   │   ├── App.jsx          # App principal
│   │   └── main.jsx         # Entry point
│   └── package.json
├── docker/
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docker-compose.yml
└── README.md
```

## 🎨 Design System - Davus

O sistema utiliza as cores do branding da Davus, inspiradas no pôr do sol:

- **Laranja Principal:** `#FF6B35` - Cor estimulante e energética
- **Coral:** `#FF8C61` - Tom complementar suave
- **Pêssego:** `#FFB088` - Tom claro para destaques
- **Roxo:** `#6B5B95` - Contraste sofisticado

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Detalhes do produto
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto
- `GET /api/products/stats` - Estatísticas
- `GET /api/products/low-stock` - Produtos com estoque baixo

### Movimentações
- `GET /api/movements` - Listar movimentações
- `POST /api/movements` - Criar movimentação
- `GET /api/movements/stats` - Estatísticas

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Patrimônio
- `GET /api/assets` - Listar patrimônio
- `GET /api/assets/:id` - Detalhes do patrimônio
- `POST /api/assets` - Criar patrimônio
- `PUT /api/assets/:id` - Atualizar patrimônio
- `DELETE /api/assets/:id` - Deletar patrimônio
- `GET /api/assets/stats` - Estatísticas

### Dashboard
- `GET /api/dashboard/overview` - Visão geral do sistema

## 🔐 Níveis de Permissão

- **ADMIN:** Acesso total ao sistema
- **MANAGER:** Gerenciamento de produtos, categorias e movimentações
- **OPERATOR:** Visualização e registro de movimentações

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é proprietário da **Davus Engenharia**.

## 👨‍💻 Desenvolvido por

**GenSpark AI Developer** para **Davus Engenharia**

---

Para mais informações, entre em contato com a equipe de TI da Davus Engenharia.
