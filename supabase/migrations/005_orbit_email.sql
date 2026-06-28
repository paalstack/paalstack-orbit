CREATE TABLE IF NOT EXISTS public.email_templates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  subject    text NOT NULL,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_templates' AND policyname = 'Authenticated users can manage email templates') THEN
    CREATE POLICY "Authenticated users can manage email templates"
      ON public.email_templates FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_status' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.email_status AS ENUM ('queued', 'sent', 'failed', 'bounced');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.email_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
  recipient   text NOT NULL,
  status      public.email_status NOT NULL DEFAULT 'queued',
  provider    text NOT NULL DEFAULT 'resend',
  sent_at     timestamptz
);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_log' AND policyname = 'Authenticated users can view email log') THEN
    CREATE POLICY "Authenticated users can view email log"
      ON public.email_log FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_log' AND policyname = 'Authenticated users can insert email log') THEN
    CREATE POLICY "Authenticated users can insert email log"
      ON public.email_log FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_log' AND policyname = 'Authenticated users can update email log') THEN
    CREATE POLICY "Authenticated users can update email log"
      ON public.email_log FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;
