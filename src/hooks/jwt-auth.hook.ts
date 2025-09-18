import { FastifyReply, FastifyRequest } from 'fastify';

// export async function jwtAuthHook(fastify: FastifyInstance) {

//   fastify.addHook('preHandler', async (request, reply) => {

//   });
// }

const publicRoutePatterns = [/^\/login$/, /^\/register$/, /^\/docs(\/.*)?$/];

export const jwtAuthHook = async function (request: FastifyRequest, reply: FastifyReply) {
  const url = request.routeOptions?.url ?? request.url;
  if (publicRoutePatterns.some((pattern) => pattern.test(url))) {
    return;
  }
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
};