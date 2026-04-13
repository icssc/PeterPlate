export const handler = async (event: { rawPath?: string; rawQueryString?: string }) => {
  const path = event.rawPath || "/";
  const queryString = event.rawQueryString ? `?${event.rawQueryString}` : "";
  const redirectUrl = `https://peterplate.com${path}${queryString}`;

  return {
    statusCode: 301,
    headers: {
      Location: redirectUrl,
    },
    body: "",
  };
};
