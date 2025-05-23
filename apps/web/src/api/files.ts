import { API } from '~/lib/api_base';
import type { DomainBases, File, Platforms } from '~prisma-client/index';
import type { SResponse } from './types';

export const getAllFiles = async (limit = 50, page = 1) => {
  return fetch(API(`/files?limit=${limit}&page=${page}`)).then(
    (res) =>
      res.json() as Promise<
        Array<{
          id: string;
          link: string;
          location: string;
          version: string;
          folder: string;
          name: string;
          description: string;
          thumbnail: string;
          meta_url?: string;
          platformId?: string;
          createdAt: string;
          updatedAt: string;

          platform?: {
            id: string;
            name: string;
            createdAt: string;
            updatedAt: string;
            domainBases: Array<{
              id: number;
              url: string;
              platformId: string;
              match: string;
              createdAt: string;
              updatedAt: string;
            }>;
          };
        }>
      >
  );
};

export const createFilesByLink = async (body: {
  url: string;
  title?: string;
  img?: string;
  description?: string;
}) => {
  return fetch(API(`/files/create-by-link`), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json() as Promise<SResponse<Record<string, unknown>>>);
};

export const openInFileManager = async (location: string) => {
  return fetch(API(`/files/open-in-file-manager?location=${location}`)).then(
    (res) => res.json() as Promise<SResponse<boolean>>
  );
};
