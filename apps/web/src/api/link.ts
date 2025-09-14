import { API } from '$lib/api_base';

export async function getLinkDetails(url: string) {
	return fetch(API('/link/get-metadata?link=' + url)).then(
		(res) =>
			res.json() as Promise<{
				img: string | undefined;
				title: string | undefined;
				description: string | undefined;
				keywords: string | undefined;
				url: string | undefined;
			}>
	);
}
