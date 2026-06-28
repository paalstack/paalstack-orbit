DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_trigger' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.workflow_trigger AS ENUM ('lead_status_changed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_action' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.workflow_action AS ENUM ('create_task', 'send_email');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.workflow_rules (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  trigger_event  public.workflow_trigger NOT NULL,
  condition      jsonb NOT NULL DEFAULT '{}',
  action         public.workflow_action NOT NULL,
  action_payload jsonb NOT NULL DEFAULT '{}',
  active         boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workflow_rules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workflow_rules' AND policyname = 'Authenticated users can manage workflow rules') THEN
    CREATE POLICY "Authenticated users can manage workflow rules"
      ON public.workflow_rules FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
