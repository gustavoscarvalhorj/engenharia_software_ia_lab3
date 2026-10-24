import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/app/', import.meta.url));
const violations = [];

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(path);
      continue;
    }
    if (extname(path) !== '.ts') continue;

    const file = relative(root, path).replaceAll('\\', '/');
    const source = await readFile(path, 'utf8');
    if (file.startsWith('shared/') && /from ['"][^'"]*features\//.test(source)) {
      violations.push(`${file}: shared não pode depender de features`);
    }
    if (
      file.startsWith('features/hotel-search/') &&
      /from ['"][^'"]*(features\/checkout|checkout\/)/.test(source)
    ) {
      violations.push(`${file}: hotel-search não pode importar checkout`);
    }
    if (
      file.startsWith('features/checkout/') &&
      /from ['"][^'"]*(features\/hotel-search|hotel-search\/)/.test(source)
    ) {
      violations.push(`${file}: checkout não pode importar hotel-search`);
    }
    if (file.startsWith('features/') && /from ['"][^'"]*mocks\//.test(source)) {
      violations.push(`${file}: páginas e features não podem importar mocks`);
    }
  }
}

await inspect(root);
if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Fronteiras arquiteturais validadas.');
}
