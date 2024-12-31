import { build } from 'esbuild';
import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';
import { clean } from 'esbuild-plugin-clean';

await build({
  entryPoints: ['src/crud/lambda.ts'],
  outdir: 'dist',
  // outbase: 'src',
  sourcemap: true,
  platform: 'node',
  target: 'node20',
  bundle: true,
  minify: true,
  external: ['@nestjs/microservices', '@nestjs/websockets/socket-module'],
  plugins: [
    esbuildPluginDecorator({
      tsconfigPath: 'tsconfig.json',
    }),
    clean({
      patterns: ['./dist/*'],
    }),
  ],
});
