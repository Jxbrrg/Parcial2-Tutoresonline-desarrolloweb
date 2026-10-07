# TutoresOn-Line

Plataforma de tutorías en línea y presencial. Conecta estudiantes con tutores
calificados: los estudiantes buscan tutores por materia, nivel educativo, zona
y disponibilidad, y reservan sesiones que se ejecutan por videoconferencia o
de forma presencial.

Proyecto final - Desarrollo Web
Parcial 2 - Semestre 2026-2

## Integrantes

- Emel Sierra
- Jhossuar Barragán
- Kevin Arrieta

Docente: Edgar Morillo
Metodología: SCRUM

## Requerimientos

- Navegador web (Chrome, Firefox, Edge)
- No necesita instalar nada, es una aplicación estática

## Cómo ejecutarlo

Abrir el archivo `index.html` directamente en el navegador, o levantar un
servidor local:

```
python -m http.server 8080
```

Luego entrar a http://localhost:8080

## Estructura

```
index.html          Inicio
login.html          Inicio de sesión
registro.html       Registro de estudiantes y tutores
estudiante/         Búsqueda, perfil del tutor, reserva, mis sesiones, valoración
tutor/              Dashboard, solicitudes, disponibilidad
comun/              Videoconferencia y confirmación de reserva
css/                base.css, layout.css, components.css
js/                 datos.js (datos de prueba), app.js (interacciones)
database/           schema.sql (PostgreSQL) y diagrama.dbml
docs/               Contenido del informe del parcial
```

## Base de datos

Motor: PostgreSQL (relacional)

- `database/schema.sql` - script con las 12 tablas, índices y datos de ejemplo
- `database/diagrama.dbml` - se pega en https://dbdiagram.io/d para ver y
  descargar el diagrama en PNG
