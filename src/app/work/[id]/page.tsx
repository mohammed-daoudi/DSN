"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  FileText,
  Share2,
  User,
  BookOpen,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Work {
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
  views_count: number;
  downloads_count: number;
  status: 'draft' | 'published' | 'under_review';
  created_at: string;
  updated_at: string;
}

export default function WorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchWork(params.id as string);
    }
  }, [params.id]);

  const fetchWork = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/works/${id}`);
      const data = await response.json();

      if (response.ok) {
        setWork(data.work);
        // Increment view count
        incrementViewCount(id);
      } else {
        setError(data.error || 'Travail non trouvé');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement du travail');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (id: string) => {
    try {
      await fetch(`/api/works/${id}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
    }
  };

  const handleDownload = async () => {
    if (!work) return;

    setDownloading(true);
    try {
      // Increment download count
      await fetch(`/api/works/${work.id}/download`, { method: 'POST' });

      // Download file
      const link = document.createElement('a');
      link.href = work.file_url;
      link.download = work.file_name;
      link.click();

      // Update local state
      setWork({
        ...work,
        downloads_count: work.downloads_count + 1
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: work?.title,
          text: work?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
    return `${Math.round(bytes / (1024 * 1024))} Mo`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-600">Publié</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-600">En révision</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-400 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-300">Chargement du travail...</p>
        </div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Travail non trouvé
            </h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <Link href="/catalog">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Retour au catalogue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-white border-slate-600 hover:border-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header du travail */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-blue-300 border-blue-600">
                        {work.module}
                      </Badge>
                      {getStatusBadge(work.status)}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {work.title}
                    </h1>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-slate-300">
                    <User className="mr-2 h-4 w-4" />
                    <span>
                      <strong>Auteur:</strong> {work.author}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>
                      <strong>Enseignant:</strong> {work.teacher}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      <strong>Déposé le:</strong> {formatDate(work.upload_date)}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                      <strong>Modifié le:</strong> {formatDate(work.updated_at)}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {work.description}
                </p>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-2xl font-bold text-white">
                        {work.views_count}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">Vues</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Download className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-2xl font-bold text-white">
                        {work.downloads_count}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">Téléchargements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => window.open(work.file_url, '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ouvrir le document
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  variant="outline"
                  className="w-full text-white border-slate-600 hover:border-blue-500"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full text-white border-slate-600 hover:border-blue-500"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
              </CardContent>
            </Card>

            {/* Informations du fichier */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Informations du fichier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nom:</span>
                  <span className="text-white text-sm">{work.file_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taille:</span>
                  <span className="text-white">{formatFileSize(work.file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Format:</span>
                  <span className="text-white uppercase">
                    {work.file_name.split('.').pop()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Liens rapides */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Liens rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href={`/catalog?module=${encodeURIComponent(work.module)}`}
                  className="block"
                >
                  <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                    Autres travaux - {work.module}
                  </Button>
                </Link>
                <Link
                  href={`/catalog?teacher=${encodeURIComponent(work.teacher)}`}
                  className="block"
                >
                  <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                    Travaux de {work.teacher}
                  </Button>
                </Link>
                <Link href="/catalog" className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                    Retour au catalogue
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
