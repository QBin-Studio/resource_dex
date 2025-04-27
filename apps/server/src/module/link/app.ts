import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getMetadataFromUrl } from "./services.js";

export const linkHono = new Hono();

linkHono.get(
    "/get-metadata",
    zValidator(
        "query",
        z.object({
            link: z.string({ required_error: "?link= is required" }).url(
                "link must be url",
            ),
        }),
    ),
    async (c) => {
        const link = c.req.query("link");
        if (!link) return c.text("link query parameter is required");

        const meta = await getMetadataFromUrl(link);
        console.log(meta);

        return c.json(meta);
    },
);
