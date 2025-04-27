import * as Cheerio from "cheerio";

export async function getMetadataFromUrl(_url: string): Promise<{
    img: string | undefined;
    title: string | undefined;
    description: string | undefined;
    keywords: string | undefined;
    url: string | undefined;
}> {
    const res = await fetch(_url);
    console.log(res.status, "<- status");
    const $ = Cheerio.load(await res.text());

    const title = $('meta[property="og:title"]').attr("content") ||
        $("title").text() || $('meta[name="title"]').attr("content");
    const description = $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content");
    const url = $('meta[property="og:url"]').attr("content");
    const image = $('meta[name="image"]').attr("content") ||
        $('meta[property="og:image"]').attr("content") ||
        $('meta[property="og:image:url"]').attr("content");
    const keywords = $('meta[property="og:keywords"]').attr("content") ||
        $('meta[name="keywords"]').attr("content");

    const data = {
        description,
        title,
        img: image,
        keywords: keywords || "",
        url,
    };

    return data;
}
