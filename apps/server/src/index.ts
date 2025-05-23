import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { fileApp } from './module/files/app.js';
import { PrismaClient } from '@prisma/client';
import { logger } from 'hono/logger';
import { linkHono } from './module/link/app.js';
import { cors } from 'hono/cors';
import { loadResounceDexConfig } from '~/config/resounceDex_config.js';
import { ErrResponse } from './common/response.js';
import 'dotenv/config';

//Loading ResourceDex Config;
loadResounceDexConfig();

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: 'http://localhost:7930'
  })
);

app.route('/api/files', fileApp);
app.route('/api/link', linkHono);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

serve(
  {
    fetch: app.fetch,
    port: 7940
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

app.onError((e, c) => {
  if (e instanceof Error) {
    return ErrResponse(null, e.message, e).make();
  }
  return ErrResponse(null, 'found something wrontg', e).make();
});
