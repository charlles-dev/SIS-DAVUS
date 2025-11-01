const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@davus.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@davus.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Materiais de Construção' },
      update: {},
      create: {
        name: 'Materiais de Construção',
        description: 'Cimento, areia, brita, etc.',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Ferramentas' },
      update: {},
      create: {
        name: 'Ferramentas',
        description: 'Ferramentas manuais e elétricas',
      },
    }),
    prisma.category.upsert({
      where: { name: 'EPIs' },
      update: {},
      create: {
        name: 'EPIs',
        description: 'Equipamentos de Proteção Individual',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Elétrica' },
      update: {},
      create: {
        name: 'Elétrica',
        description: 'Materiais elétricos',
      },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // Criar fornecedor
  const supplier = await prisma.supplier.upsert({
    where: { cnpj: '12.345.678/0001-90' },
    update: {},
    create: {
      name: 'Construtora ABC',
      cnpj: '12.345.678/0001-90',
      email: 'contato@construtoraabc.com',
      phone: '(83) 3333-4444',
      address: 'Rua das Obras, 123 - Campina Grande/PB',
    },
  });
  console.log('✅ Supplier created:', supplier.name);

  // Criar produtos de exemplo
  const products = await Promise.all([
    prisma.product.upsert({
      where: { code: 'CIMENTO-50KG' },
      update: {},
      create: {
        code: 'CIMENTO-50KG',
        name: 'Cimento Portland 50kg',
        description: 'Cimento Portland CPII-E-32',
        unit: 'SC',
        currentStock: 100,
        minStock: 50,
        maxStock: 200,
        costPrice: 32.50,
        salePrice: 45.00,
        location: 'Depósito A - Prateleira 1',
        categoryId: categories[0].id,
        supplierId: supplier.id,
      },
    }),
    prisma.product.upsert({
      where: { code: 'CAPACETE-BRANCO' },
      update: {},
      create: {
        code: 'CAPACETE-BRANCO',
        name: 'Capacete de Segurança Branco',
        description: 'Capacete de segurança com carneira',
        unit: 'UN',
        currentStock: 25,
        minStock: 30,
        maxStock: 100,
        costPrice: 18.00,
        salePrice: 28.00,
        location: 'Almoxarifado - Prateleira 5',
        categoryId: categories[2].id,
        supplierId: supplier.id,
      },
    }),
    prisma.product.upsert({
      where: { code: 'FURADEIRA-IMPACTO' },
      update: {},
      create: {
        code: 'FURADEIRA-IMPACTO',
        name: 'Furadeira de Impacto 650W',
        description: 'Furadeira de impacto profissional',
        unit: 'UN',
        currentStock: 5,
        minStock: 3,
        maxStock: 10,
        costPrice: 280.00,
        salePrice: 420.00,
        location: 'Depósito B - Armário 2',
        categoryId: categories[1].id,
        supplierId: supplier.id,
      },
    }),
  ]);
  console.log('✅ Products created:', products.length);

  // Criar patrimônio de exemplo
  const assets = await Promise.all([
    prisma.asset.upsert({
      where: { code: 'VEIC-001' },
      update: {},
      create: {
        code: 'VEIC-001',
        name: 'Caminhão Basculante',
        description: 'Caminhão para transporte de materiais',
        purchaseDate: new Date('2022-01-15'),
        purchaseValue: 250000.00,
        currentValue: 220000.00,
        location: 'Garagem Principal',
        responsible: 'João Silva',
        status: 'ACTIVE',
        serialNumber: 'ABC123XYZ',
        maintenanceDate: new Date('2024-12-15'),
      },
    }),
    prisma.asset.upsert({
      where: { code: 'COMP-001' },
      update: {},
      create: {
        code: 'COMP-001',
        name: 'Computador Dell i7',
        description: 'Computador para escritório',
        purchaseDate: new Date('2023-06-10'),
        purchaseValue: 4500.00,
        currentValue: 3200.00,
        location: 'Escritório - Sala 1',
        responsible: 'Maria Santos',
        status: 'ACTIVE',
        serialNumber: 'SN789456123',
        warrantyExpires: new Date('2025-06-10'),
      },
    }),
  ]);
  console.log('✅ Assets created:', assets.length);

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
