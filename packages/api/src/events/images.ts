// images.ts
// 
// Queries the separate GraphQL endpoint for event image headers.
import axios from 'axios';
import { EventImageSchema, type EventImageData } from "@zotmeal/validators";

const imageGraphQLEndpoint: string = 
  "https://uci.mydininghub.com/graphql/execute.json/elevate/events;root=/content/dam/cf/ch/uci/en/events/;campus=campus";
const imageGraphQLHeaders = {
  "Host": "uci.mydininghub.com",
  "User-Agent": " Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0",
  "Accept": "*/*",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Referer": "https://uci.mydininghub.com/en/locations/events",
  "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjQ2MTE4MjQiLCJhcCI6IjExMDM0MDM4NjYiLCJpZCI6IjFjZTY1YzNiZWEzMmQ2YzEiLCJ0ciI6IjQwYmQwNjE2MzM2ZmMwZDQ5NGEyNDQ4OTQxYzM4NDExIiwidGkiOjE3NjMyNDIxOTg3Njd9fQ==",
  "traceparent": "00-40bd0616336fc0d494a2448941c38411-1ce65c3bea32d6c1-01",
  "tracestate": "4611824@nr=0-1-4611824-1103403866-1ce65c3bea32d6c1----1763242198767",
  "x-api-key": "a1781e57-440f-4c70-9d65-89c8755dc5ad",
  "Connection": "keep-alive",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "DNT": "1",
  "Sec-GPC": "1",
  "Priority": "u=4",
  "TE": "trailers",
};

const imageURLPrefix: string = 
  "https://images.elevate-dxp.com/adobe/assets/urn:aaid:aem:";

// Maps the event's title to its image URL.
export type EventImageMap = Map<string, string>;

/**
 * Returns a map of the event name to its corresponding event image URL.
 */
export async function queryEventImageEndpoint(): Promise<EventImageMap> {
  const response = await axios({
    method: "GET",
    url: imageGraphQLEndpoint,
    headers: imageGraphQLHeaders,
  })

  const parsedData: EventImageData = EventImageSchema.parse(response.data);
  let eventMap = new Map<string, string>();

  parsedData.data.eventList.items.forEach(item => {
    const imageID: string = item.image._dynamicUrl.slice(36).split('/')[0] ?? "";

    eventMap.set(item.title, `${imageURLPrefix}${imageID}`)
  });

  return eventMap;
}