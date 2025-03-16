import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kdvajegyubflfeejtsea.supabase.co/";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdmFqZWd5dWJmbGZlZWp0c2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNzc0MDUsImV4cCI6MjA1NzY1MzQwNX0.ro3M7HC3l-Dxtul2J4DezsBIBGbC1k2I9KRcJI-r2sw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
