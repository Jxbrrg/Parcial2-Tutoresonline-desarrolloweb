# 🎓 TutoresOn-Line — Plataforma de Tutorías en Línea y Presencial

**Proyecto Final · Parcial 2 · Desarrollo Web**

Plataforma que conecta estudiantes con tutores calificados en diferentes materias y
niveles educativos. Los estudiantes buscan y reservan sesiones; los tutores gestionan
su disponibilidad y aceptan solicitudes. Las sesiones ocurren por videoconferencia
integrada o de forma presencial.

**Equipo:**
- Emel Sierra
- Jhossuar Barragán
- Kevin Arrieta

**Product Owner:** Profesor Edgar Morillo · **Metodología:** SCRUM

---

## 📁 Estructura del proyecto

```
├── index.html                # Landing principal
├── login.html                # Inicio de sesión
├── registro.html             # Registro de estudiantes y tutores
├── estudiante/
│   ├── busqueda.html         # Búsqueda con 4 filtros (materia, nivel, zona, disponibilidad)
│   ├── perfil-tutor.html     # Perfil público del tutor + reputación y reseñas
│   ├── reservar.html         # Reserva de sesiones (horarios, modalidad, duración)
│   ├── mis-sesiones.html     # Panel del estudiante (próximas e historial)
│   └── valorar.html          # Calificación del tutor por estrellas
├── tutor/
│   ├── dashboard.html        # Panel del tutor (estadísticas, agenda, solicitudes)
│   ├── solicitudes.html      # Aceptar / rechazar solicitudes de tutoría
│   └── disponibilidad.html   # Gestión de horarios semanales
├── comun/
│   ├── videoconferencia.html # Sala de videoconferencia (integración Jitsi Meet)
│   └── confirmacion.html     # Confirmación de reserva + notificaciones
├── css/
│   ├── base.css              # Variables, reset, tipografía, utilidades
│   ├── layout.css            # Header, footer, heroes, layouts de página
│   └── components.css        # Botones, cards, formularios, tablas, estrellas
├── js/
│   ├── datos.js              # Datos mock (simulan la respuesta del API)
│   └── app.js                # Lógica de interfaz (filtros, reservas, etc.)
├── database/
│   ├── schema.sql            # Código SQL PostgreSQL (tablas, índices, datos)
│   └── diagrama.dbml         # DBML para generar el diagrama en dbdiagram.io
└── docs/
    └── contenido-pdf.md      # Contenido del PDF del Parcial 2
```

## 🚀 Ejecutar localmente

No requiere compilación. Solo sirve los archivos estáticos:

```bash
# Opción 1: con VS Code (Live Server)
# Clic derecho sobre index.html → "Open with Live Server"

# Opción 2: con Python
python -m http.server 8080

# Opción 3: con Node
npx serve .
```

Abrir `http://localhost:8080`.

## 🗄 Base de datos

- **Motor:** PostgreSQL (relacional)
- **Diagrama:** abrir `database/diagrama.dbml` en [dbdiagram.io](https://dbdiagram.io/d) y exportar PNG
- **Script:** ejecutar `database/schema.sql` en cualquier instancia PostgreSQL

## 🌐 Despliegue

El sitio es 100% estático (HTML/CSS/JS), por lo que se despliega sin build en Vercel
o GitHub Pages.

## ✅ Alcance del Parcial 2

- [x] Todas las interfaces en HTML + CSS
- [x] Navegabilidad completa entre pantallas
- [x] Diseño de base de datos relacional (diagrama + SQL)
- [x] Hosting navegable
- [x] Repositorio con el código fuente

## 🔭 Pendiente para el corte final

- API RESTful (backend Node.js) consumiendo la base de datos
- Autenticación y seguridad (JWT, bcrypt)
- Videoconferencia Jitsi real e integración de IA generativa
- Notificaciones reales por correo/WhatsApp
- Aplicación móvil
