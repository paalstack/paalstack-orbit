DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  company     text,
  email       text,
  phone       text,
  source      text,
  status      public.lead_status NOT NULL DEFAULT 'new',
  owner_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  value       numeric(12,2),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_status      ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_owner_id    ON public.leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Authenticated users can view leads in their team') THEN
    CREATE POLICY "Authenticated users can view leads in their team"
      ON public.leads FOR SELECT
      TO authenticated
      USING (
        owner_id = auth.uid()
        OR assigned_to = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.team_members tm
          WHERE tm.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Authenticated users can insert leads') THEN
    CREATE POLICY "Authenticated users can insert leads"
      ON public.leads FOR INSERT
      TO authenticated
      WITH CHECK (owner_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Lead owners can update their leads') THEN
    CREATE POLICY "Lead owners can update their leads"
      ON public.leads FOR UPDATE
      TO authenticated
      USING (owner_id = auth.uid() OR assigned_to = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Lead owners can delete their leads') THEN
    CREATE POLICY "Lead owners can delete their leads"
      ON public.leads FOR DELETE
      TO authenticated
      USING (owner_id = auth.uid());
  END IF;
END $$;
