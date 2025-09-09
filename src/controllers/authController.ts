import type { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { JWT } from '../config/constants';
import { hashPassword, comparePassword, generateJWTPayload } from '../utils/auth';
import { sanitizeUser } from '../utils/helpers';
import type { RegisterInput, LoginInput } from '../schemas/auth';
import { ConflictError, AuthenticationError, NotFoundError } from '../types/errors';

export const register = async (
  request: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) => {
  const { email, password, firstName, lastName } = request.body;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    })
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
    });

  if (!newUser) {
    throw new Error('Failed to create user');
  }

  // Generate JWT
  const payload = generateJWTPayload(newUser);
  const token = await reply.jwtSign(payload, { expiresIn: JWT.EXPIRES_IN });

  return reply.success({
    user: sanitizeUser(newUser),
    token,
  }, 'User registered successfully', 201);
};

export const login = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;

  // Find user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password);
  
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate JWT
  const payload = generateJWTPayload(user);
  const token = await reply.jwtSign(payload, { expiresIn: JWT.EXPIRES_IN });

  return reply.success({
    user: sanitizeUser(user),
    token,
  }, 'Login successful');
};

export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user!.id;

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return reply.success({ user }, 'Profile retrieved successfully');
};