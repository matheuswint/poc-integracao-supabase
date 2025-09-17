import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = 'https://ojzqxryryymjserhofrt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qenF4cnlyeXltanNlcmhvZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTY4OTksImV4cCI6MjA2NzU3Mjg5OX0.f-CrMwl4RcPbeyFQVra8rYPl3IEIg3qPdBFnwFSXdh8';
 
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
