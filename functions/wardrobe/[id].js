export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.pathname = "/wardrobe/__placeholder__.html";
  return context.env.ASSETS.fetch(url);
}
