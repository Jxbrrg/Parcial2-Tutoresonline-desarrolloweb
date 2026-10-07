/* =========================================================
   TutoresOn-Line · app.js
   Comportamiento de la interfaz: navegación, filtros,
   reservas, valoraciones y paneles del tutor.
   En producción estas funciones consumirían la API REST.
   ========================================================= */

/* ---------- Utilidades compartidas ---------- */

function estrellasHTML(calificacion) {
  const llenas = Math.round(calificacion);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= llenas ? '★' : '<span class="empty">★</span>';
  }
  return `<span class="stars">${html}</span>`;
}

function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CO');
}

function avatarHTML(iniciales, clase = '') {
  return `<div class="avatar ${clase}">${iniciales}</div>`;
}

/* ---------- Menú móvil ---------- */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  const page = document.body.dataset.page;
  const handlers = {
    busqueda: initBusqueda,
    perfil: initPerfil,
    reservar: initReservar,
    'mis-sesiones': initMisSesiones,
    valorar: initValorar,
    solicitudes: initSolicitudes,
    disponibilidad: initDisponibilidad,
    registro: initRegistro,
    video: initVideo,
  };
  if (handlers[page]) handlers[page]();
});

/* ---------- Búsqueda de tutores ---------- */

function initBusqueda() {
  const cont = document.getElementById('resultados');
  const contador = document.getElementById('contador');
  const orden = document.getElementById('orden');
  const form = document.getElementById('form-filtros');
  const vacio = document.getElementById('vacio');

  function filtrar() {
    const materias = [...form.querySelectorAll('input[name="materia"]:checked')].map((c) => c.value);
    const niveles = [...form.querySelectorAll('input[name="nivel"]:checked')].map((c) => c.value);
    const soloVirtual = form.querySelector('#solo-virtual').checked;
    const soloVerificados = form.querySelector('#solo-verificados').checked;
    const precioMax = Number(form.querySelector('#precio-max').value);

    let lista = TUTORES.filter((t) => {
      if (materias.length && !materias.some((m) => t.materias.includes(m))) return false;
      if (niveles.length && !niveles.some((n) => t.niveles.includes(n))) return false;
      if (soloVirtual && !t.modos.includes('Virtual')) return false;
      if (soloVerificados && !t.verificado) return false;
      if (t.precio > precioMax) return false;
      return true;
    });

    const criterio = orden.value;
    if (criterio === 'precio-asc') lista.sort((a, b) => a.precio - b.precio);
    if (criterio === 'precio-desc') lista.sort((a, b) => b.precio - a.precio);
    if (criterio === 'rating') lista.sort((a, b) => b.calificacion - a.calificacion);

    render(lista);
  }

  function render(lista) {
    contador.textContent = `${lista.length} tutor${lista.length === 1 ? '' : 'es'} encontrado${lista.length === 1 ? '' : 's'}`;
    vacio.classList.toggle('d-none', lista.length > 0);
    cont.innerHTML = lista
      .map(
        (t) => `
      <article class="card card-hover tutor-card">
        <div class="top">
          ${avatarHTML(t.iniciales)}
          <div>
            <div class="flex-between gap-1">
              <h3 class="card-title" style="margin:0">${t.nombre}</h3>
              ${t.verificado ? '<span class="badge badge-primary">✓ Verificado</span>' : ''}
            </div>
            <p class="text-sm">${t.titulo}</p>
            <div class="rating-summary mt-1">
              ${estrellasHTML(t.calificacion)}
              <strong>${t.calificacion.toFixed(1)}</strong>
              <span>(${t.resenas} reseñas)</span>
            </div>
          </div>
        </div>
        <div class="badges">
          ${t.materias.map((m) => `<span class="badge badge-primary">${m}</span>`).join('')}
          ${t.modos.map((m) => `<span class="badge">${m}</span>`).join('')}
          <span class="badge">${t.zona}</span>
        </div>
        <div class="meta">
          <div class="price">${formatearPrecio(t.precio)} <small>/ hora</small></div>
          <div class="d-flex gap-1">
            <a class="btn btn-outline btn-sm" href="perfil-tutor.html?id=${t.id}">Ver perfil</a>
            <a class="btn btn-primary btn-sm" href="reservar.html?id=${t.id}">Reservar</a>
          </div>
        </div>
      </article>`
      )
      .join('');
  }

  form.addEventListener('change', filtrar);
  orden.addEventListener('change', filtrar);
  document.getElementById('precio-max').addEventListener('input', (e) => {
    document.getElementById('precio-valor').textContent = formatearPrecio(Number(e.target.value));
    filtrar();
  });
  document.getElementById('limpiar').addEventListener('click', () => {
    form.reset();
    document.getElementById('precio-valor').textContent = formatearPrecio(40000);
    filtrar();
  });

  filtrar();
}

/* ---------- Perfil del tutor ---------- */

function initPerfil() {
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const t = TUTORES.find((x) => x.id === id) || TUTORES[0];

  document.getElementById('avatar-tutor').textContent = t.iniciales;
  document.getElementById('nombre-tutor').textContent = t.nombre;
  document.getElementById('titulo-tutor').textContent = t.titulo;
  document.getElementById('bio-tutor').textContent = t.bio;
  document.getElementById('zona-tutor').textContent = t.zona;
  document.getElementById('precio-tutor').textContent = formatearPrecio(t.precio);
  document.getElementById('rating-tutor').innerHTML =
    `${estrellasHTML(t.calificacion)} <strong>${t.calificacion.toFixed(1)}</strong> <span>(${t.resenas} reseñas)</span>`;
  document.getElementById('materias-tutor').innerHTML = t.materias
    .map((m) => `<span class="badge badge-primary">${m}</span>`)
    .join('');
  document.getElementById('niveles-tutor').innerHTML = t.niveles
    .map((n) => `<span class="badge">${n}</span>`)
    .join('');
  document.getElementById('modos-tutor').innerHTML = t.modos
    .map((m) => `<span class="badge badge-info">${m}</span>`)
    .join('');
  document.getElementById('btn-reservar').href = `reservar.html?id=${t.id}`;

  const cont = document.getElementById('resenas-list');
  cont.innerHTML = RESENAS_TUTOR.map(
    (r) => `
    <div class="review">
      ${avatarHTML(r.iniciales, 'avatar-sm')}
      <div class="body">
        <div class="head">
          <strong>${r.autor}</strong>
          <small class="text-muted">${r.fecha}</small>
        </div>
        ${estrellasHTML(r.estrellas)}
        <p class="mt-1">${r.texto}</p>
      </div>
    </div>`
  ).join('');

  renderHorarios();
}

function renderHorarios() {
  Object.entries(AVABILITIES).forEach(([dia, horas]) => {
    const col = document.querySelector(`[data-dia="${dia}"] .slots`);
    if (!col) return;
    col.innerHTML = horas.length
      ? horas.map((h) => `<button type="button" class="slot">${h}</button>`).join('')
      : '<span class="text-xs text-muted">Sin horarios</span>';
  });
}

/* ---------- Reserva de sesión ---------- */

function initReservar() {
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const t = TUTORES.find((x) => x.id === id) || TUTORES[0];

  document.getElementById('r-nombre').textContent = t.nombre;
  document.getElementById('r-iniciales').textContent = t.iniciales;
  document.getElementById('r-precio').textContent = formatearPrecio(t.precio);

  Object.entries(AVABILITIES).forEach(([dia, horas]) => {
    const col = document.querySelector(`[data-dia="${dia}"] .slots`);
    if (!col) return;
    col.innerHTML = horas.length
      ? horas
          .map(
            (h, i) =>
              `<button type="button" class="slot${i === horas.length - 1 && dia === 'Sábado' ? ' taken' : ''}" ${
                i === horas.length - 1 && dia === 'Sábado' ? 'disabled' : ''
              } data-hora="${h}" data-dia="${dia}">${h}</button>`
          )
          .join('')
      : '<span class="text-xs text-muted">—</span>';
  });

  document.querySelectorAll('.slot:not(.taken)').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.slot.selected').forEach((s) => s.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('s-fecha').textContent = `${btn.dataset.dia} · ${btn.dataset.hora}`;
      actualizarTotal();
    });
  });

  document.querySelectorAll('input[name="modo"]').forEach((r) =>
    r.addEventListener('change', () => {
      document.getElementById('campo-direccion').classList.toggle('d-none', r.value !== 'Presencial' || !r.checked);
      actualizarTotal();
    })
  );

  document.getElementById('dur').addEventListener('change', actualizarTotal);

  function actualizarTotal() {
    const dur = Number(document.getElementById('dur').value);
    const tarifa = (t.precio * dur) / 60;
    document.getElementById('s-duracion').textContent = `${dur} minutos`;
    document.getElementById('s-total').textContent = formatearPrecio(Math.round(tarifa));
  }

  actualizarTotal();
}

/* ---------- Mis sesiones (estudiante) ---------- */

function initMisSesiones() {
  const tabs = document.querySelectorAll('[data-tab]');
  const cont = document.getElementById('sesiones-list');

  function render(filtro) {
    const lista = SESIONES_ESTUDIANTE.filter((s) =>
      filtro === 'proximas' ? s.proxima : !s.proxima
    );
    cont.innerHTML = lista
      .map((s) => {
        const badge =
          s.estado === 'Confirmada'
            ? 'badge-success'
            : s.estado === 'Completada'
            ? 'badge-info'
            : 'badge-warning';
        return `
      <div class="card mb-2">
        <div class="flex-between gap-2 flex-wrap">
          <div class="d-flex gap-2" style="align-items:center">
            ${avatarHTML(s.iniciales)}
            <div>
              <h4>${s.tutor}</h4>
              <p class="text-sm">${s.materia}</p>
              <p class="text-xs text-muted">📅 ${s.fecha} · ⏱ ${s.duracion} · 📍 ${s.modo}</p>
            </div>
          </div>
          <div class="text-center">
            <span class="badge ${badge}">${s.estado}</span>
            <div class="d-flex gap-1 mt-2">
              ${
                s.proxima && s.estado === 'Confirmada'
                  ? '<a class="btn btn-primary btn-sm" href="../comun/videoconferencia.html">Unirse</a>'
                  : ''
              }
              ${!s.proxima && !s.calificada ? `<a class="btn btn-outline btn-sm" href="valorar.html?id=${s.id}">Valorar</a>` : ''}
              ${s.proxima ? '<button class="btn btn-danger btn-sm">Cancelar</button>' : ''}
            </div>
          </div>
        </div>
      </div>`;
      })
      .join('');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.tab);
    });
  });

  render('proximas');
}

/* ---------- Valoración con estrellas ---------- */

function initValorar() {
  const cont = document.getElementById('stars-input');
  const etiqueta = document.getElementById('estrella-label');
  const etiquetas = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
  let valor = 0;

  cont.querySelectorAll('span').forEach((s, i) => {
    s.addEventListener('mouseenter', pintar(i + 1, false));
    s.addEventListener('click', () => {
      valor = i + 1;
      pintar(valor, true)();
      etiqueta.textContent = etiquetas[valor - 1];
    });
  });

  cont.addEventListener('mouseleave', () => pintar(valor, true)());

  function pintar(n, fijo) {
    return () => {
      cont.querySelectorAll('span').forEach((s, i) => {
        s.classList.toggle('on', i < n);
      });
      if (!fijo) etiqueta.textContent = etiquetas[n - 1];
    };
  }

  document.getElementById('form-valoracion').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!valor) {
      document.getElementById('alerta-valor').classList.remove('d-none');
      return;
    }
    document.getElementById('form-valoracion').classList.add('d-none');
    document.getElementById('valor-exito').classList.remove('d-none');
  });
}

/* ---------- Solicitudes del tutor ---------- */

function initSolicitudes() {
  const cont = document.getElementById('solicitudes-list');

  function render() {
    cont.innerHTML = SOLICITUDES_TUTOR.map((s) => {
      const badge =
        s.estado === 'Pendiente'
          ? 'badge-warning'
          : s.estado === 'Aceptada'
          ? 'badge-success'
          : 'badge-danger';
      return `
      <div class="card mb-2" data-id="${s.id}">
        <div class="flex-between gap-2 flex-wrap">
          <div class="d-flex gap-2" style="align-items:center">
            ${avatarHTML(s.iniciales)}
            <div>
              <h4>${s.estudiante}</h4>
              <p class="text-sm">${s.materia}</p>
              <p class="text-xs text-muted">📅 ${s.fecha} · 📍 ${s.modo}</p>
            </div>
          </div>
          <div class="text-center">
            <span class="badge ${badge} estado">${s.estado}</span>
            ${
              s.estado === 'Pendiente'
                ? `<div class="d-flex gap-1 mt-2">
                    <button class="btn btn-success btn-sm" data-accion="aceptar">Aceptar</button>
                    <button class="btn btn-danger btn-sm" data-accion="rechazar">Rechazar</button>
                  </div>`
                : ''
            }
          </div>
        </div>
      </div>`;
    }).join('');

    cont.querySelectorAll('button[data-accion]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        const id = Number(card.dataset.id);
        const sol = SOLICITUDES_TUTOR.find((s) => s.id === id);
        sol.estado = btn.dataset.accion === 'aceptar' ? 'Aceptada' : 'Rechazada';
        actualizarContador();
        render();
      });
    });
  }

  function actualizarContador() {
    const pend = SOLICITUDES_TUTOR.filter((s) => s.estado === 'Pendiente').length;
    document.getElementById('pendientes').textContent = pend;
  }

  actualizarContador();
  render();
}

/* ---------- Disponibilidad semanal del tutor ---------- */

function initDisponibilidad() {
  document.querySelectorAll('.day-col .slot').forEach((slot) => {
    slot.addEventListener('click', () => {
      slot.classList.toggle('selected');
      if (!slot.classList.contains('selected')) slot.classList.add('taken');
      else slot.classList.remove('taken');
      contarDisponibilidad();
    });
  });

  function contarDisponibilidad() {
    const total = document.querySelectorAll('.day-col .slot.selected, .day-col .slot:not(.taken):not(.selected)').length;
    const libres = document.querySelectorAll('.day-col .slot:not(.taken)').length;
    document.getElementById('horas-libres').textContent = libres;
    document.getElementById('horas-totales').textContent = total;
  }

  contarDisponibilidad();

  document.getElementById('form-slot').addEventListener('submit', (e) => {
    e.preventDefault();
    const dia = document.getElementById('nuevo-dia').value;
    const hora = document.getElementById('nueva-hora').value;
    const col = document.querySelector(`[data-dia="${dia}"] .slots`);
    if (col && hora) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot selected';
      btn.textContent = hora;
      col.appendChild(btn);
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        btn.classList.toggle('taken');
      });
      contarDisponibilidad();
      e.target.reset();
    }
  });
}

/* ---------- Registro con pestañas ---------- */

function initRegistro() {
  const tabs = document.querySelectorAll('.auth-tabs button');
  const camposTutor = document.getElementById('campos-tutor');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      camposTutor.classList.toggle('d-none', tab.dataset.rol !== 'tutor');
    });
  });
}

/* ---------- Videoconferencia ---------- */

function initVideo() {
  document.querySelectorAll('.vc-btn[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('on');
      if (btn.dataset.toggle === 'mic') btn.textContent = btn.classList.contains('on') ? '🎤' : '🔇';
      if (btn.dataset.toggle === 'cam') btn.textContent = btn.classList.contains('on') ? '🎥' : '📵';
    });
  });

  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const mensajes = document.getElementById('chat-messages');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input.value.trim()) return;
      const div = document.createElement('div');
      div.className = 'chat-msg mine';
      div.innerHTML = `<small>Tú · ahora</small>${input.value}`;
      mensajes.appendChild(div);
      input.value = '';
      mensajes.scrollTop = mensajes.scrollHeight;
    });
  }
}
