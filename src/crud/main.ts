import { getNestApp } from './app';

async function bootstrap() {
  const app = await getNestApp();
  await app.listen(3000);
}

bootstrap();
