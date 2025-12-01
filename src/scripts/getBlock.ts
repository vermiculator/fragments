export async function getBlock(id: string): Promise<{ content: string; id: string }> {
   const requestUrl = "https://api.are.na/v2/blocks/" + id + "?per=50&sort=position&direction=desc"
    const response = fetch(requestUrl, {
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ",
            },
            method: "GET",
            })
        .then((res) => res.json())
    console.log(response);
    let block = JSON.parse(await response) as { content: string; id: string };
    return block;
}



