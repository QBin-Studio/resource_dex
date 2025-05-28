import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import dbClient from '~/db.js';
import {
  createFileByLink,
  createLocationFolderFromURL,
  openInFileManager,
  putMetadataInDirectory,
  putThumbnailInDirectory
} from './services.js';
import { getMetadataFromUrl } from '../link/services.js';
import { OkResponse } from '~/common/response.js';
import path from 'node:path';

export const fileApp = new Hono();

fileApp.get(
  '/',
  zValidator(
    'query',
    z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(50),
      platform: z.string().optional()
    })
  ),
  async (ctx) => {
    const query = ctx.req.valid('query');

    const files = await dbClient.file.findMany({
      take: query.limit,
      skip: query.page === 1 ? 0 : query.page * query.limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        platform: {
          where: {
            name: query.platform
          },

          include: {
            domainBases: true
          }
        }
      }
    });

    return ctx.json(files);
  }
);

fileApp.post('/', (ctx) => {
  return ctx.text('hello');
});

fileApp.get('/platform', async (ctx) => {
  const platforms = await dbClient.platforms.findMany({
    include: {
      domainBases: true
    }
  });
  return ctx.json(platforms);
});

fileApp.post(
  '/platform',
  zValidator(
    'json',
    z.object({
      links: z.string().url().array(),
      name: z.string().min(0, 'name cannot be empty')
    })
  ),
  async (ctx) => {
    const body = ctx.req.valid('json');

    const created = await dbClient.platforms.create({
      data: {
        name: body.name,
        domainBases: {
          createMany: {
            data: body.links.map((v) => {
              return {
                url: v
              };
            })
          }
        }
      }
    });

    return ctx.json(created);
  }
);

fileApp.post('/domain-bases', async (ctx) => {
  const allDomainBases = await dbClient.domainBases.findMany({
    include: {
      platform: true
    }
  });

  return new Response(new TextEncoder().encode(String(allDomainBases)));
});

fileApp.get('/domain-bases', async (ctx) => {
  const allDomainBases = await dbClient.domainBases.findMany({
    include: {
      platform: true
    }
  });

  return new Response(new TextEncoder().encode(JSON.stringify(allDomainBases)));
});

fileApp.post(
  '/create-by-link',
  zValidator(
    'json',
    z.object({
      url: z.string().url(),
      img: z.string().url().optional(),
      title: z.string().optional(),
      description: z.string().optional()
    })
  ),
  async (c) => {
    let body = c.req.valid('json');

    if (!body.description || !body.img || !body.title) {
      const m = await getMetadataFromUrl(body.url);
      body.description = m.description;
      body.img = m.img;
      body.title = m.title;
    }

    const folderLoc = await createLocationFolderFromURL(body.url);
    await putMetadataInDirectory(folderLoc.path, {
      thumbnail: body.img || 'N/A',
      href: body.url,
      title: body.title,
      description: body.description
    });

    const { thumbnail_link } = await putThumbnailInDirectory(folderLoc.path, {
      thumbnail: body.img || 'N/A',
      href: body.url,
      title: body.title,
      description: body.description
    });

    const createdFile = await createFileByLink({
      description: body.description || 'N/A',
      img: path.posix.normalize(thumbnail_link) || 'N/A',
      location: path.posix.normalize(folderLoc.path),
      title: body.title || 'N/A',
      url: body.url
    });
    return OkResponse(createdFile).setMessage('successfully created new resource').make();
  }
);

fileApp.get(
  '/open-in-file-manager',
  zValidator(
    'query',
    z.object({
      location: z.string()
    })
  ),
  async (ctx) => {
    const query = ctx.req.valid('query');
    const result = await openInFileManager(query.location);

    return OkResponse(result).make();
  }
);
