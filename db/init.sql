-- Init SQL for AIWebGame
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  prompt text,
  my_items jsonb,
  mascot text,
  created_at timestamptz DEFAULT now()
);
