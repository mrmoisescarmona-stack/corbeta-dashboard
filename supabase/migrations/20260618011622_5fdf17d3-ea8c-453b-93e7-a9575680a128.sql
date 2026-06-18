
CREATE TABLE public.approvers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identification TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  direction TEXT NOT NULL,
  division TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo','Inactivo','Pendiente')),
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  manager TEXT NOT NULL DEFAULT '',
  zone TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT '',
  start_date DATE,
  scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.approvers TO authenticated;
GRANT ALL ON public.approvers TO service_role;

ALTER TABLE public.approvers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view approvers"
  ON public.approvers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Administrators can insert approvers"
  ON public.approvers FOR INSERT
  TO authenticated
  WITH CHECK (private_security.has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Administrators can update approvers"
  ON public.approvers FOR UPDATE
  TO authenticated
  USING (private_security.has_role(auth.uid(), 'administrador'::app_role))
  WITH CHECK (private_security.has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Administrators can delete approvers"
  ON public.approvers FOR DELETE
  TO authenticated
  USING (private_security.has_role(auth.uid(), 'administrador'::app_role));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_approvers_updated_at
  BEFORE UPDATE ON public.approvers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.approvers (identification, name, direction, division, active, status, email, phone, manager, zone, unit, start_date, scopes) VALUES
('52123456','María González','Electrodomésticos','Línea Blanca',true,'Activo','maria.gonzalez@corbeta.com','3101234567','Roberto Díaz','Bogotá Norte','Bogotá Norte','2024-03-15','[{"code":"SC-001","description":"Aprobación descuentos puntuales hasta 8%","limit":"8%","status":"Activo"},{"code":"SC-002","description":"Aprobación descuentos por volumen","limit":"12%","status":"Activo"}]'::jsonb),
('79123456','Pedro Martínez','Tecnología','Computación',true,'Pendiente','pedro.martinez@corbeta.com','3119876543','Ana Ruiz','Medellín','Antioquia Centro','2023-09-01','[{"code":"SC-010","description":"Aprobación descuentos línea Cómputo","limit":"10%","status":"Pendiente"}]'::jsonb),
('35123456','Laura Sánchez','Hogar','Muebles',false,'Activo','laura.sanchez@corbeta.com','3134567890','Carlos Vega','Cali','Valle','2022-01-10','[{"code":"SC-020","description":"Aprobación descuentos línea Muebles","limit":"6%","status":"Pendiente"}]'::jsonb)
ON CONFLICT (identification) DO NOTHING;
