-- Create private schema not exposed by the Data API
CREATE SCHEMA IF NOT EXISTS private_security;
REVOKE ALL ON SCHEMA private_security FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private_security TO service_role;

-- Drop existing policies that depend on public.has_role
DROP POLICY IF EXISTS "Administrators can view all roles" ON public.user_roles;

-- Recreate functions inside the private schema
CREATE OR REPLACE FUNCTION private_security.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION private_security.get_user_roles(_user_id uuid)
RETURNS SETOF public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
$$;

REVOKE ALL ON FUNCTION private_security.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private_security.get_user_roles(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private_security.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION private_security.get_user_roles(uuid) TO service_role;

-- Recreate RLS policy using the private function (RLS evaluates with definer chain)
CREATE POLICY "Administrators can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (private_security.has_role(auth.uid(), 'administrador'::public.app_role));

-- Drop the old public functions now that nothing depends on them
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.get_user_roles(uuid);