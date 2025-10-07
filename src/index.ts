import { env } from '@/env';
import { createQueue, setupQueueProcessor } from '@/queue';

import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';
import { createBullBoard } from '@bull-board/api';

interface AddJobQueryString {
  id: string;
  email: string;
}

const run = async () => {
  const welcomeEmailQueue = createQueue('WelcomeEmailQueue');
  await setupQueueProcessor(welcomeEmailQueue.name);

  const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
    Fastify();

  const serverAdapter = new FastifyAdapter();
  serverAdapter.setBasePath('/');
  createBullBoard({
    queues: [new BullMQAdapter(welcomeEmailQueue)],
    serverAdapter,
  });

  server.register(serverAdapter.registerPlugin());

  server.get(
    '/add-job',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
          },
          required: ['id', 'email'],
        },
      },
    },
    (req: FastifyRequest<{ Querystring: AddJobQueryString }>, reply) => {
      const { id, email } = req.query;
      welcomeEmailQueue.add(`WelcomeEmail-${id}`, { email });
      reply.send({ ok: true });
    }
  );

  console.log(env);

  await server.listen({ port: env.PORT, host: '0.0.0.0' });
  console.log(
    `Server running: http://localhost:${env.PORT}/add-job?id=1&email=hello%40world.com`
  );
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
