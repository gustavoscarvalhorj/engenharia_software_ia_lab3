import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

async function enableMocking(): Promise<void> {
  const { mockWorker } = await import('./app/mocks/browser');
  await mockWorker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}

enableMocking()
  .then(() => bootstrapApplication(App, appConfig))
  .catch((error: unknown) => console.error('Falha ao iniciar a aplicação.', error));
