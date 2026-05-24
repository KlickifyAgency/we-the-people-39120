# PENDING BY GEORGE — We The People 39120
> Actualizado: 2026-05-23

Acciones que requieren intervención manual de George.

---

## 🔴 BLOQUEADORES (hacer pronto)

### 0. Remover Profile/Leaderboard del nav — nadie los usa
Todos los reportes son anónimos. Nadie crea cuenta. Profile y Leaderboard son páginas fantasma.
- [ ] Quitar de BottomNav o mover a un lugar secundario
- [ ] Quitar CTA "Create Profile" del homepage
- [ ] Leaderboard → puede quedar como easter egg o eliminarse



### 1. Confirmar variables de entorno en Vercel
Verificar que estos env vars están seteados en Vercel dashboard:
- [ ] `RESEND_API_KEY` — emails a aldermen y ciudadanos
- [ ] `MAKE_WEBHOOK_URL` — posts automáticos a Facebook via Make.com
- [ ] `NEXT_PUBLIC_APP_URL` → `https://we-the-people-39120.vercel.app`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (solo Production + Preview)

### 2. Verificar que Make.com webhook está activo
El webhook en Make.com que recibe los posts de Facebook.
Si no hay posts en Facebook cuando se crea un reporte, el webhook URL está roto o no seteado.

---

## 🟡 PHASE 2 ACTIVATION (cuando estés listo)

### 3. Conseguir GeoJSON de ward boundaries de Natchez
- URL oficial: https://natchez.ms.us/DocumentCenter/View/1290/Natchez-Ward-Map
- Convertir PDF → GeoJSON con Mapshaper.org o QGIS
- Cada feature necesita propiedad `ward_number` (1-6)
- Subir a Supabase via SQL (ver docs/PHASE_2_ACTIVATION.md Step 2)

### 4. Confirmar emails reales de los 6 aldermen
Los emails en `src/lib/constants.ts` son estimados. Verificar que son correctos:
- Ward 1: vhall@natchez.ms.us → Valencia Hall
- Ward 2: bfrazier@natchez.ms.us → Billie Joe Frazier
- Ward 3: ssmith@natchez.ms.us → Sarah Carter-Smith
- Ward 4: firving@natchez.ms.us → Felicia Bridgewater-Irving
- Ward 5: bdavis@natchez.ms.us → Benjamin Davis
- Ward 6: cmoroney@natchez.ms.us → Curtis Moroney

---

## 🟢 LIMPIEZA (cuando tengas 5 minutos)

### 5. Eliminar archivos duplicados basura
Estos archivos tienen espacio en el nombre, no son parte del build:
```bash
rm "src/app/api/v1/reports/route 2.ts"
rm "src/app/report/[id]/page 2.tsx"
```

### 6. Actualizar .env.local.example
Dice "BluffWatch" (nombre viejo del proyecto). Actualizar a "We The People 39120".
También agregar `RESEND_API_KEY` y `MAKE_WEBHOOK_URL`.

---

## 🔴 DISEÑO PENDIENTE

### 7. Acordar dirección de nuevo diseño ANTES de implementar
El revamp Bold Civic Light fue rechazado. Antes de hacer cualquier nuevo intento de rediseño:
- [ ] George decide: ¿qué le falta al diseño actual? ¿Más color? ¿Más grande? ¿Más moderno?
- [ ] Mostrar referencias/ejemplos concretos antes de codificar
- [ ] NO hacer full revamp sin aprobación explícita de George primero

---

## ✅ COMPLETADO

- [x] **Make.com webhook verificado** — URL activa, en .env.local y Vercel ✅
- [x] **Make.com API key guardada** — `~/.claude_env.sh` + `.env.local` ✅
- [x] **MAKE_WEBHOOK_URL en Vercel** — confirmado (seteada hace 86 días) ✅
- [x] **Estructura militar creada** — SESSION_DIARY, GOLDEN_RULES, PENDING_BY_GEORGE, CLAUDE.md, memory files ✅
- [x] **Archivos duplicados eliminados** — `route 2.ts` y `page 2.tsx` borrados ✅
- [x] **Auditoría mobile completada** — iOS zoom, touch targets, overscroll, tap highlight ✅
- [x] **Bold Civic Light revamp** — hecho y REVERTIDO (George no aprobó) ✅
