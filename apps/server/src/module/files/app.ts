import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import dbClient from "~/db.js";
import { createFileByLink, createLocationFolderFromURL } from "./services.js";
import { getMetadataFromUrl } from "../link/services.js";

export const fileApp = new Hono();

fileApp.get("/", async (ctx) => {
    const files = await dbClient.file;

    return ctx.json(files);
});

fileApp.post("/", (ctx) => {
    /*
    expected body

    {
     link: "url" ,
     thumbnail:"url",
     file:"url"
    }
    */

    return ctx.text("hello");
});

fileApp.get("/platform", async (ctx) => {
    const platforms = await dbClient.platforms.findMany({
        include: {
            domainBases: true,
        },
    });
    return ctx.json(platforms);
});

fileApp.post(
    "/platform",
    zValidator(
        "json",
        z.object({
            links: z.string().url().array(),
            name: z.string().min(0, "name cannot be empty"),
        }),
    ),
    async (ctx) => {
        const body = ctx.req.valid("json");

        const created = await dbClient.platforms.create({
            data: {
                name: body.name,
                domainBases: {
                    createMany: {
                        data: body.links.map((v) => {
                            return ({
                                url: v,
                            });
                        }),
                    },
                },
            },
        });

        return ctx.json(created);
    },
);

fileApp.post("/domain-bases", async (ctx) => {
    const allDomainBases = await dbClient.domainBases.findMany({
        include: {
            platform: true,
        },
    });

    return new Response(new TextEncoder().encode(String(allDomainBases)));
});

fileApp.get("/domain-bases", async (ctx) => {
    const allDomainBases = await dbClient.domainBases.findMany({
        include: {
            platform: true,
        },
    });

    return new Response(
        new TextEncoder().encode(JSON.stringify(allDomainBases)),
    );
});

fileApp.post(
    "/create-by-link",
    zValidator(
        "json",
        z.object({
            url: z.string().url(),
            img: z.string().url().optional(),
            title: z.string().optional(),
            descripton: z.string().optional(),
        }),
    ),
    async (c) => {
        let body = c.req.valid("json");

        if (!body.descripton || !body.img || !body.title) {
            const m = await getMetadataFromUrl(body.url);
            body.descripton = m.description;
            body.img = m.img;
            body.title = m.title;
        }

        const folderLoc = await createLocationFolderFromURL(body.url);

        const createdfile = await createFileByLink({
            description: body.descripton || "N/A",
            img: body.img || "N/A",
            location: folderLoc.path,
            title: body.title || "N/A",
            url: body.url,
        });
        return c.json(createdfile);
    },
);
