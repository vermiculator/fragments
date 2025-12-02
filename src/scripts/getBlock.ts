export async function getBlock(id: string): Promise<{ id: string,
        class: string,
        source?: {title: string, url: string},
        content_html?: string,
        image?: {thumb: {url: string}},
        user: {username: string},
        connections?: {id: string, title: string}[] }> {
   const requestUrl = "https://api.are.na/v2/blocks/" + id + "?per=50&sort=position&direction=desc"
    const response = await fetch(requestUrl, {
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ",
            },
            method: "GET",
            })
        .then((res) => res.json())
    let block = response as {
        id: string,
        class: string,
        source?: {title: string, url: string},
        content_html?: string,
        image?: {thumb: {url: string}},
        user: {username: string},
        connections?: {id: string, title: string}[]
    };
    return block;
}