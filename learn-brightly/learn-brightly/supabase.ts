import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = "https://zhnfqxoivdfdruknqxcq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobmZxeG9pdmRmZHJ1a25xeGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNjk5MjIsImV4cCI6MjA3NzY0NTkyMn0.UyEWFYV3wv3omEIswUn7qx4fXaQr05KagFQb3ggAF5Q"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;