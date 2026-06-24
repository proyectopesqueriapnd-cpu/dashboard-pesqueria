# Dashboard Pesquería

Proyecto listo para subir a GitHub y desplegar en Vercel.

## Cambios incluidos

- Archivo principal renombrado a `index.html`.
- Carga configurada para `Hoja 1` y `Hoja 2`.
- `Hoja 1` envía el parámetro `columns=A,B,C,D,H,AE,AF,AG,AH`.
- Protección agregada para que no se caiga si Lucide tarda en cargar.
- Renderizado más tolerante si alguna columna/categoría no existe.

## Subir a GitHub desde VS Code

```bash
git init
git add .
git commit -m "Dashboard Pesqueria"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/dashboard-pesqueria.git
git push -u origin main
```

Luego en Vercel: **Add New Project → Import Git Repository → Deploy**.

> Nota: para que el filtro de columnas funcione al 100%, tu Apps Script debe leer el parámetro `columns`. Si no lo lee todavía, el dashboard seguirá cargando Hoja 1 completa.
