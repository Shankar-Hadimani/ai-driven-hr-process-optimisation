// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rmkjcwcxczfglworfpxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJta2pjd2N4Y3pmZ2x3b3JmcHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDgxNjgsImV4cCI6MjA1OTcyNDE2OH0.XRstA_j7QY7mFazhaaA7bJ5CjAUqib32XJTQZUlEkpw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);