import dbClient from '~/db.js';
import fs from 'node:fs/promises';
import { getResourceDexConfig } from '~/config/resounceDex_config.js';
import { exec, spawn } from 'node:child_process';
import { env } from 'hono/adapter';
import { RESOURCE_BASE } from '~/config/env.js';
import path from 'node:path';

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

/**
 *
 * @param _url {string} resource url. For example -  with `https://ui8.net/autho/file`
 * @returns
 */
export async function createLocationFolderFromURL(_url: string): Promise<{
  full_path: string;
  path: string;
}> {
  const base_URL = RESOURCE_BASE();
  if (!base_URL) throw new Error('RESOURCE_BASE env not found');

  const url = new URL(_url);

  // file path without base.
  const raw_path =
    url.hostname + (url.pathname.startsWith('/') ? url.pathname : '/' + url.pathname);

  // Location with base url
  const location_str = path.resolve(path.join(base_URL, raw_path));

  const folder_path = await fs
    .mkdir(location_str, {
      recursive: true
    })
    .then(() => location_str)
    .catch((e) => {
      console.log(e);
      throw e;
    });

  if (!folder_path) throw new Error('failed to create location.');
  const folder = await fs.opendir(folder_path);

  // folder.path;
  return {
    full_path: folder.path,
    path: raw_path
  };
}

export async function openInFileManager(location: string) {
  return new Promise((resolve, reject) => {
    let command_env = process.env.FILE_OPEN_COMMAND;
    let resource_base = RESOURCE_BASE();

    if (!command_env) return reject('FILE_OPEN_COMMAND is not defined in .env');
    if (!resource_base) return reject('RESOURCE_BASE is not found in .env');

    let command = command_env + ' ' + path.resolve(path.join(resource_base, location));

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
