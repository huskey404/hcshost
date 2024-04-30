import { Hono } from "hono";
import { cors } from "hono/cors";

import { Home } from "./Home";
import { API_HOST } from "./env";

const app = new Hono();

app.get("/", (c) => c.html(<Home />));

app.post("/upload", cors(), async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  const formData = new FormData();
  formData.append("file", file, file.name);
  const response = await fetch(`${API_HOST}/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  const status = response.status as Parameters<typeof c.json>[1];
  return c.json(data, status);
});

app.get("/file/:name", async (c) => {
  const response = await fetch(`${API_HOST}/file/${c.req.param("name")}`);
  return c.newResponse(response.body as ReadableStream, {
    headers: response.headers,
  });
});

export default app;
