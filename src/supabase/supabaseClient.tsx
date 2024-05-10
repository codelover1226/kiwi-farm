import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types'

// const supabaseUrl = process.env.SUPABASE_URL;
const supabaseUrl = "https://zwjuqenggwjmxifhtdkh.supabase.co";
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3anVxZW5nZ3dqbXhpZmh0ZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMTM1MzAsImV4cCI6MjAyNzY4OTUzMH0.iVd2f2RiJU704OadTmJKoENKQ8v3b_q8MpPJ3vrSgnI";

const supabase: SupabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;