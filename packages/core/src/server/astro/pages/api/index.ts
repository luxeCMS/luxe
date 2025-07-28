import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  return new Response("status: 200");
};
