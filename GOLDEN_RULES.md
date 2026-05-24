# GOLDEN RULES — We The People 39120
> Actualizado: 2026-05-23

---

## REGLA #1 — FEATURE FLAGS, NUNCA BORRAR

`src/lib/features.ts` controla todo. Jamás eliminar un flag — solo poner `true` cuando la fase está lista.
Phase 2 flags están OFF. TODO el código Phase 2 ya existe. Solo se activan los flags.

## REGLA #0 — ANONIMATO TOTAL: FACEBOOK ES EL ÚNICO CANAL REAL

**TODOS los reportes son anónimos.** Nadie da nombre ni email — pueblo chico, todos se conocen.
Consecuencia directa:
- `notify-citizens.ts` → envia a 0 personas (lista de auth users vacía)
- Digest cron → envia a 0 personas
- Profile / Leaderboard → nadie los usa (no hay cuentas)
- **ÚNICO canal que llega a la comunidad: Facebook via Make.com webhook**

NUNCA diseñar features que requieran cuenta/email para funcionar.
SIEMPRE que haya un evento importante → Facebook post via Make.com.
Eventos que DEBEN ir a Facebook: nuevo reporte, community update, community resolved, 30-day overdue, monthly accountability digest.

## REGLA #2 — EMAIL: RESEND (NO SENDGRID)

El stack usa **Resend** (`resend` npm package), NO SendGrid.
- API Key env var: `RESEND_API_KEY`
- From: `noreply@klickifyagency.com`
- CC siempre: `info@klickifyagency.com`
- `.env.local.example` dice "SENDGRID_API_KEY" — está desactualizado, ignorar

## REGLA #3 — FACEBOOK: MAKE.COM WEBHOOK

Posts a Facebook van via Make.com, NO directo a Facebook API.
- Env var: `MAKE_WEBHOOK_URL`
- La ruta `/api/v1/reports` POST lo dispara automáticamente al crear reporte
- Sin `MAKE_WEBHOOK_URL` en Vercel = posts silenciosamente ignorados

## REGLA #4 — WARD DETECTION ESTÁ ACTIVO (LADO SERVIDOR)

`src/lib/ward-detection-server.ts` corre en el servidor y asigna ward a cada reporte.
Ya detecta ward y envía email al alderman correcto. Phase 2 agrega más lógica encima.

## REGLA #5 — ARCHIVOS DUPLICADOS SON BASURA, NO BUILDEAR

Estos archivos CON ESPACIO en nombre NO son parte del build de Next.js:
- `src/app/api/v1/reports/route 2.ts`
- `src/app/report/[id]/page 2.tsx`
Ignorarlos. Borrarlos cuando George confirme que están seguros.

## REGLA #6 — ALDERMEN: EMAILS EN CONSTANTS.TS

Los 6 aldermen tienen emails en `src/lib/constants.ts` → `ALDERMEN` object.
Siempre verificar esa fuente antes de hardcodear emails en otro lugar.
Mayor: Dan M. Gibson → `dgibson@natchez.ms.us`

## REGLA #7 — VERCEL CRONS (NO VPS PARA PHASE 1)

Vercel maneja los crons via `vercel.json`:
- `/api/cron/reminders` → 9am UTC daily
- `/api/cron/digest` → 3pm UTC daily (= 10am CT)
VPS solo para Phase 2+ escalation (escalation-check.js, ver DEPLOYMENT.md)

## REGLA #8 — SUPABASE: SERVICE ROLE SOLO SERVER-SIDE

`SUPABASE_SERVICE_ROLE_KEY` NUNCA con prefijo `NEXT_PUBLIC_`.
Solo en server routes y cron jobs. Browser usa anon key.

## REGLA #9 — FOTOS: COMPRESIÓN OBLIGATORIA

Antes de subir a Supabase Storage (`report-photos` bucket):
- Max dimensión: 1200px
- Formato: JPEG, calidad 0.75
- Tanto ReportForm.tsx como page.tsx comentarios comprimen antes de enviar

## REGLA #11 — DISEÑO: APROBACIÓN PREVIA OBLIGATORIA

**NUNCA hacer full UI revamp sin aprobación explícita de George primero.**
- El revamp Bold Civic Light (2026-05-23) fue rechazado en su totalidad
- Proceso correcto: mostrar mockups/referencias → George aprueba → implementar
- Si George dice "mejora el diseño", preguntar primero: ¿qué no le gusta? ¿referencias?
- Al hacer revamp de homepage: NO convertirlo en marketing page pura — mantener lista de reports visible

## REGLA #10 — RESPOND TOKEN: ÚNICO POR REPORTE

Cada reporte genera `respond_token` (crypto.randomUUID) al crear.
Link exclusivo para alderman → `/respond/[token]`.
NO compartir con ciudadanos.
