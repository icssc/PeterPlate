import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import fetch, { type HeadersInit } from "node-fetch";

const app: Express = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  console.log("Hello!");
  res.send("Hello!");
});

app.post("/dining", async (req: Request, res: Response) => {
  console.log("Got request");
  const queryStr = new URLSearchParams({
    ...req.body,
    variables: JSON.stringify(req.body.variables || {}),
  }).toString();

  const headers: HeadersInit = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0",
    Referer: "https://uci.mydininghub.com/",
    "content-type": "application/json",
    store: "ch_uci_en",
    "magento-store-code": "ch_uci",
    "magento-website-code": "ch_uci",
    "magento-store-view-code": "ch_uci_en",
    "x-api-key": "ElevateAPIProd",
    Origin: "https://uci.mydininghub.com",
  };

  try {
    const response = await fetch(
      `https://api.elevate-dxp.com/api/mesh/c087f756-cc72-4649-a36f-3a41b700c519/graphql?${queryStr}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `Go to https://studio.apollographql.com/sandbox/explorer and type "http:/localhost:4000/dining" as the endpoint.`,
  );
});
