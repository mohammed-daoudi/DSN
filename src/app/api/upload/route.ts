import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { uploadFile, validateFile } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer le fichier depuis FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Valider le fichier
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Upload vers Cloudinary
    const { result, error } = await uploadFile(file);

    if (error) {
      console.error('Erreur upload:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload' },
        { status: 500 }
      );
    }

    // Retourner les informations du fichier uploadé
    return NextResponse.json({
      url: result.url,
      public_id: result.public_id,
      size: result.bytes,
      format: result.format,
      filename: file.name,
    });

  } catch (error) {
    console.error('Erreur API upload:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
