import path from 'node:path';

export function toPosixPath(_path: string) {
  const normalized = path.win32.normalize(_path);
}
