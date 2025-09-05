import { Hono } from "hono";
import { db } from "../supabase";
const api = new Hono()





api.get("/leaderboard", async (c) => {
  const { data, error } = await db
    .from("users")
    .select("username, points")
    .order("points", { ascending: false });

  if (error || !data) {
    return c.json({ error: "could not fetch leaderboard" }, 400);
  }

  return c.json({ leaderboard: data });
});



api.post("/addpoints", async (c) => {
  const { username, pointsadded } = await c.req.json();
  if (!username || !pointsadded) {
    return c.json({ error: "missing credentials" }, 401);
  }

  const { data: user, error: fetchError } = await db
    .from("users")
    .select("points")
    .eq("username", username)
    .single();

  if (fetchError || !user) {
    return c.json({ error: "user not found" }, 404);
  }

  const newPoints = parseInt(user.points) + parseInt(pointsadded);

  const { data, error } = await db
    .from("users")
    .update({ points: newPoints.toString() })
    .eq("username", username)
    .select();

  if (error) {
    return c.json({ error }, 400);
  }

  return c.json({ message: "points updated", details: data });
});



export default api;