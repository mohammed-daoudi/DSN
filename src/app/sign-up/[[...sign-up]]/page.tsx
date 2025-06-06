import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUp } from "@clerk/nextjs";
import { BookOpen, GraduationCap, Shield, Users } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <BookOpen className="h-12 w-12 text-blue-400" />
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Rejoindre le Master <span className="text-blue-400">DSN</span>
          </h1>
          <p className="text-slate-300">
            Créez votre compte pour accéder à la plateforme
          </p>
        </div>

        {/* Sign Up Component */}
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "bg-slate-800 border border-slate-700",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-300",
                socialButtonsBlockButton:
                  "bg-slate-700 border border-slate-600 text-white hover:bg-slate-600",
                socialButtonsBlockButtonText: "text-white",
                formFieldLabel: "text-white",
                formFieldInput:
                  "bg-slate-700 border border-slate-600 text-white",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-blue-400",
              },
            }}
          />
        </div>

        {/* User Types Info */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white text-sm">Étudiants</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-slate-400 text-xs">
                Accès aux fonctionnalités de dépôt, consultation et tableau de
                bord personnel.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-400" />
                <CardTitle className="text-white text-sm">
                  Enseignants
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-slate-400 text-xs">
                Accès étendu avec gestion des travaux et validation des dépôts.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="bg-blue-900/30 border-blue-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Validation requise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300 text-sm">
              Votre inscription sera examinée par l'équipe pédagogique. Vous
              recevrez un email de confirmation une fois votre compte validé.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
