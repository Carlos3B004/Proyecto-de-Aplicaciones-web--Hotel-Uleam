document.addEventListener("DOMContentLoaded", function () {
  // Registro
  const registroForm = document.getElementById("formRegistro");
  if (registroForm) {
    registroForm.addEventListener("submit", function (e) {
      e.preventDefault();

     const nuevoUsuario = {
  nombre: document.getElementById("nombre").value,
  correo: document.getElementById("correo").value,
  telefono: document.getElementById("telefono").value,
  documento: document.getElementById("documento").value,
  contrasena: document.getElementById("contrasena").value,
  aprobado: false,
  tipo: "cliente" 
};

      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      usuarios.push(nuevoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      document.getElementById("mensaje").textContent = "Registro exitoso. Esperando aprobación del administrador.";
      registroForm.reset();
    });
  }

  // Inicio de sesión
  const loginForm = document.getElementById("formLogin");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const correo = document.getElementById("correoLogin").value;
    const contrasena = document.getElementById("contrasenaLogin").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

    if (usuario) {
      if (usuario.aprobado) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

        if (usuario.tipo === "admin") {
          window.location.href = "panel_admin.html";
        } else {
          window.location.href = "panel.html";
        }

      } else {
        document.getElementById("mensajeLogin").textContent = "Tu cuenta aún no ha sido aprobada por el administrador.";
      }
    } else {
      document.getElementById("mensajeLogin").textContent = "Correo o contraseña incorrectos.";
    }
  });
 }
});
  // Aprobaciones del administrador
  const tablaUsuarios = document.getElementById("tablaUsuarios");
  if (tablaUsuarios) {
    const tbody = tablaUsuarios.querySelector("tbody");
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Mostrar usuarios
    usuarios.forEach((usuario, index) => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${usuario.nombre}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.documento}</td>
        <td>${usuario.aprobado ? "Aprobado" : "Pendiente"}</td>
        <td>
          <button onclick="aprobarUsuario(${index})">Aprobar</button>
          <button onclick="rechazarUsuario(${index})">Rechazar</button>
        </td>
      `;

      tbody.appendChild(fila);
    });

    // Funciones para aprobar o rechazar
    window.aprobarUsuario = function (i) {
      usuarios[i].aprobado = true;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      location.reload();
    };

    window.rechazarUsuario = function (i) {
      usuarios.splice(i, 1); // Elimina al usuario
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      location.reload();
    };
  }

  // Gestión de reservas
const formReserva = document.getElementById("formReserva");
if (formReserva) {
  formReserva.addEventListener("submit", function (e) {
    e.preventDefault();

    const reserva = {
      nombre: document.getElementById("nombreReserva").value,
      correo: document.getElementById("correoReserva").value,
      telefono: document.getElementById("telefonoReserva").value,
      documento: document.getElementById("documentoReserva").value,
      fechaEntrada: document.getElementById("fechaEntrada").value,
      fechaSalida: document.getElementById("fechaSalida").value,
      tipoHabitacion: document.getElementById("tipoHabitacion").value,
      personas: document.getElementById("personas").value
    };

    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    document.getElementById("mensajeReserva").textContent = "¡Reserva guardada exitosamente!";
    formReserva.reset();
  });
}

// Gestión de habitaciones
const formHab = document.getElementById("formHabitacion");
const tablaHab = document.getElementById("tablaHabitaciones");

if (formHab && tablaHab) {
  let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

  /** Rellena la tabla con los datos almacenados */
  function mostrarHabitaciones() {
    const tbody = tablaHab.querySelector("tbody");
    tbody.innerHTML = "";                       // limpia la tabla
    habitaciones.forEach((h, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${h.numero}</td>
        <td>${h.tipo}</td>
        <td>${h.estado}</td>
        <td>$${h.precio}</td>
        <td>
          <button onclick="editarHabitacion(${index})">Editar</button>
          <button onclick="eliminarHabitacion(${index})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  }

  /** Guarda o actualiza una habitación */
  formHab.addEventListener("submit", function (e) {
    e.preventDefault();

    const nuevaHab = {
      numero: document.getElementById("numeroHab").value,
      tipo: document.getElementById("tipoHab").value,
      estado: document.getElementById("estadoHab").value,
      precio: document.getElementById("precioHab").value
    };

    const indice = parseInt(document.getElementById("indiceEdit").value, 10);

    if (indice >= 0) {
      // Estamos editando
      habitaciones[indice] = nuevaHab;
      document.getElementById("mensajeHab").textContent = "Habitación actualizada.";
    } else {
      // Agregando nueva
      habitaciones.push(nuevaHab);
      document.getElementById("mensajeHab").textContent = "Habitación agregada.";
    }

    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
    formHab.reset();
    document.getElementById("indiceEdit").value = -1;
    document.getElementById("tituloForm").textContent = "Agregar nueva habitación";
    document.getElementById("btnGuardar").textContent = "Guardar";
    mostrarHabitaciones();
  });

  /** Edita la fila seleccionada */
  window.editarHabitacion = function (i) {
    const h = habitaciones[i];
    document.getElementById("numeroHab").value = h.numero;
    document.getElementById("tipoHab").value = h.tipo;
    document.getElementById("estadoHab").value = h.estado;
    document.getElementById("precioHab").value = h.precio;
    document.getElementById("indiceEdit").value = i;
    document.getElementById("tituloForm").textContent = "Editar habitación";
    document.getElementById("btnGuardar").textContent = "Actualizar";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Elimina la fila seleccionada */
  window.eliminarHabitacion = function (i) {
    if (confirm("¿Eliminar la habitación seleccionada?")) {
      habitaciones.splice(i, 1);
      localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
      mostrarHabitaciones();
    }
  };

  // Inicializa la tabla al cargar
  mostrarHabitaciones();
}

// Facturación
const formFactura = document.getElementById("formFactura");
if (formFactura) {
  formFactura.addEventListener("submit", function (e) {
    e.preventDefault();

    const doc = document.getElementById("docBuscar").value;
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

    const reserva = reservas.find(r => r.documento === doc);
    if (!reserva) {
      document.getElementById("mensajeFactura").textContent = "No se encontró ninguna reserva con ese documento.";
      document.getElementById("datosFactura").style.display = "none";
      return;
    }

    // Buscar precio según tipo
    const habitacion = habitaciones.find(h => h.tipo === reserva.tipoHabitacion);
    const precioNoche = habitacion ? parseFloat(habitacion.precio) : 50;

    const fechaInicio = new Date(reserva.fechaEntrada);
    const fechaFin = new Date(reserva.fechaSalida);
    const msPorDia = 1000 * 60 * 60 * 24;
    const dias = Math.ceil((fechaFin - fechaInicio) / msPorDia);
    const subtotal = dias * precioNoche;
    const impuestos = subtotal * 0.12;
    const total = subtotal + impuestos;

    // Mostrar datos
    document.getElementById("nombreFactura").textContent = reserva.nombre;
    document.getElementById("correoFactura").textContent = reserva.correo;
    document.getElementById("fechasFactura").textContent = `${reserva.fechaEntrada} al ${reserva.fechaSalida}`;
    document.getElementById("tipoFactura").textContent = reserva.tipoHabitacion;
    document.getElementById("precioNoche").textContent = precioNoche.toFixed(2);
    document.getElementById("diasEstadia").textContent = dias;
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("impuestos").textContent = impuestos.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);

    document.getElementById("datosFactura").style.display = "block";

    // Guardar datos para factura
    window.facturaGenerada = {
      documento: reserva.documento,
      nombre: reserva.nombre,
      correo: reserva.correo,
      total,
      fecha: new Date().toLocaleDateString(),
    };
  });
}

// Función para generar factura
function generarFactura() {
  let facturas = JSON.parse(localStorage.getItem("facturas")) || [];
  facturas.push(window.facturaGenerada);
  localStorage.setItem("facturas", JSON.stringify(facturas));
  document.getElementById("mensajeFactura").textContent = "Factura generada y guardada exitosamente.";
  document.getElementById("datosFactura").style.display = "none";
}

