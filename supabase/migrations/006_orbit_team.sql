DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'team_role' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.team_role AS ENUM ('admin', 'sales', 'manager');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.team_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  role       public.team_role NOT NULL DEFAULT 'sales',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Helper function: checks admin role without triggering RLS on team_members itself,
-- preventing infinite recursion in the policy below.
CREATE OR REPLACE FUNCTION public.is_team_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Authenticated users can view team') THEN
    CREATE POLICY "Authenticated users can view team"
      ON public.team_members FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Admins can manage team') THEN
    CREATE POLICY "Admins can manage team"
      ON public.team_members FOR ALL
      TO authenticated
      USING (public.is_team_admin() OR user_id = auth.uid())
      WITH CHECK (true);
  END IF;
END $$;
