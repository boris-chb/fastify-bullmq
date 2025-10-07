import { envsafe, str } from 'envsafe';

export const env = envsafe({
  REDIS_URL: str({
    devDefault: 'redis://defaultUser:defaultPass@localhost:6379',
  }),
});
