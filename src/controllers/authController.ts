import { eq } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { JWT } from '../config/constants';
import { db } from '../db/connection';
import { user } from '../db/schema';
import type { LoginInput, RegisterInput } from '../schemas/auth';
import { Errors } from '../types/errors';
import { comparePassword, generateJWTPayload, hashPassword } from '../utils/auth';
import { sanitizeUser } from '../utils/helpers';

export const register = async (
  request: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) => {
  const { email, password, firstName, lastName } = request.body;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Errors.ConflictError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(user)
    .values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    })
    .returning({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
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
  const [user1] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!user1) {
    throw new Errors.AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new Errors.AuthenticationError('Invalid email or password');
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

  const [user1] = await db
    .select({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!user1) {
    throw new Errors.NotFoundError('User not found');
  }

  return reply.success({ user }, 'Profile retrieved successfully');
};