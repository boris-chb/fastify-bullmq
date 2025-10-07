import { envsafe, port, str } from 'envsafe';

export const env = envsafe({
  PORT: port({ devDefault: 3000, input: process.env.PORT }),
  REDIS_URL: str({
    devDefault: 'redis://defaultUser:defaultPass@localhost:6379',
    input: process.env.REDIS_URL,
  }),
  RAILWAY_PUBLIC_DOMAIN: str({
    devDefault: 'localhost',
    input: process.env.RAILWAY_PUBLIC_DOMAIN,
  }),
});
