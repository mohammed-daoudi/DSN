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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Lock,
  Shield,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DepositPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: user?.fullName || "",
    module: "",
    teacher: "",
    file: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

  const allowedFileTypes = [".pdf", ".docx", ".pptx", ".doc", ".ppt"];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (allowedFileTypes.includes(fileExtension)) {
        setFormData({ ...formData, file });
      } else {
        alert(
          "Type de fichier non autorisé. Formats acceptés : PDF, DOCX, PPTX",
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Création du FormData pour l'upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('author', formData.author);
      submitData.append('module', formData.module);
      submitData.append('teacher', formData.teacher);
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      // Envoi vers l'API
      const response = await fetch('/api/works', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || 'Erreur lors du dépôt');
      }
    } catch (error) {
      console.error('Erreur lors du dépôt:', error);
      setSubmitStatus("error");
      setErrorMessage('Erreur lors du dépôt du travail');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Protected content for authenticated users
  const ProtectedDepositForm = () => {
    if (submitStatus === "success") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="pt-8 pb-8">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Travail déposé avec succès !
                </h2>
                <p className="text-slate-400 mb-6">
                  Votre travail "{formData.title}" a été ajouté à la plateforme
                  avec un horodatage automatique.
                </p>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>
                    <strong>Auteur:</strong> {formData.author}
                  </p>
                  <p>
                    <strong>Module:</strong> {formData.module}
                  </p>
                  <p>
                    <strong>Enseignant:</strong> {formData.teacher}
                  </p>
                  <p>
                    <strong>Date de dépôt:</strong>{" "}
                    {new Date().toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-4 justify-center mt-6">
                  <Button
                    onClick={() => setSubmitStatus("idle")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Déposer un autre travail
                  </Button>
                  <Link href="/catalog">
                    <Button
                      variant="outline"
                      className="text-white border-slate-600 hover:border-blue-500"
                    >
                      Voir le catalogue
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center items-center mb-4">
              <Upload className="h-12 w-12 text-blue-400 mr-3" />
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Déposer un travail
            </h1>
            <p className="text-xl text-slate-300">
              Partagez vos recherches et contribuez à la mémoire collective du
              Master DSN
            </p>
          </div>

          {/* Informations importantes */}
          <Card className="mb-8 bg-blue-900/30 border-blue-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Propriété intellectuelle et sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div>
                  <h4 className="font-semibold mb-2 text-white">
                    Protection garantie :
                  </h4>
                  <ul className="space-y-1">
                    <li>• Horodatage automatique de votre dépôt</li>
                    <li>• Attribution claire de la paternité</li>
                    <li>• Stockage sécurisé et chiffré</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">
                    Formats acceptés :
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allowedFileTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="text-blue-300 border-blue-600"
                      >
                        {type.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de dépôt */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Informations du travail
              </CardTitle>
              <CardDescription className="text-slate-400">
                Tous les champs marqués d'un astérisque (*) sont obligatoires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message d'erreur */}
                {submitStatus === "error" && errorMessage && (
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Titre */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Titre du travail *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ex: Analyse de la RGPD dans le commerce électronique"
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description courte *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Résumé du contenu, problématique traitée, méthodologie..."
                    rows={4}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Auteur et informations */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-white">
                      Auteur(s) *
                    </Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="Prénom NOM"
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="module" className="text-white">
                      Module concerné *
                    </Label>
                    <Select
                      value={formData.module}
                      onValueChange={(value) =>
                        setFormData({ ...formData, module: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Sélectionner un module" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
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
                  </div>
                </div>

                {/* Enseignant */}
                <div className="space-y-2">
                  <Label htmlFor="teacher" className="text-white">
                    Enseignant encadrant *
                  </Label>
                  <Select
                    value={formData.teacher}
                    onValueChange={(value) =>
                      setFormData({ ...formData, teacher: value })
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Sélectionner un enseignant" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
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

                {/* Upload fichier */}
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-white">
                    Fichier à déposer *
                  </Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center bg-slate-700/30">
                    <FileText className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.pptx,.doc,.ppt"
                      required
                      className="hidden"
                    />
                    <Label htmlFor="file" className="cursor-pointer">
                      <span className="text-white font-semibold">
                        Cliquez pour choisir un fichier
                      </span>
                      <br />
                      <span className="text-slate-400 text-sm">
                        ou glissez-déposez ici
                      </span>
                    </Label>
                    {formData.file && (
                      <div className="mt-3 text-sm text-green-400">
                        ✓ {formData.file.name} (
                        {Math.round(formData.file.size / 1024)} Ko)
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations légales */}
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-slate-300">
                      <p className="font-semibold text-white mb-1">
                        Engagement de l'auteur :
                      </p>
                      <p>
                        En déposant ce travail, je certifie en être l'auteur ou
                        co-auteur et accepte sa diffusion dans le cadre
                        pédagogique du Master DSN. Les droits de propriété
                        intellectuelle sont préservés et un horodatage garantit
                        l'antériorité du dépôt.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.title ||
                      !formData.description ||
                      !formData.author ||
                      !formData.module ||
                      !formData.teacher ||
                      !formData.file
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Dépôt en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Déposer le travail
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-white border-slate-600 hover:border-blue-500"
                    onClick={() =>
                      setFormData({
                        title: "",
                        description: "",
                        author: user?.fullName || "",
                        module: "",
                        teacher: "",
                        file: null,
                      })
                    }
                  >
                    Réinitialiser
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Unauthenticated state
  const UnauthenticatedMessage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12">
      <div className="max-w-md w-full">
        <Card className="bg-slate-800/50 border-slate-700 text-center">
          <CardContent className="pt-8 pb-8">
            <Lock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Connexion requise
            </h2>
            <p className="text-slate-400 mb-6">
              Vous devez être connecté pour déposer un travail sur la plateforme
              Master DSN.
            </p>
            <div className="space-y-3">
              <Link href="/sign-in">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Se connecter
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="outline"
                  className="w-full text-white border-slate-600 hover:border-blue-500"
                >
                  Créer un compte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <SignedIn>
        <ProtectedDepositForm />
      </SignedIn>

      <SignedOut>
        <UnauthenticatedMessage />
      </SignedOut>
    </>
  );
}
