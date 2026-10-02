# CAPSULABITS 🕹️

Landing page de **CAPSULABITS** — bar de videojuegos, comida y eventos en Saltillo, Coahuila.

Sitio estático en HTML + CSS + JavaScript vanilla con **Tailwind CSS v3 compilado** (sin CDN en runtime).

## Estructura

```
CAPSULA/
├── index.html          # Página principal (hero, promos, menú, eventos, ubicación)
├── menu.html           # Selector de platillos estilo "CHOOSE YOUR FIGHTER"
├── css/
│   ├── input.css       # Punto de entrada de Tailwind (@tailwind directives)
│   ├── styles.css      # CSS compilado (generado, no editar a mano)
│   └── estilos.css     # Estilos propios: neones, glass-panel, accesibilidad
├── js/
│   ├── main.js         # Menú móvil + carrusel de promociones
│   ├── menu-select.js  # Base de datos del menú (44 platillos) y selector
│   └── (tailwind.config.js está en la raíz)
├── tailwind.config.js  # Configuración de Tailwind (colores capsula-*, fuentes)
├── package.json        # Scripts de build
└── Recursos/           # Logos, imágenes promocionales, menú PDF
```

## Desarrollo

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Compilar el CSS
npm run build

# 3. Levantar el servidor local (http://localhost:8080)
npm start
```

Para recompilar automáticamente al guardar cambios:

```bash
npm run dev
```

> **Importante:** después de agregar o modificar clases Tailwind en el HTML/JS, ejecuta `npm run build` (o deja `npm run dev` corriendo). Si un estilo no aparece, casi siempre es porque falta recompilar.

## Verificaciones automatizadas

Con el servidor corriendo (`npm start`), en otra terminal:

```bash
# Responsive: scroll horizontal y elementos fuera del viewport
# en 320/360/390/768/1280 px (ambas páginas). Capturas en /tmp/opencode/shots
npm run check:responsive

# Funcional: menú hamburguesa, flechas del roster, anclas,
# botón de pausa del carrusel, foco y teclado
npm run check:functional

# Ambas
npm run check
```

## Checklist después de cambios

- [ ] `npm run build` ejecutado
- [ ] `npm run check` en verde
- [ ] Probar en móvil (~360px) que no haya scroll horizontal
- [ ] Probar el menú hamburguesa y el selector de platillos con teclado (Tab + Enter)
