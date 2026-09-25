-- Account access controls for the existing admin role.
-- Apply this migration in the target Supabase project's SQL Editor.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE OR REPLACE FUNCTION public.admin_list_accounts()
RETURNS TABLE (
  id integer,
  full_name text,
  email text,
  role text,
  is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u
    WHERE lower(u.email) = lower(auth.jwt() ->> 'email')
      AND u.role = 'admin'
      AND u.is_active = true
  ) THEN
    RAISE EXCEPTION 'Administrator access required';
  END IF;

  RETURN QUERY
  SELECT u.id, u.full_name::text, u.email::text, u.role::text, u.is_active
  FROM public.users u
  WHERE u.role IN ('student', 'faculty')
  ORDER BY u.role, u.full_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_account_active(target_user_id integer, active boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u
    WHERE lower(u.email) = lower(auth.jwt() ->> 'email')
      AND u.role = 'admin'
      AND u.is_active = true
  ) THEN
    RAISE EXCEPTION 'Administrator access required';
  END IF;

  UPDATE public.users u
  SET is_active = active
  WHERE u.id = target_user_id
    AND u.role IN ('student', 'faculty');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student or faculty account not found';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_accounts() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_account_active(integer, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_accounts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_account_active(integer, boolean) TO authenticated;

-- Promote an existing account to master admin after replacing the email:
-- UPDATE public.users SET role = 'admin' WHERE lower(email) = lower('admin@example.edu');
