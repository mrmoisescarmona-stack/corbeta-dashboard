GRANT USAGE ON SCHEMA private_security TO authenticated, anon;
GRANT EXECUTE ON FUNCTION private_security.has_role(uuid, public.app_role) TO authenticated, anon;