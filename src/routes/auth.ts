import { Hono } from "hono";
import { db } from "../supabase";

const auth = new Hono();

auth.post("/signup", async (c) => {
  const { username, password, wallet } = await c.req.json();
  if (!username || !password || !wallet) {
    return c.json({ error: "incomplete credentials" }, 401);
  }

  // Check for existing username
  const { data: existingUser, error: existingUserError } = await db
    .from("users")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUser) {
    // Username already exists
    return c.json({ error: "username already exists" }, 409);
  }

  const { data, error } = await db.from("users").insert([
    {
      username,
      password,
      wallet,
      points: "0",
    },
  ]);
  if (error) {
    return c.json({ error }, 400);
  }
  return c.json({ message: "success", details: data });
});

auth.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: "missing credentials" }, 401);
  }
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();
  if (error || !data) {
    return c.json({ error: "invalid credentials" }, 401);
  }
  return c.json({ message: "login success", user: data });
});

auth.get("/getuser", async (c) => {
  const username = c.req.query("username");
  if (!username) {
    return c.json({ error: "username missing" }, 401);
  }

  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) {
    return c.json({ error: "user not found" }, 404);
  }

  return c.json({ user: data });
});

export default auth;
