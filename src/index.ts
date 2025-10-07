import { createBullBoard } from '@bull-board/api';
import { FastifyAdapter } from '@bull-board/fastify';
import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { env } from '@/env.js';

import { createQueue, setupQueueProcessor } from '@/queue.js';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

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

  await server.listen({ port: env.PORT, host: env.RAILWAY_PUBLIC_DOMAIN });
  console.log(
    `Server running: http://localhost:${env.PORT}/add-job?id=1&email=hello%40world.com`
  );
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
