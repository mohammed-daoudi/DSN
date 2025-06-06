import { supabase, type DatabaseWork } from './supabase';

export interface CreateWorkData {
  title: string;
  description: string;
  author: string;
  module: string;
  teacher: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  user_id: string;
}

export interface WorksFilters {
  module?: string;
  teacher?: string;
  search?: string;
  status?: 'draft' | 'published' | 'under_review';
}

// Créer un nouveau travail
export async function createWork(data: CreateWorkData): Promise<{ work: DatabaseWork | null; error: string | null }> {
  try {
    const { data: work, error } = await supabase
      .from('works')
      .insert([{
        ...data,
        status: 'under_review' // Par défaut, les travaux sont en révision
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du travail:', error);
      return { work: null, error: error.message };
    }

    return { work, error: null };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { work: null, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Récupérer les travaux avec filtres optionnels
export async function getWorks(filters: WorksFilters = {}): Promise<{ works: DatabaseWork[] | null; error: string | null }> {
  try {
    let query = supabase
      .from('works')
      .select('*')
      .eq('status', filters.status || 'published') // Par défaut, seuls les travaux publiés
      .order('created_at', { ascending: false });

    // Filtres optionnels
    if (filters.module) {
      query = query.eq('module', filters.module);
    }

    if (filters.teacher) {
      query = query.eq('teacher', filters.teacher);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
    }

    const { data: works, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des travaux:', error);
      return { works: null, error: error.message };
    }

    return { works, error: null };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { works: null, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Récupérer les travaux d'un utilisateur spécifique
export async function getUserWorks(userId: string): Promise<{ works: DatabaseWork[] | null; error: string | null }> {
  try {
    const { data: works, error } = await supabase
      .from('works')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des travaux utilisateur:', error);
      return { works: null, error: error.message };
    }

    return { works, error: null };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { works: null, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Récupérer un travail par ID
export async function getWorkById(id: string): Promise<{ work: DatabaseWork | null; error: string | null }> {
  try {
    const { data: work, error } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du travail:', error);
      return { work: null, error: error.message };
    }

    return { work, error: null };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { work: null, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Incrémenter le nombre de vues
export async function incrementViews(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('works')
      .update({ views_count: supabase.sql`views_count + 1` })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Incrémenter le nombre de téléchargements
export async function incrementDownloads(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('works')
      .update({ downloads_count: supabase.sql`downloads_count + 1` })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de l\'incrémentation des téléchargements:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Récupérer les modules disponibles
export async function getModules(): Promise<{ modules: { name: string; description: string }[] | null; error: string | null }> {
  try {
    const { data: modules, error } = await supabase
      .from('modules')
      .select('name, description')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des modules:', error);
      return { modules: null, error: error.message };
    }

    return { modules, error: null };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { modules: null, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Récupérer les enseignants disponibles
export async function getTeachers(): Promise<{ teachers: { name: string; specialization: string }[] | null; error: string | null }> {
  try {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('name, specialization')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des enseignants:', error);
      return { teachers: null, error: error.message };
    }

    return { teachers, error: null };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { teachers: null, error: 'Une erreur inattendue s\'est produite' };
  }
}
