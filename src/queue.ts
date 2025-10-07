import { ConnectionOptions, Queue, Worker } from 'bullmq';

import { env } from '@/env.js';

const redisURL = new URL(env.REDIS_URL);

const connection: ConnectionOptions = {
  host: redisURL.hostname,
  port: Number(redisURL.port),
  username: redisURL.username,
  password: redisURL.password,
  family: 0,
};

export const createQueue = (name: string) => new Queue(name, { connection });

export const setupQueueProcessor = async (queueName: string) => {
  new Worker(
    queueName,
    async (job) => {
      for (let i = 0; i <= 100; i++) {
        await job.updateProgress(i);
        await job.log(`Processing job at interval ${i}`);
      }

      return { jobId: `This is the return value of job (${job.id})` };
    },
    { connection }
  );
};
