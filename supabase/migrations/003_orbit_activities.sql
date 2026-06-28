DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.activity_type AS ENUM ('note', 'call', 'meeting', 'status_change', 'email_sent', 'task');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.activities (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type       public.activity_type NOT NULL,
  note       text,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_lead_id    ON public.activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON public.activities(created_by);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Authenticated users can view activities') THEN
    CREATE POLICY "Authenticated users can view activities"
      ON public.activities FOR SELECT
      TO authenticated
      USING (
        created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.leads l
          WHERE l.id = activities.lead_id
            AND (l.owner_id = auth.uid() OR l.assigned_to = auth.uid())
        )
        OR EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Authenticated users can insert activities') THEN
    CREATE POLICY "Authenticated users can insert activities"
      ON public.activities FOR INSERT
      TO authenticated
      WITH CHECK (created_by = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Activity creators can delete their activities') THEN
    CREATE POLICY "Activity creators can delete their activities"
      ON public.activities FOR DELETE
      TO authenticated
      USING (created_by = auth.uid());
  END IF;
END $$;
