import { Hono } from "hono";
import { cors } from "hono/cors";
import { accessAuth } from "./middleware/auth";
const app = new Hono();

app.use('*', cors({
  origin: [
    'http://localhost:4321',
    ' https://cloudflare-hono-waitlist-template-staging.surajit9830debnath.workers.dev'
  ],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use( accessAuth).get("/api/health", (c) => c.json("Healthy"));

export default app;
