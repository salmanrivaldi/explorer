import { Elysia } from 'elysia';
import { readdirSync } from 'fs';
import { join } from 'path';
import { cors } from '@elysiajs/cors';

const PORT = 8080;
const app = new Elysia();

app.get('/', () => 'Welcome...!');

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

const routeDir = join(import.meta.dir, 'routes');
const routeFiles = readdirSync(routeDir).filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of routeFiles) {
  const routeModule = await import(`./routes/${file}`);
  const route = routeModule.default ?? Object.values(routeModule)[0];
  app.use(route);
}

app.onError(({ error }: any) => {
  return {
    code: 500,
    status: 'error',
    message: error?.message || 'Unexpected error',
  };
});

app.listen(PORT);
console.log(`Server listening at port: ${PORT}`);
