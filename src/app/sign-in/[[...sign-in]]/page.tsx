import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignIn } from "@clerk/nextjs";
import { BookOpen, Shield } from "lucide-react";

export default function SignInPage() {
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
            Master <span className="text-blue-400">DSN</span>
          </h1>
          <p className="text-slate-300">
            Connectez-vous à votre espace personnel
          </p>
        </div>

        {/* Sign In Component */}
        <div className="flex justify-center">
          <SignIn
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

        {/* Additional Info */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Accès réservé</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-400 text-sm">
              Cette plateforme est exclusivement destinée aux étudiants et
              enseignants du Master Droit et Sécurité Numériques. Votre
              inscription doit être validée par l'administration.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
