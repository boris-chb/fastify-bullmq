import { envsafe, port, str } from 'envsafe';
export const env = envsafe({
    REDISHOST: str({ default: process.env.RAILWAY_PRIVATE_DOMAIN }),
    REDISPORT: port({ default: Number(process.env.REDISPORT) || 6379 }),
    REDISUSER: str({ default: process.env.REDISUSER }),
    REDISPASSWORD: str({ default: process.env.REDIS_PASSWORD }),
    PORT: port({ devDefault: 3000 }),
    RAILWAY_STATIC_URL: str({ devDefault: 'http://localhost:3000' }),
    REDIS_URL: str({
        devDefault: 'redis://defaultUser:defaultPass@localhost:6379',
    }),
});
