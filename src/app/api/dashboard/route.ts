import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les statistiques utilisateur
    const { data: userWorks, error: worksError } = await supabase
      .from('works')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (worksError) {
      console.error('Erreur récupération travaux:', worksError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données' },
        { status: 500 }
      );
    }

    // Calculer les statistiques
    const stats = {
      depositsCount: userWorks?.length || 0,
      viewsCount: userWorks?.reduce((total, work) => total + (work.views_count || 0), 0) || 0,
      downloadsCount: userWorks?.reduce((total, work) => total + (work.downloads_count || 0), 0) || 0,
      lastActivity: userWorks?.[0]?.created_at || null,
    };

    // Prendre les 5 derniers travaux pour l'affichage
    const recentWorks = userWorks?.slice(0, 5) || [];

    return NextResponse.json({
      stats,
      recentWorks,
      allWorks: userWorks || []
    });

  } catch (error) {
    console.error('Erreur API dashboard:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
