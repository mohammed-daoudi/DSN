import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadFile, validateFile } from '@/lib/cloudinary';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Parser les données du formulaire
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const author = formData.get('author') as string;
    const module = formData.get('module') as string;
    const teacher = formData.get('teacher') as string;
    const file = formData.get('file') as File;

    // Validation des champs requis
    if (!title || !description || !author || !module || !teacher || !file) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation du fichier
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Upload du fichier vers Cloudinary
    const uploadResult = await uploadFile(file, 'dsn-works');
    if (uploadResult.error || !uploadResult.result) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload du fichier' },
        { status: 500 }
      );
    }

    // Insertion dans la base de données
    const { data, error } = await supabase
      .from('works')
      .insert({
        title,
        description,
        author,
        module,
        teacher,
        file_url: uploadResult.result.url,
        file_name: file.name,
        file_size: file.size,
        user_id: userId,
        status: 'under_review'
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur base de données:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      work: data
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const module = url.searchParams.get('module');
    const teacher = url.searchParams.get('teacher');
    const search = url.searchParams.get('search');

    const offset = (page - 1) * limit;

    // Construction de la requête avec filtres
    let query = supabase
      .from('works')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('upload_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (module) {
      query = query.eq('module', module);
    }

    if (teacher) {
      query = query.eq('teacher', teacher);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,author.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Erreur base de données:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des travaux' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      works: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
