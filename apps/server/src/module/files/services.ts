import dbClient from '~/db.js';
import fs from 'node:fs/promises';
import { getResourceDexConfig } from '~/config/resounceDex_config.js';
import { exec, spawn } from 'node:child_process';
import { env } from 'hono/adapter';

export async function createFileByLink(params: {
  img: string;
  title: string;
  url: string;
  description: string;
  location: string;
}) {
  const url = new URL(params.url);
  const pureUrl = url.origin + url.pathname;

  const platformName = (_url: URL) => {
    let parts = _url.hostname.split('.');
    if (parts.length >= 3) {
      return parts[1];
    } else {
      return parts[0];
    }
  };

  const ifFound = await dbClient.file.findFirst({
    where: {
      link: {
        equals: params.url
      }
    }
  });
  if (ifFound) throw new Error('an entry already exist with this link');

  const created = await dbClient.file.create({
    data: {
      link: params.url,
      description: params.description,
      name: params.title,
      location: params.location,
      thumbnail: params.img,
      meta_url: pureUrl,
      platform: {
        connectOrCreate: {
          where: {
            name: platformName(url)
          },
          create: {
            name: platformName(url),
            domainBases: {
              connectOrCreate: {
                where: {
                  url: pureUrl
                },
                create: {
                  url: pureUrl
                }
              }
            }
          }
        }
      }
    },
    include: {
      platform: true
    }
  });
  return created;
}

export async function createLocationFolderFromURL(_url: string) {
  const base_URL = getResourceDexConfig().resource_dex_config;

  const url = new URL(_url);
  const location_str =
    base_URL +
    '/' +
    url.hostname +
    (url.pathname.startsWith('/') ? url.pathname : '/' + url.pathname);

  const folder_path = await fs
    .mkdir(location_str, {
      recursive: true
    })
    .then(() => location_str)
    .catch(() => undefined);

  if (!folder_path) throw new Error('failed to create location.');
  const folder = await fs.opendir(folder_path);

  // folder.path;
  return folder;
}

export async function openInFileManager(location: string) {
  return new Promise((resolve, reject) => {
    let command_env = process.env.FILE_OPEN_COMMAND;

    if (!command_env) return reject('FILE_OPEN_COMMAND is not defined in .env');
    // switch (process.platform) {
    //   case 'darwin':
    //     command = 'open ' + location;
    //     break;
    //   case 'linux':
    //     command = 'xdg-open ' + location;
    //     break;
    //   case 'win32':
    //     command = 'explorer ' + location;
    //     break;
    //   default:
    //     throw new Error('invalid platform. Linux, Macos and windows are supported');
    // }

    let command = command_env + ' ' + location;

    const ch = spawn(command, {
      detached: true,
      shell: true,
      env: process.env
    });

    ch.on('error', (err) => {
      reject(err);
    });

    ch.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}
