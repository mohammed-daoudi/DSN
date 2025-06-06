import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: work, error } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Travail non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ work });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = params;
    const updateData = await request.json();

    // Vérifier que l'utilisateur est propriétaire du travail
    const { data: existingWork, error: checkError } = await supabase
      .from('works')
      .select('user_id')
      .eq('id', id)
      .single();

    if (checkError || !existingWork) {
      return NextResponse.json(
        { error: 'Travail non trouvé' },
        { status: 404 }
      );
    }

    if (existingWork.user_id !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé à modifier ce travail' },
        { status: 403 }
      );
    }

    // Mettre à jour le travail
    const { data: updatedWork, error: updateError } = await supabase
      .from('works')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ work: updatedWork });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Vérifier que l'utilisateur est propriétaire du travail
    const { data: existingWork, error: checkError } = await supabase
      .from('works')
      .select('user_id, file_url')
      .eq('id', id)
      .single();

    if (checkError || !existingWork) {
      return NextResponse.json(
        { error: 'Travail non trouvé' },
        { status: 404 }
      );
    }

    if (existingWork.user_id !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé à supprimer ce travail' },
        { status: 403 }
      );
    }

    // Supprimer le travail de la base de données
    const { error: deleteError } = await supabase
      .from('works')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    // TODO: Supprimer aussi le fichier de Cloudinary si nécessaire
    // const publicId = extractPublicIdFromUrl(existingWork.file_url);
    // await deleteFile(publicId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
