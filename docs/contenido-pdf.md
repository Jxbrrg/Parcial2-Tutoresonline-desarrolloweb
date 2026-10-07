# Contenido del PDF — Parcial 2

> Copiar este contenido a Word/Google Docs y exportar a PDF.
> Reemplazar `URL_REPOSITORIO` y `URL_HOSTING` cuando estén publicados.

---

## PARCIAL 2 — PROYECTO FINAL
### TutoresOn-Line · Plataforma de Tutorías en Línea

---

### 1. Integrantes del equipo

| N° | Nombre |
|----|--------|
| 1 | Emel Sierra |
| 2 | Jhossuar Barragán |
| 3 | Kevin Arrieta |

- **Product Owner:** Profesor Edgar Morillo
- **Metodología:** SCRUM (dailys, reviews, retrospectivas semanales)

---

### 2. Repositorio de código

**URL del repositorio:** `URL_REPOSITORIO`

Contenido del repositorio (HTML, CSS y JS de todas las interfaces):

| Carpeta | Interfaces incluidas |
|---------|---------------------|
| raíz | `index.html` (inicio), `login.html`, `registro.html` |
| `/estudiante` | `busqueda.html`, `perfil-tutor.html`, `reservar.html`, `mis-sesiones.html`, `valorar.html` |
| `/tutor` | `dashboard.html`, `solicitudes.html`, `disponibilidad.html` |
| `/comun` | `videoconferencia.html`, `confirmacion.html` |
| `/css` | `base.css`, `layout.css`, `components.css` (organización por capas, principios SOLID/DRY) |
| `/js` | `datos.js` (datos de prueba), `app.js` (interacciones de la interfaz) |
| `/database` | `schema.sql` (SQL PostgreSQL), `diagrama.dbml` (modelo del diagrama) |

**Total: 13 interfaces HTML navegables.**

---

### 3. Hosting de la aplicación

**URL del hosting (navegabilidad):** `URL_HOSTING`

Permite recorrer toda la aplicación: inicio → registro/inicio de sesión →
búsqueda de tutores con filtros → perfil del tutor → reserva de sesión →
confirmación con notificaciones → videoconferencia → panel del tutor
(disponibilidad y solicitudes) → valoración por estrellas.

---

### 4. Diseño de la base de datos

**Tipo:** Relacional — **Motor:** PostgreSQL

#### 4.1 Diagrama visual

*(Insertar aquí la imagen exportada del diagrama:
abrir `database/diagrama.dbml` en https://dbdiagram.io/d → pegar → descargar PNG)*

#### 4.2 Tablas principales

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Cuentas de estudiantes, tutores y administradores (rol, credenciales) |
| `materias` | Catálogo de materias disponibles |
| `niveles_educativos` | Catálogo de niveles (primaria, secundaria, bachillerato, universitario, técnico) |
| `zonas` | Áreas geográficas para sesiones presenciales |
| `tutores` | Perfil público del tutor: biografía, tarifa, verificación y calificación promedio |
| `tutores_materias` | Relación N:M tutor–materia–nivel |
| `tutores_zonas` | Relación N:M tutor–zona (presencial) |
| `disponibilidad` | Horarios publicados por el tutor (día, hora inicio/fin, modalidad) |
| `solicitudes` | Reservas de sesiones: fecha, hora, duración, modo, estado, enlace de video, total |
| `sesiones` | Ejecución de una solicitud aprobada + resumen generado por IA |
| `valoraciones` | Reputación del tutor: estrellas 1–5 y comentario |
| `notificaciones` | Envíos por correo y WhatsApp con el registro de la tutoría |

#### 4.3 Relaciones clave

- `usuarios` 1–1 `tutores` (un usuario con rol tutor tiene un perfil de tutor)
- `tutores` N–M `materias` (a través de `tutores_materias`, con nivel educativo)
- `tutores` N–M `zonas` (a través de `tutores_zonas`, para presencial)
- `tutores` 1–N `disponibilidad`
- `usuarios` 1–N `solicitudes` (estudiante) · `tutores` 1–N `solicitudes`
- `solicitudes` 1–1 `sesiones` · `sesiones` 1–1 `valoraciones`
- `solicitudes` 1–N `notificaciones`

#### 4.4 Código SQL

*(Insertar en apéndice el contenido completo de `database/schema.sql`:
12 tablas con constraints, 8 índices y datos de ejemplo)*

---

### 5. Funcionalidades implementadas en la interfaz

1. Registro e inicio de sesión de estudiantes y tutores
2. Búsqueda de tutores por materia, nivel educativo, área geográfica y disponibilidad
3. Perfil del tutor con reputación por estrellas y reseñas (tipo MercadoLibre/Amazon)
4. Reserva de sesiones con selección de horario, modalidad (virtual/presencial) y duración
5. Panel del estudiante: próximas sesiones e historial
6. Panel del tutor: estadísticas, agenda del día y solicitudes
7. Gestión de disponibilidad semanal del tutor
8. Aceptar/rechazar solicitudes de tutoría
9. Videoconferencia integrada con chat (Jitsi Meet)
10. Confirmación de reserva con notificación por correo y WhatsApp
11. Valoración de tutores por estrellas
12. Propuesta de IA generativa: asistente de estudio que resuelve dudas y genera resúmenes
13. Diseño responsivo (web y móvil)
