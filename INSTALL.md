# 🚀 Guia de Instalação - SIGA Davus

## Pré-requisitos

- **Node.js** 18 ou superior
- **PostgreSQL** 15 ou superior (ou Docker)
- **npm** ou **yarn**
- **Git**

## Instalação Rápida com Docker (Recomendado)

A forma mais fácil de executar o sistema é usando Docker:

```bash
# 1. Clone o repositório
git clone https://github.com/charlles-dev/SIGA-DAVUS.git
cd SIGA-DAVUS

# 2. Inicie todos os serviços
docker-compose up -d

# 3. Aguarde a inicialização (cerca de 30 segundos)
# O sistema estará disponível em:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
```

## Instalação Manual (Desenvolvimento)

### 1. Clone o repositório

```bash
git clone https://github.com/charlles-dev/SIGA-DAVUS.git
cd SIGA-DAVUS
```

### 2. Configure o Banco de Dados

**Opção A: PostgreSQL Local**

```bash
# Instale o PostgreSQL 15+
# Crie o banco de dados
psql -U postgres
CREATE DATABASE siga_davus;
CREATE USER davus WITH PASSWORD 'davus123';
GRANT ALL PRIVILEGES ON DATABASE siga_davus TO davus;
\q
```

**Opção B: PostgreSQL com Docker**

```bash
docker run --name siga-postgres \
  -e POSTGRES_USER=davus \
  -e POSTGRES_PASSWORD=davus123 \
  -e POSTGRES_DB=siga_davus \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 3. Configure as Variáveis de Ambiente

```bash
# Copie os arquivos de exemplo
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edite os arquivos .env conforme necessário
```

### 4. Instale as Dependências do Backend

```bash
cd backend

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Popular banco com dados iniciais
npx prisma db seed
```

### 5. Instale as Dependências do Frontend

```bash
cd ../frontend

# Instalar dependências
npm install
```

### 6. Inicie o Sistema

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

O backend estará rodando em: http://localhost:3001

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

O frontend estará rodando em: http://localhost:3000

## Acesso ao Sistema

Após a instalação, acesse o sistema em: http://localhost:3000

**Credenciais padrão:**
- Email: `admin@davus.com`
- Senha: `admin123`

## Comandos Úteis

### Backend

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Prisma Studio (interface visual do banco)
npx prisma studio

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Resetar banco de dados
npx prisma migrate reset
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild containers
docker-compose build
docker-compose up -d
```

## Verificação da Instalação

### 1. Backend

Teste se o backend está funcionando:

```bash
curl http://localhost:3001/api/health
# Deve retornar: {"status":"ok","timestamp":"..."}
```

### 2. Frontend

Acesse http://localhost:3000 no navegador. Você deve ver a tela de login.

### 3. Banco de Dados

Verifique a conexão com o banco:

```bash
cd backend
npx prisma studio
```

Isso abrirá uma interface visual em http://localhost:5555

## Solução de Problemas

### Erro: "Port 5432 already in use"

Outro serviço PostgreSQL está rodando. Pare-o ou mude a porta no `.env`:

```bash
# Parar PostgreSQL local
sudo systemctl stop postgresql

# Ou mude a porta no docker-compose.yml
```

### Erro: "Cannot find module '@prisma/client'"

Regenere o Prisma Client:

```bash
cd backend
npx prisma generate
```

### Erro: "EADDRINUSE: address already in use :::3001"

A porta 3001 está em uso. Mate o processo ou mude a porta:

```bash
# Encontrar processo
lsof -ti:3001

# Matar processo
kill -9 $(lsof -ti:3001)
```

### Frontend não carrega dados

Verifique se o backend está rodando e se a variável `VITE_API_URL` está correta:

```bash
# frontend/.env
VITE_API_URL=http://localhost:3001/api
```

## Build para Produção

### Backend

```bash
cd backend
npm run build  # Se houver script de build
npm start
```

### Frontend

```bash
cd frontend
npm run build

# Os arquivos estarão em frontend/dist/
# Sirva com nginx, apache ou outro servidor
```

### Com Docker

```bash
# Build de todos os containers
docker-compose build

# Inicie em modo produção
docker-compose up -d
```

## Próximos Passos

Após a instalação:

1. Mude a senha do usuário admin
2. Crie novos usuários com permissões adequadas
3. Configure as categorias de produtos
4. Cadastre fornecedores
5. Comece a cadastrar produtos

## Suporte

Para problemas ou dúvidas:
- Abra uma issue no GitHub
- Entre em contato com a equipe de TI da Davus Engenharia

---

**Desenvolvido por:** GenSpark AI Developer
**Cliente:** Davus Engenharia
