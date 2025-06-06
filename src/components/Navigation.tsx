"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  BookOpen,
  FileText,
  Menu,
  Search,
  Settings,
  Shield,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const navItems = [
    { href: "/", label: "Accueil", icon: BookOpen },
    { href: "/catalog", label: "Catalogue", icon: Search },
    { href: "/deposit", label: "Déposer", icon: Upload },
    { href: "/resources", label: "Ressources", icon: BookOpen },
    { href: "/dashboard", label: "Tableau de bord", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="sm" showText={false} />
            <div className="hidden sm:block">
              <span className="font-bold text-white">Master DSN</span>
              <p className="text-xs text-slate-400 -mt-1">
                Plateforme collaborative
              </p>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Boutons d'action desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-slate-600 hover:border-blue-500"
                >
                  <User className="mr-2 h-4 w-4" />
                  Se connecter
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Inscription
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-300">
                  Bonjour, {user?.firstName || "Utilisateur"}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard:
                        "bg-slate-800 border border-slate-700",
                      userButtonPopoverActionButton:
                        "text-white hover:bg-slate-700",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </SignedIn>
          </div>

          {/* Menu burger mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/98 backdrop-blur-md border-b border-slate-700 animate-fade-in">
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="pt-4 border-t border-slate-700 space-y-3">
                  <SignedOut>
                    <Link href="/sign-in">
                      <Button
                        variant="outline"
                        className="w-full text-white border-slate-600 hover:border-blue-500"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Inscription
                      </Button>
                    </Link>
                  </SignedOut>

                  <SignedIn>
                    <div className="text-center">
                      <p className="text-slate-300 mb-3">
                        Connecté en tant que {user?.firstName || "Utilisateur"}
                      </p>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 mx-auto",
                            userButtonPopoverCard:
                              "bg-slate-800 border border-slate-700",
                            userButtonPopoverActionButton:
                              "text-white hover:bg-slate-700",
                          },
                        }}
                        afterSignOutUrl="/"
                      />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
