import dbClient from '~/db.js';
import fs from 'node:fs/promises';
import { exec, spawn } from 'node:child_process';
import { RESOURCE_BASE } from '~/config/env.js';
import path from 'node:path';
import * as https from 'node:https';
import * as http from 'node:http';
import { createWriteStream } from 'node:fs';
import { getExtFromContentType } from '~/common/detector.js';
import { url_normalize } from '~/common/url.js';
import { stdout } from 'node:process';

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

  const created = await dbClient.file.create({
    data: {
      link: url_normalize(url),
      description: params.description,
      name: params.title,
      location: params.location,
      thumbnail: params.img,
      meta_url: pureUrl,
      raw_url: url.toString(),
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

// Write Metadata to Folder;
// Keep a local copy of thumbnail.
export async function putMetadataInDirectory(
  location: string,
  data: { thumbnail: string | 'NA' } & Record<string, unknown>
) {
  const resource_base = RESOURCE_BASE();
  if (!resource_base) {
    throw Error('RESOURCE_BASE not exist in env');
  }

  // create text file.
  await fs.writeFile(path.resolve(resource_base, location, './meta.json'), JSON.stringify(data));

  return true;
}

/**
 * Download and Put a local Copy of Thumbnail in Directory.
 * if thumbnail not found it will return '/data/na-thumbnail.png'
 * @param location
 * @param data
 * @returns
 */
export async function putThumbnailInDirectory(
  location: string,
  data: { thumbnail: string | 'NA' } & Record<string, unknown>
): Promise<{ thumbnail_link: string }> {
  return new Promise((resolve, reject) => {
    const resource_base = RESOURCE_BASE();
    if (!resource_base) {
      throw Error('RESOURCE_BASE not exist in env');
    }

    if (data.thumbnail === 'NA') return resolve({ thumbnail_link: '/data/na-thumbnail.png' });
    const protocol = data.thumbnail.startsWith('https') ? https : http;

    protocol
      .get(data.thumbnail, (response) => {
        const contentType = response.headers['content-type'];
        if (!contentType) throw new Error('content-type is not exist in url headers;');
        const extension = getExtFromContentType(contentType);

        const thumbnailFilePath = path.resolve(
          resource_base,
          location,
          './thumbnail.' + (extension || 'png')
        );
        const thumbnailFile = createWriteStream(thumbnailFilePath);

        response.pipe(thumbnailFile);

        thumbnailFile.on('finish', () =>
          resolve({
            thumbnail_link: path.posix.join(location, './thumbnail' + (extension || 'png'))
          })
        );
        thumbnailFile.on('error', reject);
      })
      .on('error', reject);
  });
}

/**
 * Open Location in file Manager
 */
export async function openInFileManager(location: string) {
  return new Promise((resolve, reject) => {
    let command_env = process.env.FILE_OPEN_COMMAND;
    let resource_base = RESOURCE_BASE();

    if (!command_env) return reject('FILE_OPEN_COMMAND is not defined in .env');
    if (!resource_base) return reject('RESOURCE_BASE is not found in .env');

    let command = command_env + ' ' + path.resolve(path.join(resource_base, location));

    const ch = exec(command, function (err, so, se) {
      console.log(err);
    });
  });
}

/**
 * Search File
 */
export async function searchFilesByString(string: string) {
  return dbClient.file.findMany({
    where: {
      name: {
        contains: string
      }
    },
    include: {
      platform: true
    }
  });
}
