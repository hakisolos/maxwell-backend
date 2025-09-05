import { createClient } from "@supabase/supabase-js";

export const db = createClient(String(process.env.DBURL), String(process.env.SUPKEY))

