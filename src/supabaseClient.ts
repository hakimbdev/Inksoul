import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujlqakvfryxwmhuzmatm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbHFha3Zmcnl4d21odXptYXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDkyOTYsImV4cCI6MjA2NjA4NTI5Nn0.BtBJSHqOXd_4z4r6a6Leq0Pp1TIwoWaqYLJ9qgghLrQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 