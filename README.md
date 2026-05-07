# Proyecto Final: Gestión de Tareas con React

Aplicación React + TypeScript para gestionar el ciclo completo de tareas (listar, crear, editar, cambiar estado y eliminar) conectada al backend `taskdone-node`.

## API backend

- Base URL esperada: `https://taskdone-node.onrender.com/api`
- Documentación Swagger: `https://taskdone-node.onrender.com/api-docs`
- Endpoints de tareas:
  - `GET /tasks`
  - `POST /tasks`
  - `PUT /tasks/:id`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`

## Configuración local

1. Instalar dependencias:
```bash
npm install
```

2. Crear variables de entorno:
```bash
cp .env.sample .env
```

3. Verificar `VITE_API_URL`:
```env
VITE_API_URL=https://taskdone-node.onrender.com/api
```

4. Levantar entorno de desarrollo:
```bash
npm run dev
```

## Scripts disponibles

- `npm run dev`: ejecuta Vite en modo desarrollo.
- `npm run lint`: ejecuta ESLint.
- `npm run build`: compila TypeScript y genera `dist/`.
- `npm run preview`: previsualiza build local.
- `npm run deploy`: publica `dist/` en rama `gh-pages`.

## Deploy en GitHub Pages

Consultar `GITHUB-PAGES.md` para los pasos completos de publicación.
