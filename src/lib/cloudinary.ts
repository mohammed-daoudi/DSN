import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  public_id: string;
  resource_type: string;
  bytes: number;
  format: string;
}

export interface UploadError {
  message: string;
  code?: string;
}

// Upload un fichier vers Cloudinary
export async function uploadFile(
  file: File,
  folder: string = 'dsn-works'
): Promise<{ result: UploadResult | null; error: UploadError | null }> {
  try {
    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Options d'upload
    const uploadOptions = {
      folder,
      resource_type: 'auto' as const,
      allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
      max_file_size: 10 * 1024 * 1024, // 10MB max
      use_filename: true,
      unique_filename: true,
    };

    // Upload vers Cloudinary
    const result = await new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              resource_type: result.resource_type,
              bytes: result.bytes,
              format: result.format,
            });
          } else {
            reject(new Error('Résultat d\'upload vide'));
          }
        }
      ).end(buffer);
    });

    return { result, error: null };
  } catch (error: any) {
    console.error('Erreur upload Cloudinary:', error);
    return {
      result: null,
      error: {
        message: error.message || 'Erreur lors de l\'upload du fichier',
        code: error.error?.code,
      },
    };
  }
}

// Supprimer un fichier de Cloudinary
export async function deleteFile(publicId: string): Promise<{ success: boolean; error: UploadError | null }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return { success: true, error: null };
    } else {
      return {
        success: false,
        error: { message: 'Fichier non trouvé ou déjà supprimé' },
      };
    }
  } catch (error: any) {
    console.error('Erreur suppression Cloudinary:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Erreur lors de la suppression du fichier',
        code: error.error?.code,
      },
    };
  }
}

// Générer une URL de téléchargement sécurisée
export function generateDownloadUrl(publicId: string, fileName?: string): string {
  return cloudinary.url(publicId, {
    resource_type: 'auto',
    flags: 'attachment',
    public_id: publicId,
    ...(fileName && { filename: fileName }),
  });
}

// Valider le type de fichier
export function isValidFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  return allowedTypes.includes(file.type);
}

// Valider la taille du fichier (10MB max)
export function isValidFileSize(file: File): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
}

// Valider un fichier complet
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isValidFileType(file)) {
    return {
      valid: false,
      error: 'Type de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, PPT, PPTX',
    };
  }

  if (!isValidFileSize(file)) {
    return {
      valid: false,
      error: 'Fichier trop volumineux. Taille maximum : 10MB',
    };
  }

  return { valid: true };
}
