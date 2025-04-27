import dbClient from "~/db.js";
import fs from "node:fs/promises";
import { getResourceDexConfig } from "~/config/resounceDex_config.js";

export async function createFileByLink(params: {
    img: string;
    title: string;
    url: string;
    description: string;
    location: string;
}) {
    const url = new URL(params.url);
    const pureUrl = url.origin + url.pathname;

    let ifPlatformFound = await dbClient.platforms.findFirst({
        where: {
            domainBases: {
                some: {
                    match: pureUrl,
                },
            },
        },
        include: {
            domainBases: true,
        },
    });

    const ifFound = await dbClient.file.findFirst({
        where: {
            link: {
                equals: params.url,
            },
        },
    });
    if (ifFound) throw new Error("an entry already exist with this link");
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
                        name: url.hostname,
                    },
                    create: {
                        name: url.hostname,
                        domainBases: {
                            connectOrCreate: {
                                where: {
                                    url: pureUrl,
                                },
                                create: {
                                    url: pureUrl,
                                },
                            },
                        },
                    },
                },
            },
        },
        include: {
            platform: {
                include: {
                    domainBases: true,
                },
            },
        },
    });
    return created;
}

export async function createLocationFolderFromURL(_url: string) {
    const base_URL = getResourceDexConfig().resource_dex_config;

    const url = new URL(_url);
    const location_str = base_URL + "/" + url.hostname +
        (url.pathname.startsWith("/") ? url.pathname : "/" + url.pathname);

    const folder_path = await fs.mkdir(
        location_str,
        {
            recursive: true,
        },
    ).then(() => location_str).catch(() => undefined);

    if (!folder_path) throw new Error("failed to create location.");
    const folder = await fs.opendir(folder_path);

    // folder.path;
    return folder;
}
