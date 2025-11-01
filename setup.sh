#!/bin/bash

echo "🚀 SIGA Davus - Setup Script"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale Node.js 18 ou superior.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) encontrado${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado. Por favor, instale npm.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm --version) encontrado${NC}"
echo ""

# Setup environment files
echo "📝 Configurando arquivos de ambiente..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .env criado${NC}"
else
    echo -e "${YELLOW}⚠️  .env já existe${NC}"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ backend/.env criado${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env já existe${NC}"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✅ frontend/.env criado${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env já existe${NC}"
fi

echo ""

# Install root dependencies
echo "📦 Instalando dependências raiz..."
npm install
echo -e "${GREEN}✅ Dependências raiz instaladas${NC}"
echo ""

# Install backend dependencies
echo "📦 Instalando dependências do backend..."
cd backend
npm install
echo -e "${GREEN}✅ Dependências do backend instaladas${NC}"
echo ""

# Check if PostgreSQL is running
echo "🔍 Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL encontrado${NC}"
    
    # Try to generate Prisma client and run migrations
    echo "🗃️  Configurando banco de dados..."
    npx prisma generate
    echo -e "${GREEN}✅ Prisma Client gerado${NC}"
    
    echo "🔄 Executando migrations..."
    npx prisma migrate deploy 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Não foi possível executar migrations automaticamente${NC}"
        echo -e "${YELLOW}   Execute manualmente: cd backend && npx prisma migrate dev${NC}"
    }
    
    echo "🌱 Populando banco com dados iniciais..."
    npx prisma db seed 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Não foi possível executar seed automaticamente${NC}"
        echo -e "${YELLOW}   Execute manualmente: cd backend && npx prisma db seed${NC}"
    }
else
    echo -e "${YELLOW}⚠️  PostgreSQL não encontrado${NC}"
    echo -e "${YELLOW}   Você pode usar Docker: docker-compose up -d${NC}"
fi

cd ..
echo ""

# Install frontend dependencies
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
echo -e "${GREEN}✅ Dependências do frontend instaladas${NC}"
cd ..
echo ""

# Summary
echo "=============================="
echo -e "${GREEN}🎉 Setup concluído!${NC}"
echo ""
echo "Para iniciar o sistema:"
echo ""
echo "  Opção 1 - Com Docker (Recomendado):"
echo "    docker-compose up -d"
echo ""
echo "  Opção 2 - Manual:"
echo "    Terminal 1: cd backend && npm run dev"
echo "    Terminal 2: cd frontend && npm run dev"
echo ""
echo "  Acesse: http://localhost:3000"
echo "  Login: admin@davus.com / admin123"
echo ""
echo "=============================="
