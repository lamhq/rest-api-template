import { createApp } from './app';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await createApp(AppModule);
  await app.listen(process.env.PORT || 3000);
}

bootstrap().catch((error: unknown) => {
  console.error('Unhandled error during bootstrap:', error);
});
