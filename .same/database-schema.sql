-- Schéma de base de données pour la plateforme Master DSN
-- À exécuter dans Supabase SQL Editor

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL, -- ID Clerk
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des travaux déposés
CREATE TABLE IF NOT EXISTS works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  module TEXT NOT NULL,
  teacher TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL, -- ID Clerk de l'auteur
  views_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'under_review' CHECK (status IN ('draft', 'published', 'under_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des modules
CREATE TABLE IF NOT EXISTS modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  teacher_id TEXT, -- ID Clerk du professeur responsable
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des enseignants
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  email TEXT,
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des modules par défaut
INSERT INTO modules (name, description) VALUES
  ('Droit du numérique', 'Fondements juridiques du numérique'),
  ('Cybersécurité juridique', 'Aspects légaux de la cybersécurité'),
  ('Protection des données', 'RGPD et protection de la vie privée'),
  ('Commerce électronique', 'Droit du e-commerce'),
  ('Propriété intellectuelle numérique', 'PI dans l''ère numérique'),
  ('Régulation des plateformes', 'Gouvernance des plateformes numériques'),
  ('Intelligence artificielle et droit', 'Enjeux juridiques de l''IA'),
  ('Blockchain et cryptomonnaies', 'Droit des cryptoactifs'),
  ('Gouvernance de l''internet', 'Régulation d''Internet'),
  ('Droit pénal numérique', 'Cybercriminalité et procédure'),
  ('Contrats numériques', 'Droit des contrats dématérialisés'),
  ('Méthodologie de recherche', 'Méthodologie juridique')
ON CONFLICT (name) DO NOTHING;

-- Insertion des enseignants par défaut
INSERT INTO teachers (name, specialization) VALUES
  ('Prof. Martin DUPONT', 'Droit du numérique'),
  ('Prof. Sophie BERNARD', 'Protection des données'),
  ('Prof. Jean-Claude MARTIN', 'Cybersécurité'),
  ('Prof. Marie DUBOIS', 'Intelligence artificielle'),
  ('Prof. Alexandre LAURENT', 'Propriété intellectuelle'),
  ('Prof. Catherine MOREAU', 'Commerce électronique'),
  ('Prof. Philippe PETIT', 'Blockchain'),
  ('Prof. Isabelle ROUX', 'Droit pénal numérique')
ON CONFLICT (name) DO NOTHING;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_works_user_id ON works(user_id);
CREATE INDEX IF NOT EXISTS idx_works_module ON works(module);
CREATE INDEX IF NOT EXISTS idx_works_status ON works(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Politique de sécurité RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON profiles
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Politiques pour les travaux
CREATE POLICY "Tout le monde peut voir les travaux publiés" ON works
  FOR SELECT USING (status = 'published');

CREATE POLICY "Les utilisateurs peuvent voir leurs propres travaux" ON works
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres travaux" ON works
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres travaux" ON works
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Fonctions pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
