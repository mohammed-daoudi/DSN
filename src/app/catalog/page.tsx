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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Calendar,
  Download,
  Eye,
  Filter,
  Search,
  User,
} from "lucide-react";
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
  status: string;
}

export default function CatalogPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const modules = [
    "Droit du numérique",
    "Cybersécurité juridique",
    "Protection des données",
    "Commerce électronique",
    "Propriété intellectuelle numérique",
    "Régulation des plateformes",
    "Intelligence artificielle et droit",
    "Blockchain et cryptomonnaies",
    "Gouvernance de l'internet",
    "Droit pénal numérique",
    "Contrats numériques",
    "Méthodologie de recherche",
  ];

  const teachers = [
    "Prof. Martin DUPONT",
    "Prof. Sophie BERNARD",
    "Prof. Jean-Claude MARTIN",
    "Prof. Marie DUBOIS",
    "Prof. Alexandre LAURENT",
    "Prof. Catherine MOREAU",
    "Prof. Philippe PETIT",
    "Prof. Isabelle ROUX",
  ];

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { search }),
        ...(selectedModule && { module: selectedModule }),
        ...(selectedTeacher && { teacher: selectedTeacher }),
      });

      const response = await fetch(`/api/works?${params}`);
      const data = await response.json();

      if (response.ok) {
        setWorks(data.works);
        setTotalPages(data.totalPages);
      } else {
        console.error("Erreur lors du chargement:", data.error);
        setWorks([]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [page, search, selectedModule, selectedTeacher]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchWorks();
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedModule("");
    setSelectedTeacher("");
    setPage(1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
    return `${Math.round(bytes / (1024 * 1024))} Mo`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-400 mr-3" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Catalogue des Travaux
          </h1>
          <p className="text-xl text-slate-300">
            Explorez les recherches et mémoires du Master DSN
          </p>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="h-5 w-5 mr-2 text-blue-400" />
              Recherche et filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Recherche */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher un travail, auteur..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Filtre module */}
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Tous les modules" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="" className="text-white hover:bg-slate-600">
                      Tous les modules
                    </SelectItem>
                    {modules.map((module) => (
                      <SelectItem
                        key={module}
                        value={module}
                        className="text-white hover:bg-slate-600"
                      >
                        {module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filtre enseignant */}
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Tous les enseignants" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="" className="text-white hover:bg-slate-600">
                      Tous les enseignants
                    </SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem
                        key={teacher}
                        value={teacher}
                        className="text-white hover:bg-slate-600"
                      >
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="text-white border-slate-600 hover:border-blue-500"
                >
                  Réinitialiser
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Résultats */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-400 border-t-transparent mx-auto mb-4" />
            <p className="text-slate-300">Chargement des travaux...</p>
          </div>
        ) : works.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucun travail trouvé
              </h3>
              <p className="text-slate-400">
                Aucun travail ne correspond à vos critères de recherche.
              </p>
              <Button
                onClick={resetFilters}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Voir tous les travaux
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Grille des travaux */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {works.map((work) => (
                <Card
                  key={work.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className="text-blue-300 border-blue-600"
                      >
                        {work.module}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(work.upload_date)}
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg leading-tight">
                      {work.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                      {work.description.length > 100
                        ? `${work.description.substring(0, 100)}...`
                        : work.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Informations auteur et enseignant */}
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-slate-300">
                          <User className="h-3 w-3 mr-2" />
                          <span className="font-medium">{work.author}</span>
                        </div>
                        <div className="text-slate-400 ml-5">
                          Encadré par {work.teacher}
                        </div>
                      </div>

                      {/* Statistiques */}
                      <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {work.views_count} vues
                          </div>
                          <div className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {work.downloads_count} téléchargements
                          </div>
                        </div>
                        <div className="text-slate-500">
                          {formatFileSize(work.file_size)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                          onClick={() => window.open(work.file_url, '_blank')}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-white border-slate-600 hover:border-blue-500 text-xs"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = work.file_url;
                            link.download = work.file_name;
                            link.click();
                          }}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="text-white border-slate-600 hover:border-blue-500"
                >
                  Précédent
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className={
                        page === pageNum
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "text-white border-slate-600 hover:border-blue-500"
                      }
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="text-white border-slate-600 hover:border-blue-500"
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
