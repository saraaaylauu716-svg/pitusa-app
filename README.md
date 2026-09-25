# Pitusa - IA Especialista en Artistas Musicales 🍪🎵

**Pitusa** es una aplicación web interactiva impulsada por inteligencia artificial (Google Gemini API), especializada exclusivamente en responder preguntas sobre **artistas musicales de todos los géneros, épocas y países**.

---

## ✨ Características Principales

- **Conocimiento Universal de Artistas**:
  - Biografías completas, fechas de nacimiento, orígenes y trayectoria cultural.
  - Discografía exhaustiva: álbumes de estudio, directos, EPs y canciones icónicas.
  - Formación de bandas, alineaciones originales, cambios de integrantes y proyectos solistas.
  - Premios y récords mundiales: Premios Grammy, Latin Grammy, Premios Gardel, Óscars, Rock and Roll Hall of Fame y streaming en Spotify/YouTube.
  - Productores históricos y anécdotas compositivas.

- **Filtro Temático Estricto**:
  - Diseñada exclusivamente para el mundo de la música. Si recibe consultas ajenas (recetas, matemáticas, deportes, ciencias, tecnología general), responde de forma educada y estricta:
    > *"Lo siento, pero solo respondo consultas sobre artistas musicales, bandas, cantantes y su obra musical."*

- **Diseño Visual & UI**:
  - Interfaz translúcida (*glassmorphism*) sobre un fondo espacial estético.
  - Globos de conversación flotantes de alta legibilidad.
  - Preguntas sugeridas de acceso rápido para explorar leyendas musicales.
  - Panel desplegable de normas operativas.
  - Botón para copiar respuestas al portapapeles y reiniciar conversación.

---

## 🛠️ Stack Tecnológico

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Iconografía)
- **Backend**:
  - [Express](https://expressjs.com/)
  - [Google GenAI SDK](https://github.com/google-gemini/generative-ai-js) (`@google/genai`)
  - Modelos recomendados: `gemini-3.1-flash-lite` y `gemini-3.8-flash`

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/pitusa-music-ai.git
cd pitusa-music-ai
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia la plantilla `.env.example` a `.env`:
```bash
cp .env.example .env
```
Edita `.env` y coloca tu clave de API de Gemini:
```env
GEMINI_API_KEY="AIzaSy..."
```
*(Puedes obtener tu clave gratuita en [Google AI Studio](https://aistudio.google.com/)).*

### 4. Iniciar en desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:3000`.

### 5. Compilar para producción
```bash
npm run build
npm start
```

---

## 📁 Estructura del Proyecto

```text
├── .env.example            # Plantilla de variables de entorno (sin secretos)
├── .gitignore              # Archivos y carpetas excluidos del control de versiones
├── index.html              # Entrada HTML con metadatos OpenGraph y favicon
├── package.json            # Scripts y dependencias del proyecto
├── server.ts               # Servidor Express, endpoints de chat y proxy a Gemini
├── server/
│   └── knowledgeBase.ts    # Prompt del sistema, reglas estrictas y documentación de apoyo
├── src/
│   ├── App.tsx             # Componente principal de la app y orquestador del chat
│   ├── main.tsx            # Punto de montaje de React
│   ├── types.ts            # Interfaces TypeScript
│   ├── index.css           # Estilos globales y Tailwind CSS
│   └── components/
│       ├── ChatInput.tsx   # Barra de entrada de texto expandible con atajo Enter
│       ├── Header.tsx      # Barra superior con avatar, título y botón de reinicio
│       ├── MessageItem.tsx # Renderizado de globos de chat con badge y botón de copiar
│       ├── RulesBanner.tsx # Acordeón desplegable con normas del asistente
│       └── SuggestedChips.tsx # Botones de preguntas sugeridas
└── public/
    ├── nyan_bg.jpg         # Imagen de fondo espacial
    └── pitusa.jpg          # Avatar oficial de Pitusa
```

---

## 🔒 Seguridad y Buenas Prácticas

- **Sin claves expuestas**: La clave `GEMINI_API_KEY` se lee exclusivamente en el servidor backend (`server.ts`). El frontend nunca tiene acceso a la clave ni realiza llamadas directas a proveedores externos de IA.
- **Resiliencia**: Si el servidor experimenta una interrupción temporal o falta la clave, cuenta con un mecanismo de fallback integrado que orienta al desarrollador.
- **Protección contra Prompt Injections**: El prompt del sistema está blindado para no revelar directivas internas ni apartarse de su rol de especialista musical.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. ¡Siéntete libre de utilizarlo, modificarlo y compartirlo!
