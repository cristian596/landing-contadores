// Compila el sitio con valores de prueba y lo sirve para Playwright, sin tocar dist/ ni .env.
import { spawn } from 'node:child_process';

const env = {
  ...process.env,
  PUBLIC_GA_ID: 'G-TEST12345',
  PUBLIC_FORM_ENDPOINT: 'https://formularios.example.test/enviar',
};
const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(`npx astro ${args.join(' ')}`, { env, stdio: 'inherit', shell: true });
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`astro ${args[0]} terminó con ${code}`)),
    );
  });

await run(['build', '--outDir', 'dist-e2e']);
await run(['preview', '--outDir', 'dist-e2e', '--port', '4323']);
