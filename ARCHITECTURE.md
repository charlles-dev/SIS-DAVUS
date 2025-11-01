# 🏗️ Arquitetura do Sistema SIGA Davus

## Visão Geral

O SIGA (Sistema Integrado de Gestão de Ativos) é uma aplicação full-stack moderna construída com arquitetura de três camadas:

```
┌─────────────────────────────────────────────────┐
│              Frontend (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Pages   │  │Components│  │ Services │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
                      │ HTTP/REST
                      ▼
┌─────────────────────────────────────────────────┐
│           Backend (Node.js/Express)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Routes  │→ │Controllers│→│ Services │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│         │                            │           │
│         ▼                            ▼           │
│  ┌──────────┐              ┌──────────┐         │
│  │Middleware│              │  Prisma  │         │
│  └──────────┘              └──────────┘         │
└─────────────────────────────────────────────────┘
                      │ SQL
                      ▼
┌─────────────────────────────────────────────────┐
│            Database (PostgreSQL)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Users   │  │ Products │  │Movements │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Categories│  │Suppliers │  │  Assets  │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
```

## Stack Tecnológica Detalhada

### Frontend

#### Core
- **React 18:** Biblioteca UI com Hooks e Context API
- **Vite:** Build tool moderno e rápido
- **React Router DOM:** Roteamento client-side

#### UI/Estilização
- **TailwindCSS:** Utility-first CSS framework
- **Shadcn/UI:** Componentes React acessíveis
- **Radix UI:** Primitivos de UI sem estilo
- **Lucide React:** Biblioteca de ícones

#### Gerenciamento de Estado
- **Context API:** Estado global da aplicação
- **localStorage:** Persistência de token e dados do usuário

#### Comunicação
- **Axios:** Cliente HTTP com interceptors
- **REST API:** Comunicação com backend

### Backend

#### Core
- **Node.js 18+:** Runtime JavaScript
- **Express.js:** Framework web minimalista
- **Prisma:** ORM moderno para Node.js

#### Autenticação & Segurança
- **JWT:** JSON Web Tokens para autenticação
- **bcryptjs:** Hashing de senhas
- **CORS:** Cross-Origin Resource Sharing

#### Validação & Logging
- **Express Validator:** Validação de dados
- **Morgan:** HTTP request logger

### Database

- **PostgreSQL 15:** Banco de dados relacional
- **Prisma Schema:** Definição de modelos e relações
- **Migrations:** Versionamento do schema

### DevOps

- **Docker:** Containerização
- **Docker Compose:** Orquestração de containers
- **Nginx:** Proxy reverso e servidor web

## Estrutura de Diretórios

```
webapp/
├── backend/                    # Aplicação backend
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco de dados
│   │   └── seed.js            # Dados iniciais
│   ├── src/
│   │   ├── config/            # Configurações (DB, JWT)
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── middleware/        # Middlewares (auth, errors)
│   │   ├── routes/            # Definição de rotas
│   │   ├── app.js             # Configuração Express
│   │   └── server.js          # Inicialização do servidor
│   └── package.json
│
├── frontend/                   # Aplicação frontend
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── ui/           # Componentes base (Button, Card, etc)
│   │   │   └── layout/       # Layout da aplicação
│   │   ├── pages/            # Páginas/Rotas
│   │   ├── services/         # Serviços de API
│   │   ├── lib/              # Utilitários
│   │   ├── styles/           # Estilos globais
│   │   ├── App.jsx           # Componente raiz
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docker/                     # Arquivos Docker
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
├── docs/                       # Documentação do projeto
├── docker-compose.yml
└── README.md
```

## Modelo de Dados

### Entidades Principais

#### User (Usuário)
```prisma
- id: String (UUID)
- name: String
- email: String (unique)
- password: String (hashed)
- role: Enum (ADMIN, MANAGER, OPERATOR)
- active: Boolean
```

#### Product (Produto)
```prisma
- id: String (UUID)
- code: String (unique)
- name: String
- description: String?
- unit: String
- currentStock: Int
- minStock: Int
- maxStock: Int?
- costPrice: Float
- salePrice: Float?
- location: String?
- status: Enum (ACTIVE, INACTIVE, DISCONTINUED)
- categoryId: String?
- supplierId: String?
```

#### Movement (Movimentação)
```prisma
- id: String (UUID)
- productId: String
- type: Enum (IN, OUT, ADJUSTMENT, RETURN, LOSS, TRANSFER)
- quantity: Int
- unitPrice: Float?
- totalPrice: Float?
- observation: String?
- userId: String
- createdAt: DateTime
```

#### Asset (Patrimônio)
```prisma
- id: String (UUID)
- code: String (unique)
- name: String
- description: String?
- purchaseDate: DateTime?
- purchaseValue: Float?
- currentValue: Float?
- location: String?
- responsible: String?
- status: Enum (ACTIVE, MAINTENANCE, INACTIVE, DISPOSED)
- serialNumber: String?
- warrantyExpires: DateTime?
- maintenanceDate: DateTime?
```

### Relacionamentos

```
User ──1:N──> Movement
Product ──1:N──> Movement
Category ──1:N──> Product
Supplier ──1:N──> Product
```

## Fluxo de Autenticação

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Backend │                │    DB    │
└──────────┘                └──────────┘                └──────────┘
     │                            │                            │
     │  POST /api/auth/login      │                            │
     ├───────────────────────────>│                            │
     │  { email, password }       │                            │
     │                            │  SELECT user               │
     │                            ├───────────────────────────>│
     │                            │                            │
     │                            │  user data                 │
     │                            │<───────────────────────────┤
     │                            │                            │
     │                            │  bcrypt.compare()          │
     │                            │                            │
     │                            │  jwt.sign()                │
     │                            │                            │
     │  { user, token }           │                            │
     │<───────────────────────────┤                            │
     │                            │                            │
     │  Store token in localStorage                            │
     │                            │                            │
     │  Subsequent requests       │                            │
     │  Header: Authorization:    │                            │
     │  Bearer <token>            │                            │
     ├───────────────────────────>│                            │
     │                            │  jwt.verify()              │
     │                            │                            │
     │  Protected data            │                            │
     │<───────────────────────────┤                            │
     │                            │                            │
```

## Fluxo de Movimentação de Estoque

```
1. Usuário registra movimentação (entrada/saída)
   ↓
2. Backend valida tipo de movimentação
   ↓
3. Calcula novo estoque:
   - IN/RETURN: estoque += quantidade
   - OUT/LOSS/TRANSFER: estoque -= quantidade
   - ADJUSTMENT: estoque = quantidade
   ↓
4. Verifica estoque suficiente (se saída)
   ↓
5. Inicia transação no banco
   ↓
6. Cria registro de movimentação
   ↓
7. Atualiza estoque do produto
   ↓
8. Commit da transação
   ↓
9. Retorna sucesso ao cliente
```

## API REST Endpoints

### Padrões

- **Base URL:** `/api`
- **Autenticação:** Bearer Token JWT
- **Content-Type:** application/json

### Convenções

- `GET` - Listar ou obter recursos
- `POST` - Criar novo recurso
- `PUT` - Atualizar recurso completo
- `PATCH` - Atualizar recurso parcial
- `DELETE` - Remover recurso

### Códigos de Status

- `200` - Sucesso
- `201` - Criado
- `204` - Sem conteúdo
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (duplicado)
- `500` - Erro interno

## Segurança

### Implementações

1. **Autenticação JWT**
   - Tokens com expiração
   - Refresh token strategy

2. **Senhas**
   - Hashing com bcrypt (10 rounds)
   - Nunca armazenadas em plain text

3. **Autorização**
   - Role-based access control (RBAC)
   - Middleware de verificação de permissões

4. **Validação**
   - Validação de entrada com express-validator
   - Sanitização de dados

5. **CORS**
   - Configurado para permitir apenas origens confiáveis

6. **SQL Injection**
   - Prevenção via Prisma (parametrização automática)

## Performance

### Frontend
- Code splitting com React.lazy
- Memoização com useMemo/useCallback
- Debounce em buscas
- Paginação de listagens

### Backend
- Índices no banco de dados
- Query optimization com Prisma
- Connection pooling
- Caching (futuro)

### Database
- Índices em campos de busca
- Foreign keys para integridade
- Soft deletes quando necessário

## Escalabilidade

### Horizontal
- Stateless backend (permite múltiplas instâncias)
- Load balancer (Nginx)
- Shared database

### Vertical
- Connection pooling
- Query optimization
- Índices adequados

## Monitoramento (Futuro)

- Logs estruturados
- Health checks
- Metrics (Prometheus)
- APM (Application Performance Monitoring)

## CI/CD (Futuro)

```
GitHub → Actions → Tests → Build → Docker → Deploy
```

## Melhorias Futuras

### Funcionalidades
- [ ] Relatórios em PDF
- [ ] Exportação para Excel
- [ ] Gráficos avançados (Recharts)
- [ ] Notificações em tempo real
- [ ] Código de barras/QR Code
- [ ] Impressão de etiquetas
- [ ] Histórico de preços
- [ ] Previsão de reposição

### Técnicas
- [ ] Testes unitários (Jest)
- [ ] Testes E2E (Cypress)
- [ ] CI/CD pipeline
- [ ] Logging avançado
- [ ] Caching (Redis)
- [ ] Queue system (Bull)
- [ ] WebSockets para real-time
- [ ] Backup automático

---

**Desenvolvido por:** GenSpark AI Developer  
**Cliente:** Davus Engenharia
