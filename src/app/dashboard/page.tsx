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
import { useUser } from "@clerk/nextjs";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  TrendingUp,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
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

interface DashboardData {
  stats: {
    depositsCount: number;
    viewsCount: number;
    downloadsCount: number;
    lastActivity: string | null;
  };
  recentWorks: Work[];
  allWorks: Work[];
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      const data = await response.json();

      if (response.ok) {
        setDashboardData(data);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Aucune activité';
    return new Date(dateString).toLocaleDateString('fr-FR');
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

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-400 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-300">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-700">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    window.location.href = '/sign-in';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Tableau de bord
          </h1>
          <p className="text-slate-300">
            Bienvenue,{" "}
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            <Badge
              variant="outline"
              className="ml-2 text-blue-300 border-blue-600"
            >
              Étudiant
            </Badge>
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData?.stats.depositsCount || 0}
                  </p>
                  <p className="text-sm text-slate-400">Travaux déposés</p>
                </div>
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData?.stats.viewsCount || 0}
                  </p>
                  <p className="text-sm text-slate-400">Vues totales</p>
                </div>
                <Eye className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData?.stats.downloadsCount || 0}
                  </p>
                  <p className="text-sm text-slate-400">Téléchargements</p>
                </div>
                <Download className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData?.stats.lastActivity ?
                      new Date(dashboardData.stats.lastActivity).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                        },
                      ) : '--'
                    }
                  </p>
                  <p className="text-sm text-slate-400">Dernière activité</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mes travaux récents */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      Mes travaux récents
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Gérez vos dépôts et consultez leurs statistiques
                    </CardDescription>
                  </div>
                  <Link href="/deposit">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="mr-2 h-4 w-4" />
                      Nouveau dépôt
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentWorks.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">Aucun travail déposé</p>
                      <Link href="/deposit">
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                          <Upload className="mr-2 h-4 w-4" />
                          Déposer votre premier travail
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    dashboardData?.recentWorks.map((work) => (
                    <div
                      key={work.id}
                      className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            {work.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <span className="flex items-center">
                              <BookOpen className="mr-1 h-3 w-3" />
                              {work.module}
                            </span>
                            <span className="flex items-center">
                              <User className="mr-1 h-3 w-3" />
                              {work.teacher}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(work.upload_date)}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(work.status)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-slate-300">
                          <span className="flex items-center">
                            <Eye className="mr-1 h-3 w-3" />
                            {work.views_count} vues
                          </span>
                          <span className="flex items-center">
                            <Download className="mr-1 h-3 w-3" />
                            {work.downloads_count} téléchargements
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white border-slate-600"
                            onClick={() => window.open(work.file_url, '_blank')}
                          >
                            Voir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides et informations */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/deposit">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Déposer un travail
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button
                    variant="outline"
                    className="w-full text-white border-slate-600"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explorer le catalogue
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button
                    variant="outline"
                    className="w-full text-white border-slate-600"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Ressources pédagogiques
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-slate-300">
                      Travail "Analyse RGPD" publié
                    </span>
                    <span className="text-slate-500 text-xs">Il y a 2j</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-slate-300">23 nouvelles vues</span>
                    <span className="text-slate-500 text-xs">Il y a 3j</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-slate-300">8 téléchargements</span>
                    <span className="text-slate-500 text-xs">Il y a 1s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tendances */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Vos performances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Taux de vues</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">
                      Téléchargements
                    </span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Popularité</span>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400 text-sm">Top 10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
