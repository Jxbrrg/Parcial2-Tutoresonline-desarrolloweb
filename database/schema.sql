-- =============================================================
-- TutoresOn-Line · Diseño de Base de Datos Relacional (PostgreSQL)
-- Proyecto Final · Parcial 2 · Desarrollo Web
-- Autores: Emel Sierra, Jhossuar Barragán, Kevin Arrieta
-- =============================================================

DROP TABLE IF EXISTS notificaciones, valoraciones, sesiones, solicitudes,
                     disponibilidad, tutores_zonas, tutores_materias,
                     tutores, zonas, niveles_educativos, materias, usuarios
CASCADE;

-- ---------------------------------------------------------
-- 1. USUARIOS: estudiante o tutor (cuenta de acceso)
-- ---------------------------------------------------------
CREATE TABLE usuarios (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(120)  NOT NULL,
    email         VARCHAR(160)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    telefono      VARCHAR(20),
    rol           VARCHAR(15)   NOT NULL DEFAULT 'estudiante'
                  CHECK (rol IN ('estudiante','tutor','admin')),
    activo        BOOLEAN       NOT NULL DEFAULT TRUE,
    creado_en     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 2. CATÁLOGOS
-- ---------------------------------------------------------
CREATE TABLE materias (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE niveles_educativos (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE zonas (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    ciudad VARCHAR(80) NOT NULL
);

-- ---------------------------------------------------------
-- 3. TUTORES: perfil público extendido del usuario tutor
-- ---------------------------------------------------------
CREATE TABLE tutores (
    id                  SERIAL PRIMARY KEY,
    usuario_id          INT NOT NULL UNIQUE
                        REFERENCES usuarios(id) ON DELETE CASCADE,
    biografia           TEXT,
    tarifa_hora         NUMERIC(10,2) NOT NULL CHECK (tarifa_hora >= 0),
    verificado          BOOLEAN       NOT NULL DEFAULT FALSE,
    calificacion_prom   DECIMAL(3,2)  NOT NULL DEFAULT 0.00
                        CHECK (calificacion_prom BETWEEN 0 AND 5),
    foto_url            VARCHAR(255),
    creado_en           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Relación N:M tutor <-> materia (con su nivel de atención)
CREATE TABLE tutores_materias (
    tutor_id   INT NOT NULL REFERENCES tutores(id) ON DELETE CASCADE,
    materia_id INT NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    nivel_id   INT NOT NULL REFERENCES niveles_educativos(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, materia_id, nivel_id)
);

-- Zonas donde el tutor ofrece sesiones PRESENCIALES
CREATE TABLE tutores_zonas (
    tutor_id INT NOT NULL REFERENCES tutores(id) ON DELETE CASCADE,
    zona_id  INT NOT NULL REFERENCES zonas(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, zona_id)
);

-- ---------------------------------------------------------
-- 4. DISPONIBILIDAD: horarios publicados por el tutor
-- ---------------------------------------------------------
CREATE TABLE disponibilidad (
    id          SERIAL PRIMARY KEY,
    tutor_id    INT NOT NULL REFERENCES tutores(id) ON DELETE CASCADE,
    dia_semana  SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=Dom .. 6=Sáb
    hora_inicio TIME NOT NULL,
    hora_fin    TIME NOT NULL,
    modo        VARCHAR(12) NOT NULL DEFAULT 'virtual'
                CHECK (modo IN ('virtual','presencial','ambos')),
    activo      BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (hora_fin > hora_inicio)
);

-- ---------------------------------------------------------
-- 5. SOLICITUDES: reserva de sesión hecha por el estudiante
-- ---------------------------------------------------------
CREATE TABLE solicitudes (
    id            SERIAL PRIMARY KEY,
    estudiante_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tutor_id      INT NOT NULL REFERENCES tutores(id) ON DELETE CASCADE,
    materia_id    INT NOT NULL REFERENCES materias(id),
    fecha_sesion  DATE        NOT NULL,
    hora_sesion   TIME        NOT NULL,
    duracion_min  SMALLINT    NOT NULL DEFAULT 60 CHECK (duracion_min > 0),
    modo          VARCHAR(12) NOT NULL CHECK (modo IN ('virtual','presencial')),
    direccion     VARCHAR(200),            -- sólo si es presencial
    notas         TEXT,
    estado        VARCHAR(15)  NOT NULL DEFAULT 'pendiente'
                  CHECK (estado IN ('pendiente','aceptada','rechazada',
                                    'completada','cancelada')),
    enlace_video  VARCHAR(255),            -- Jitsi Meet / videoconferencia
    total         NUMERIC(10,2) NOT NULL,
    creado_en     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 6. SESIONES: ejecución de una solicitud aprobada
-- ---------------------------------------------------------
CREATE TABLE sesiones (
    id            SERIAL PRIMARY KEY,
    solicitud_id  INT NOT NULL UNIQUE REFERENCES solicitudes(id) ON DELETE CASCADE,
    iniciada_en   TIMESTAMPTZ,
    finalizada_en TIMESTAMPTZ,
    resumen_ia    TEXT          -- generado por la IA generativa
);

-- ---------------------------------------------------------
-- 7. VALORACIONES: reputación del tutor (estrellas 1-5)
-- ---------------------------------------------------------
CREATE TABLE valoraciones (
    id           SERIAL PRIMARY KEY,
    sesion_id    INT NOT NULL UNIQUE REFERENCES sesiones(id) ON DELETE CASCADE,
    estudiante_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tutor_id     INT NOT NULL REFERENCES tutores(id) ON DELETE CASCADE,
    estrellas    SMALLINT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    comentario   TEXT,
    fecha        DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ---------------------------------------------------------
-- 8. NOTIFICACIONES: correo / WhatsApp con registro de tutoría
-- ---------------------------------------------------------
CREATE TABLE notificaciones (
    id           SERIAL PRIMARY KEY,
    usuario_id   INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    solicitud_id INT REFERENCES solicitudes(id) ON DELETE SET NULL,
    tipo         VARCHAR(25) NOT NULL
                 CHECK (tipo IN ('confirmacion','recordatorio','respuesta',
                                 'valoracion','cancelacion')),
    canal        VARCHAR(10) NOT NULL CHECK (canal IN ('email','whatsapp')),
    asunto       VARCHAR(150) NOT NULL,
    mensaje      TEXT NOT NULL,
    estado       VARCHAR(10) NOT NULL DEFAULT 'pendiente'
                 CHECK (estado IN ('pendiente','enviado','fallido')),
    enviado_en   TIMESTAMPTZ
);

-- =============================================================
-- ÍNDICES para consultas frecuentes (búsqueda y agenda)
-- =============================================================
CREATE INDEX idx_solicitudes_tutor   ON solicitudes (tutor_id, estado);
CREATE INDEX idx_solicitudes_fecha   ON solicitudes (fecha_sesion, hora_sesion);
CREATE INDEX idx_solicitudes_estud   ON solicitudes (estudiante_id);
CREATE INDEX idx_disponibilidad_tut  ON disponibilidad (tutor_id, dia_semana);
CREATE INDEX idx_valoraciones_tutor  ON valoraciones (tutor_id);
CREATE INDEX idx_usuarios_email      ON usuarios (email);
CREATE INDEX idx_tutores_calif       ON tutores (calificacion_prom DESC);

-- =============================================================
-- DATOS DE EJEMPLO
-- =============================================================
INSERT INTO usuarios (nombre, email, password_hash, telefono, rol) VALUES
 ('Laura Gómez',      'laura.gomez@tutoresonline.com',  '$2b$12$hash1', '+57 300 111 2233', 'tutor'),
 ('Andrés Ramírez',   'andres.ramirez@tutoresonline.com','$2b$12$hash2', '+57 310 444 5566', 'tutor'),
 ('Carlos Estudiante','carlos@estudiante.com',          '$2b$12$hash3', '+57 320 777 8899', 'estudiante');

INSERT INTO materias (nombre) VALUES
 ('Matemáticas'),('Física'),('Química'),('Biología'),
 ('Inglés'),('Programación'),('Bases de Datos'),('Economía');

INSERT INTO niveles_educativos (nombre) VALUES
 ('Básico Primaria'),('Básico Secundaria'),
 ('Bachillerato'),('Universitario'),('Técnico');

INSERT INTO zonas (nombre, ciudad) VALUES
 ('Chapinero','Bogotá'),('Usaquén','Bogotá'),('Kennedy','Bogotá'),
 ('Suba','Bogotá'),('Teusaquillo','Bogotá');

INSERT INTO tutores (usuario_id, biografia, tarifa_hora, verificado, calificacion_prom) VALUES
 (1, 'Docente universitaria especializada en cálculo y física.', 28000.00, TRUE, 4.90),
 (2, 'Desarrollador backend con 8 años de experiencia.',        35000.00, TRUE, 4.80);

INSERT INTO tutores_materias (tutor_id, materia_id, nivel_id) VALUES
 (1, 1, 3), (1, 1, 4), (1, 2, 3),   -- Laura: Matemáticas (Bach/Univ), Física (Bach)
 (2, 6, 4), (2, 7, 4);               -- Andrés: Programación y Bases de Datos (Univ)

INSERT INTO tutores_zonas (tutor_id, zona_id) VALUES (1, 1), (1, 4);

INSERT INTO disponibilidad (tutor_id, dia_semana, hora_inicio, hora_fin, modo) VALUES
 (1, 1, '08:00', '12:00', 'ambos'),      -- Lunes
 (1, 3, '16:00', '20:00', 'virtual'),    -- Miércoles
 (1, 6, '09:00', '12:00', 'virtual');    -- Sábado

INSERT INTO solicitudes (estudiante_id, tutor_id, materia_id, fecha_sesion,
                         hora_sesion, duracion_min, modo, estado, enlace_video, total) VALUES
 (3, 1, 1, '2026-10-15', '16:00', 60, 'virtual', 'aceptada',
  'https://meet.jitsi.org/tutoresonline-to-0148', 28000.00);

INSERT INTO sesiones (solicitud_id, resumen_ia) VALUES
 (1, 'Repaso de integración por partes: el estudiante dominó el método tras 3 ejemplos guiados.');

INSERT INTO valoraciones (sesion_id, estudiante_id, tutor_id, estrellas, comentario) VALUES
 (1, 3, 1, 5, 'Excelente tutoría, explica muy claro.');

INSERT INTO notificaciones (usuario_id, solicitud_id, tipo, canal, asunto, mensaje, estado, enviado_en) VALUES
 (3, 1, 'confirmacion', 'email',
  'Reserva confirmada - Tutoría Matemáticas',
  'Tu sesión con Laura Gómez está confirmada para el 15/10/2026 a las 16:00.',
  'enviado', NOW()),
 (3, 1, 'confirmacion', 'whatsapp',
  'Confirmación TutoresOn-Line #TO-2026-0148',
  'Sesión confirmada: Jue 15 oct 4:00 p.m., 60 min, virtual.',
  'enviado', NOW());
