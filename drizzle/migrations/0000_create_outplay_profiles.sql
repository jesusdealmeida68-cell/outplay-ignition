CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  player_name text NOT NULL CHECK (char_length(player_name) BETWEEN 3 AND 24),
  outplay_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Players create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id AND outplay_id IS NULL);
CREATE POLICY "Players update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND outplay_id IS NULL);