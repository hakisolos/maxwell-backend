import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./src/routes/auth";
import api from "./src/routes/api";
const PORT = 3001
const app = new Hono()

app.use("*", cors())

app.route("/auth", auth)
app.route("/api", api)
app.get("/", (c) => {
    return c.json({message: "api running"})
})


Bun.serve({
    fetch: app.fetch,
    port: PORT
})
console.log(`app running on localhost:${PORT}`)
