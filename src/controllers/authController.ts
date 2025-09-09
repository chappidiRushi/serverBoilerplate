import type { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { HTTP_STATUS, MESSAGES, JWT } from '../config/constants';
import { hashPassword, comparePassword, generateJWTPayload } from '../utils/auth';
import type { RegisterInput, LoginInput } from '../schemas/auth';

export const register = async (
  request: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) => {
  const { email, password, firstName, lastName } = request.body;

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return reply.status(HTTP_STATUS.CONFLICT).send({
        error: MESSAGES.ERROR.CONFLICT,
        message: 'User with this email already exists'
      });
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

    // Generate JWT
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    const payload = generateJWTPayload(newUser);
    const token = await reply.jwtSign(payload, { expiresIn: JWT.EXPIRES_IN });

    return reply.status(HTTP_STATUS.CREATED).send({
      message: MESSAGES.SUCCESS.CREATED,
      data: {
        user: newUser,
        token,
      }
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;

  try {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
        error: MESSAGES.ERROR.UNAUTHORIZED,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
        error: MESSAGES.ERROR.UNAUTHORIZED,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const payload = generateJWTPayload(user);
    const token = await reply.jwtSign(payload, { expiresIn: JWT.EXPIRES_IN });

    const { password: _, ...userWithoutPassword } = user;

    return reply.status(HTTP_STATUS.OK).send({
      message: MESSAGES.SUCCESS.FETCHED,
      data: {
        user: userWithoutPassword,
        token,
      }
    });
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user!.id;

  try {
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
      return reply.status(HTTP_STATUS.NOT_FOUND).send({
        error: MESSAGES.ERROR.NOT_FOUND,
        message: 'User not found'
      });
    }

    return reply.status(HTTP_STATUS.OK).send({
      message: MESSAGES.SUCCESS.FETCHED,
      data: { user }
    });
  } catch (error) {
    throw error;
  }
};