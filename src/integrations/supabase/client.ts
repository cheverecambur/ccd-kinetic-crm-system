// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dosjixuvjpmllrfjejzb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvc2ppeHV2anBtbGxyZmplanpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjA1OTQsImV4cCI6MjA2NDE5NjU5NH0.InEXbHAYNozmFHQP--RbLf4PzSyOlfxcqVOnbnp0v5M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);