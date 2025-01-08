import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';

await build({
  entryPoints: ['src/api/lambda.ts', 'src/functions/pre-signup.ts'],
  outbase: 'src',
  outdir: 'dist',
  sourcemap: true,
  platform: 'node',
  target: 'node20',
  bundle: true,
  minify: true,
  external: [
    '@nestjs/microservices',
    '@nestjs/websockets/socket-module',
    'class-transformer/storage',
    'aws-lambda',
    '@aws-sdk/client-cognito-identity-provider',
  ],
  plugins: [
    esbuildPluginDecorator({
      tsconfigPath: 'tsconfig.json',
    }),
    clean({
      patterns: ['./dist/*'],
    }),
  ],
});
