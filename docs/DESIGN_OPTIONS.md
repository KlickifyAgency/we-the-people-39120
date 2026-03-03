# We The People 39120 — Opciones de diseño UI

La app usa actualmente **Opción A**. Puedes pedir cambiar a B o C y se aplican los tokens correspondientes.

---

## Opción A — Minimal claro (actual)

- **Fondo:** Blanco / gris muy claro (`#fafafa`)
- **Header y nav:** Blanco con borde sutil, texto oscuro
- **Acento:** Azul (`#2563eb`) en botones primarios, links y estados activos
- **Tipografía:** Inter, tamaños contenidos (16px base)
- **Cards:** Bordes suaves, sombra ligera, radios 12–16px
- **Sensación:** App cívica moderna, limpia, fácil de escanear

---

## Opción B — Minimal oscuro (dark mode)

- **Fondo:** Gris muy oscuro (`#0f172a`), superficies `#1e293b`
- **Texto:** Blanco / gris claro; muted en gris medio
- **Acento:** Mismo azul o cyan suave para contraste
- **Bordes:** Gris oscuro (`#334155`)
- **Ideal para:** Uso nocturno o preferencia dark

*Para activar: cambiar variables en `src/app/globals.css` (`:root` o `[data-theme="dark"]`).*

---

## Opción C — Minimal cálido (clay / terracota)

- **Fondo:** Crema / off-white (`#faf8f5`)
- **Acento:** Natchez Gold suavizado (`#b45309`) o terracota (`#c2410c`)
- **Cards:** Bordes beige, sombras cálidas
- **Tipografía:** Igual (Inter) o serif suave para títulos
- **Sensación:** Más “Mississippi”, acogedor, menos corporativo

*Para activar: sustituir `--color-accent` y opcionalmente `--color-bg` en `globals.css`.*

---

## Cómo cambiar de opción

1. **Opción B (dark):** Añadir en `layout.tsx` un wrapper con `data-theme="dark"` y en `globals.css` definir las variables bajo `[data-theme="dark"]`. Opcional: toggle en Profile.
2. **Opción C (cálido):** En `globals.css` cambiar `--color-bg` y `--color-accent` (y si quieres `--color-accent-soft`) por la paleta cálida.

Si quieres que implemente B o C en el código, dilo y lo aplico.
