import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const JWT_SECRET = process.env.JWT_SECRET ?? 'development-secret';

app.use(cors());
app.use(express.json());

const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Backend funcionando' });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ message: 'Este email ya está registrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email },
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    token,
    user: { id: user.id, email: user.email },
  });
});

app.get('/api/auth/me', requireAuth, async (req: any, res) => {
  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

app.get('/api/tournaments', requireAuth, async (req: any, res) => {
  const tournaments = await prisma.tournament.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({
    tournaments: tournaments.map((t) => ({
      ...t,
      teams: JSON.parse(t.teams || '[]'),
      matches: JSON.parse(t.matches || '[]'),
    })),
  });
});

app.post('/api/tournaments', requireAuth, async (req: any, res) => {
  const { name, status, startDate, endDate, inscriptionFee, teams, matches } = req.body ?? {};

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ message: 'Faltan datos del torneo' });
  }

  const tournament = await prisma.tournament.create({
    data: {
      id: typeof req.body.id === 'string' ? req.body.id : undefined,
      userId: req.user.id,
      name,
      status: status ?? 'Programado',
      startDate,
      endDate,
      inscriptionFee: Number(inscriptionFee ?? 0),
      teams: JSON.stringify(Array.isArray(teams) ? teams : []),
      matches: JSON.stringify(Array.isArray(matches) ? matches : []),
    },
  });

  return res.status(201).json({
    tournament: {
      ...tournament,
      teams: JSON.parse(tournament.teams || '[]'),
      matches: JSON.parse(tournament.matches || '[]'),
    },
  });
});

app.put('/api/tournaments/:id', requireAuth, async (req: any, res) => {
  const { id } = req.params;
  const { name, status, startDate, endDate, inscriptionFee, teams, matches } = req.body ?? {};

  const existing = await prisma.tournament.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!existing) {
    return res.status(404).json({ message: 'Torneo no encontrado' });
  }

  const updated = await prisma.tournament.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      status: status ?? existing.status,
      startDate: startDate ?? existing.startDate,
      endDate: endDate ?? existing.endDate,
      inscriptionFee: inscriptionFee ?? existing.inscriptionFee,
      teams: teams ? JSON.stringify(teams) : existing.teams,
      matches: matches ? JSON.stringify(matches) : existing.matches,
    },
  });

  return res.json({
    tournament: {
      ...updated,
      teams: JSON.parse(updated.teams || '[]'),
      matches: JSON.parse(updated.matches || '[]'),
    },
  });
});

app.delete('/api/tournaments/:id', requireAuth, async (req: any, res) => {
  const { id } = req.params;

  const existing = await prisma.tournament.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!existing) {
    return res.status(404).json({ message: 'Torneo no encontrado' });
  }

  await prisma.tournament.delete({ where: { id } });

  return res.json({ message: 'Torneo eliminado correctamente' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
