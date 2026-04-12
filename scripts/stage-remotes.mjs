import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const shellPublic = join(root, 'yakshit-chawla-portfolio', 'frontend', 'public');

const remotes = [
  {
    manifestKey: 'eventbrite-clone',
    publicPath: 'eventpulse',
    distPath: join(root, 'eventpulse', 'dist', 'eventbrite-clone', 'browser')
  },
  {
    manifestKey: 'appointment-booking',
    publicPath: 'clinic-connect',
    distPath: join(root, 'clinic-connect', 'dist', 'appointment-booking', 'browser')
  },
  {
    manifestKey: 'document-upload',
    publicPath: 'docushare',
    distPath: join(root, 'docushare', 'dist', 'document-upload', 'browser')
  },
  {
    manifestKey: 'flight-booking',
    publicPath: 'skyfare',
    distPath: join(root, 'skyfare', 'dist', 'flight-booking', 'browser')
  },
  {
    manifestKey: 'hotel-reservation',
    publicPath: 'staybook',
    distPath: join(root, 'staybook', 'dist', 'hotel-reservation', 'browser')
  }
];

const manifest = {};

await mkdir(join(shellPublic, 'remotes'), { recursive: true });

for (const remote of remotes) {
  const target = join(shellPublic, 'remotes', remote.publicPath);
  await mkdir(target, { recursive: true });
  await cp(remote.distPath, target, { recursive: true, force: true });
  manifest[remote.manifestKey] = `/remotes/${remote.publicPath}/remoteEntry.json`;
}

await writeFile(join(shellPublic, 'federation.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log('Staged remote bundles for shell hosting.');
