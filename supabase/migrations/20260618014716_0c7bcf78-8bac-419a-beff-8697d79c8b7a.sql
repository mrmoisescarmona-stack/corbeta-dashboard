DROP POLICY IF EXISTS "Authenticated users can view approvers" ON public.approvers;
CREATE POLICY "Administrators can view approvers"
ON public.approvers
FOR SELECT
TO authenticated
USING (private_security.has_role(auth.uid(), 'administrador'::app_role));