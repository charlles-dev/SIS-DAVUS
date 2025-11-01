const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const prisma = require('../config/database');

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Verificar se usuário já existe
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'OPERATOR',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      res.status(201).json({ user, token });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Buscar usuário
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar se usuário está ativo
      if (!user.active) {
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
