# CLAUDE.md — We The People 39120
> Instrucciones para Claude en este proyecto. Leer al inicio de cada sesión.

---

## INICIO DE SESIÓN OBLIGATORIO

Al arrancar, Claude DEBE leer en este orden:
1. `SESSION_DIARY.md` — qué se hizo último
2. `GOLDEN_RULES.md` — reglas críticas del proyecto
3. `PENDING_BY_GEORGE.md` — qué acciones manuales están pendientes
4. Reportar en 2 líneas: qué se hizo último + qué está pendiente

---

## PROYECTO

**We The People 39120** — Plataforma cívica de reporte ciudadano para Natchez, Mississippi (ZIP 39120).
Ciudadanos reportan problemas (basura, baches, graffiti, etc.). Los reportes se publican en mapa público y se notifica al alderman del ward correspondiente.

**URL producción:** https://we-the-people-39120.vercel.app
**GitHub:** KlickifyAgency/we-the-people-39120
**Cliente:** George Smith / KlickifyAgency.com

---

## STACK

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, inline styles (mobile-first) |
| Database | Supabase (PostgreSQL + PostGIS + Auth + Storage) |
| Hosting | Vercel (auto-deploy on push to main) |
| Email | Resend (`RESEND_API_KEY`) — NOT SendGrid |
| Social | Make.com webhook → Facebook (`MAKE_WEBHOOK_URL`) |
| Maps | React-Leaflet + Leaflet + Turf.js (ward detection) |
| State | TanStack React Query v5 |

---

## ESTRUCTURA DE FASES

```
Phase 1 — Citizen Interface     → LIVE ✅
Phase 2 — Political Pressure    → Code built, flags OFF ⏸
Phase 3 — Municipal SaaS        → Not built ❌
Phase 4 — Politician Pro        → Not built ❌
Phase 5 — White Label           → Not built ❌
```

Flags en `src/lib/features.ts`. NUNCA borrar flags — solo poner `true`.

---

## ARCHIVOS CLAVE

| Archivo | Qué hace |
|---------|----------|
| `src/lib/features.ts` | Feature flags de todas las fases |
| `src/lib/constants.ts` | Aldermen, categorías, colores, MAYOR |
| `src/lib/types.ts` | Tipos TypeScript para todas las fases |
| `src/lib/email.ts` | Emails a aldermen y ciudadanos (Resend) |
| `src/lib/ward-detection-server.ts` | Server-side Turf.js ward detection |
| `src/app/api/v1/reports/route.ts` | POST: crea reporte, email alderman, Facebook post |
| `src/app/report/[id]/page.tsx` | Detalle del reporte (Me Too, comentarios, alderman) |
| `src/components/citizen/ReportForm.tsx` | Wizard 5 pasos (categoría→foto→GPS→desc→confirmar) |
| `vercel.json` | Crons: reminders (9am UTC), digest (3pm UTC) |
| `docs/DEPLOYMENT.md` | Guía completa de deploy |
| `docs/PHASE_2_ACTIVATION.md` | Cómo activar Phase 2 |

---

## ENV VARS — ESTADO VERIFICADO (2026-05-23)

| Variable | Local | Vercel | Valor |
|----------|-------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | fpasmbblciofpbcyfvrk.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | eyJhbGci... |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | eyJhbGci... |
| `NEXT_PUBLIC_APP_URL` | ✅ | ✅ | localhost:3001 / vercel.app |
| `RESEND_API_KEY` | ✅ | ? | re_5UMws6FR... |
| `CRON_SECRET` | ✅ | ? | wtp39120cron... |
| `MAKE_WEBHOOK_URL` | ✅ | ✅ | hook.us2.make.com/ttfmxhu7... |
| `MAKE_API_KEY` | ✅ | N/A | feb2b0d5... (solo Claude Code) |

**Make.com API:** Accesible via `curl -H "Authorization: Token $MAKE_API_KEY" https://us2.make.com/api/v2/`
- Scenario ID: 4251251
- Hook ID: 1939993
- Hook URL: https://hook.us2.make.com/ttfmxhu7vwgn86exyafxezyf5k85dtbz
- Full creds en: `~/.claude_env.sh` y `.env.local`

---

## REGLAS RÁPIDAS

1. Email = Resend, NO SendGrid
2. Facebook posts = Make.com webhook, NO Facebook API directo
3. Feature flags OFF = código existe pero inactivo
4. Fotos se comprimen a max 1200px / JPEG 0.75 antes de subir
5. `respond_token` = link exclusivo para alderman, no compartir
6. `SUPABASE_SERVICE_ROLE_KEY` NUNCA con prefijo `NEXT_PUBLIC_`
7. Archivos `* 2.ts` / `* 2.tsx` son duplicados basura — ignorar

---

## ALDERMEN DE NATCHEZ (6 WARDS)

| Ward | Nombre | Email (estimado) |
|------|--------|-----------------|
| 1 | Valencia Hall | vhall@natchez.ms.us |
| 2 | Billie Joe Frazier | bfrazier@natchez.ms.us |
| 3 | Sarah Carter-Smith | ssmith@natchez.ms.us |
| 4 | Felicia Bridgewater-Irving | firving@natchez.ms.us |
| 5 | Benjamin Davis | bdavis@natchez.ms.us |
| 6 | Curtis Moroney | cmoroney@natchez.ms.us |

**Mayor:** Dan M. Gibson — dgibson@natchez.ms.us

---

## VER TAMBIÉN

- `GOLDEN_RULES.md` — reglas detalladas del proyecto
- `PENDING_BY_GEORGE.md` — acciones manuales pendientes
- `SESSION_DIARY.md` — historial de sesiones
