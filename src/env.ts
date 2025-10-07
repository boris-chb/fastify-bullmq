import { envsafe, port, str } from 'envsafe';

export const env = envsafe({
  PORT: port({ devDefault: 3000 }),
  REDIS_URL: str({
    devDefault: 'redis://defaultUser:defaultPass@localhost:6379',
  }),
  RAILWAY_PUBLIC_DOMAIN: str({ devDefault: 'localhost' }),
});
