import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface DatabaseWork {
  id: string;
  title: string;
  description: string;
  author: string;
  module: string;
  teacher: string;
  file_url: string;
  file_name: string;
  file_size: number;
  upload_date: string;
  user_id: string;
  views_count: number;
  downloads_count: number;
  status: 'draft' | 'published' | 'under_review';
  created_at: string;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
  updated_at: string;
}
