import { initFederation } from '@angular-architects/native-federation';

(globalThis as { ngDevMode?: boolean }).ngDevMode ??= true;

initFederation()
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
