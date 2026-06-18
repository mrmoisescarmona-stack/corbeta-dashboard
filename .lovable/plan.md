## Cambio en la tabla de Resultados (Reportes y Trazabilidad)

Reemplazar las 3 columnas actuales (`% Prov.`, `% Corb.`, `% Total`) por **6 columnas** agrupadas visualmente en dos bloques: el porcentaje **Original** (como llegó la preorden) y el **Actualizado** (después de la gestión del proveedor / aprobador).

### Nuevas columnas

```text
| % Prov. Original | % Corb. Original | % Total Original | % Prov. Actualizado | % Corb. Actualizado | % Total Actualizado |
```

- Las "Originales" siempre muestran el valor con el que llegó la preorden.
- Las "Actualizadas" muestran el valor final tras la gestión. Si la línea no fue alterada (valores iguales al original), las celdas actualizadas se renderizan con un guion `—` y color atenuado para diferenciarlas visualmente. Si fueron alteradas, se muestran en color con un pequeño indicador `▲`/`▼` opcional según suban o bajen vs el original.
- Para distinguir los dos bloques en la cabecera, agrego un sub-encabezado: una fila superior con dos celdas que abarcan 3 columnas cada una ("Original" y "Actualizado") y la fila inferior con `% Prov. / % Corb. / % Total`. Esto se aplica también al CSV exportado.

### Datos mock (`traceResults`)

Extender cada fila con los seis campos:

- `provOriginal`, `corbOriginal`, `totalOriginal`
- `provActual`, `corbActual`, `totalActual`

Datos sugeridos para los dos registros existentes:

- `PO-2026-004510`: original `4.0% / 3.0% / 7.0%` → actualizado `3.5% / 2.5% / 6.0%` (modificado por aprobador).
- `PO-2026-004505`: original `5.0% / 2.0% / 7.0%` → actualizado `0.0% / 0.0% / 0.0%` (rechazada).

### Archivos a tocar

- `src/routes/panel.reportes.tsx`
  - Cabecera de tabla con dos filas (grouped headers) y divisor sutil entre bloques.
  - Cuerpo: render de las 6 celdas con estilos diferenciados (atenuado si igual al original).
  - Tipo y dataset `traceResults` actualizados.

No se modifican filtros, KPIs ni gráficos.
