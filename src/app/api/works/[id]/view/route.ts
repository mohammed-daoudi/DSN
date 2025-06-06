import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Incrémenter le compteur de vues
    const { error } = await supabase.rpc('increment_views', {
      work_id: id
    });

    if (error) {
      // Si la fonction RPC n'existe pas, utiliser une requête UPDATE classique
      const { error: updateError } = await supabase
        .from('works')
        .update({
          views_count: supabase.raw('views_count + 1')
        })
        .eq('id', id);

      if (updateError) {
        console.error('Erreur lors de l\'incrémentation des vues:', updateError);
        return NextResponse.json(
          { error: 'Erreur lors de l\'incrémentation des vues' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
