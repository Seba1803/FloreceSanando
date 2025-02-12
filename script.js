document.getElementById('nuevoPaciente').addEventListener('click', mostrarFormulario);
document.getElementById('pacientes').addEventListener('click', mostrarLista);
document.getElementById('reportes').addEventListener('click', function(event) {
    event.preventDefault();
    mostrarListaReportes();
});
document.getElementById('pagos').addEventListener('click', mostrarListaPagos);
window.scrollTo({
    top: 0,
    behavior: 'smooth'
});

document.getElementById('logo').addEventListener('click', function(event) {
    event.preventDefault();
    mostrarMenuPrincipal();
});

function mostrarFormulario() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const formHTML = `
        <form id="pacienteForm" action="" method="" enctype="multipart/form-data" onsubmit="event.preventDefault(); validarFormulario(event)">
            <div class="mb-3">
                <label for="nombreCompleto" class="form-label">Nombre Completo</label>
                <input type="text" class="form-control" id="nombreCompleto" name="nombreCompleto" required>
                <div class="invalid-feedback">Por favor, ingrese el nombre completo.</div>
            </div>
            <div class="mb-3">
                <label for="rut" class="form-label">RUT</label>
                <input type="text" class="form-control" id="rut" name="rut" required pattern="[0-9]{9}">
                <div class="invalid-feedback">El RUT debe contener 9 dígitos sin el dígito verificador.</div>
            </div>
            <div class="mb-3">
                <label for="genero" class="form-label">Género</label>
                <select class="form-select" id="genero" name="genero" required>
                    <option value="">Seleccione Género:</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Prefiero no mencionar">Prefiero no mencionar</option>
                </select>
                <div class="invalid-feedback">Por favor, seleccione un género.</div>
            </div>
            <div class="mb-3">
                <label for="edad" class="form-label">Edad</label>
                <input type="number" class="form-control" id="edad" name="edad" required>
                <div class="invalid-feedback">Por favor, ingrese la edad.</div>
            </div>
            <div class="mb-3">
                <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
                <input type="date" class="form-control" id="fechaNacimiento" name="fechaNacimiento" required>
                <div class="invalid-feedback">Por favor, ingrese la fecha de nacimiento.</div>
            </div>
            <div class="mb-3">
                <label for="diagnosticoIngreso" class="form-label">Diagnóstico de Ingreso</label>
                <textarea class="form-control" id="diagnosticoIngreso" name="diagnosticoIngreso" required></textarea>
                <div class="invalid-feedback">Por favor, ingrese el diagnóstico de ingreso.</div>
            </div>
            <div class="mb-3">
                <label for="nacionalidad" class="form-label">Nacionalidad</label>
                <select class="form-select" id="nacionalidad" name="nacionalidad" required>
                    <option value="Chileno/a">Chileno/a</option>
                    <option value="Argentino/a">Argentino/a</option>
                    <option value="Boliviano/a">Boliviano/a</option>
                    <option value="Brasileño/a">Brasileño/a</option>
                    <option value="Colombiano/a">Colombiano/a</option>
                    <option value="Ecuatoriano/a">Ecuatoriano/a</option>
                    <option value="Mexicano/a">Mexicano/a</option>
                    <option value="Peruano/a">Peruano/a</option>
                    <option value="Uruguayo/a">Uruguayo/a</option>
                    <option value="Venezolano/a">Venezolano/a</option>
                    <option value="Otro">Otro</option>
                </select>
                <div class="invalid-feedback">Por favor, seleccione una nacionalidad.</div>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-mail electrónico</label>
                <input type="email" class="form-control" id="email" name="email" required>
                <div class="invalid-feedback">Por favor, ingrese un email válido.</div>
            </div>
            <div class="mb-3">
                <label for="estadoCivil" class="form-label">Estado Civil</label>
                <select class="form-select" id="estadoCivil" name="estadoCivil" required>
                    <option value="">Seleccione Estado Civil:</option>
                    <option value="Soltero/a">Soltero/a</option>
                    <option value="Casado/a">Casado/a</option>
                    <option value="Viudo/a">Viudo/a</option>
                </select>
                <div class="invalid-feedback">Por favor, seleccione un estado civil.</div>
            </div>
            <div class="mb-3">
                <label for="observacionInicial" class="form-label">Observación Inicial</label>
                <textarea class="form-control" id="observacionInicial" name="observacionInicial" required></textarea>
                <div class="invalid-feedback">Por favor, ingrese una observación inicial.</div>
            </div>
            <button type="submit" class="btn btn-primary">Guardar Paciente</button>
        </form>
    `;
    contenidoPrincipal.innerHTML = formHTML;
}

function agregarPaciente(nombreCompleto, rut, genero, edad, fechaNacimiento, diagnosticoIngreso, nacionalidad, email, estadoCivil, observacionInicial) {
    const nuevoPaciente = {
        nombreCompleto: nombreCompleto,
        rut: rut,
        genero: genero,
        edad: edad,
        fechaNacimiento: fechaNacimiento,
        diagnosticoIngreso: diagnosticoIngreso,
        nacionalidad: nacionalidad,
        email: email,
        estadoCivil: estadoCivil,
        observacionInicial: observacionInicial
    };
    guardarPacienteEnLocalStorage(nuevoPaciente);
    notificar("success", "Paciente agregado con éxito");
}

function obtenerPacientesDeLocalStorage() {
    return JSON.parse(localStorage.getItem('pacientes')) || [];
}

function mostrarOpciones(rut) {
    const opciones = document.getElementById(`opciones-${rut}`);
    opciones.style.display = opciones.style.display === 'none' ? 'block' : 'none';
}

function categorizarPaciente(rut) {
    const prioridad = prompt("Ingrese la prioridad (Prioridad, Importante, Poco importante, Desvinculado):");
    if (prioridad) {
        let pacientes = obtenerPacientesDeLocalStorage();
        pacientes = pacientes.map(paciente => {
            if (paciente.rut === rut) {
                paciente.prioridad = prioridad;
            }
            return paciente;
        });
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        mostrarLista();
    }
}

function eliminarPaciente(rut) {
    let pacientes = obtenerPacientesDeLocalStorage();
    pacientes = pacientes.filter(paciente => paciente.rut !== rut);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    mostrarLista();
}

function agregarObservacion(rut) {
    const pacientes = obtenerPacientesDeLocalStorage();
    const paciente = pacientes.find(paciente => paciente.rut === rut);

    if (paciente) {
        const modalHTML = `
            <div class="modal fade" id="observacionModal" tabindex="-1" aria-labelledby="observacionModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="observacionModalLabel">Agregar Observación para ${paciente.nombreCompleto}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="observacionForm">
                                <div class="mb-3">
                                    <label for="rutPaciente" class="form-label">RUT</label>
                                    <input type="text" class="form-control" id="rutPaciente" name="rutPaciente" value="${paciente.rut}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="nombrePaciente" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="nombrePaciente" name="nombrePaciente" value="${paciente.nombreCompleto}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="edadPaciente" class="form-label">Edad</label>
                                    <input type="text" class="form-control" id="edadPaciente" name="edadPaciente" value="${paciente.edad}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="avancesDestacar" class="form-label">Avances</label>
                                    <input type="text" class="form-control" id="avancesDestacar" name="avancesDestacar" required>
                                </div>
                                <div class="mb-3">
                                    <label for="observacionesSesion" class="form-label">Observaciones de Sesión</label>
                                    <textarea class="form-control" id="observacionesSesion" name="observacionesSesion" rows="5" required></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="guardarObservacion('${rut}')">Guardar sesión</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('observacionModal'));
        modal.show();
    } else {
        notificar("error", "Paciente no encontrado");
    }
}

function guardarObservacion(rut) {
    const avancesDestacar = document.getElementById('avancesDestacar').value.trim();
    const observacionesSesion = document.getElementById('observacionesSesion').value.trim();

    if (avancesDestacar && observacionesSesion) {
        let pacientes = obtenerPacientesDeLocalStorage();
        pacientes = pacientes.map(paciente => {
            if (paciente.rut === rut) {
                if (!paciente.observaciones) {
                    paciente.observaciones = [];
                }
                paciente.observaciones.push({
                    fecha: new Date().toISOString().split('T')[0],
                    avances: avancesDestacar,
                    observaciones: observacionesSesion
                });
            }
            return paciente;
        });
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        const modal = bootstrap.Modal.getInstance(document.getElementById('observacionModal'));
        modal.hide();
        document.getElementById('observacionModal').remove();
        notificar("success", "Sesión guardada con éxito");
        mostrarListaReportes();
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

function guardarPacientesEnLocalStorage(pacientes) {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function limpiarObservacion() {
    document.getElementById('observacionForm').reset();
}

function guardarObservacion(rut) {
    const fechaSesion = document.getElementById('fechaSesion').value;
    const estadoPaciente = document.getElementById('estadoPaciente').value.trim();
    const avancesDestacar = document.getElementById('avancesDestacar').value.trim();
    const datosSesion = document.getElementById('datosSesion').value.trim();

    if (fechaSesion && estadoPaciente && avancesDestacar && datosSesion) {
        let pacientes = obtenerPacientesDeLocalStorage();
        pacientes = pacientes.map(paciente => {
            if (paciente.rut === rut) {
                if (!paciente.observaciones) {
                    paciente.observaciones = [];
                }
                paciente.observaciones.push({
                    fecha: fechaSesion,
                    estado: estadoPaciente,
                    avances: avancesDestacar,
                    datos: datosSesion
                });
            }
            return paciente;
        });
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        const modal = bootstrap.Modal.getInstance(document.getElementById('observacionModal'));
        modal.hide();
        notificar("success", "Sesión guardada con éxito");
        mostrarReporte(rut);
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

function mostrarReporte(rut) {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const pacientes = obtenerPacientesDeLocalStorage();
    const paciente = pacientes.find(paciente => paciente.rut === rut);

    if (paciente) {
        let reporteHTML = `
            <h2>Historial de Observaciones de ${paciente.nombreCompleto}</h2>
            <table class="table table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Fecha</th>
                        <th>Avances</th>
                        <th>Observaciones de Sesión</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (paciente.observaciones && paciente.observaciones.length > 0) {
            // Ordenar las observaciones por fecha, del más reciente al más antiguo
            paciente.observaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            paciente.observaciones.forEach(observacion => {
                reporteHTML += `
                    <tr>
                        <td>${observacion.fecha}</td>
                        <td>${observacion.avances}</td>
                        <td>${observacion.observaciones}</td>
                    </tr>
                `;
            });
        } else {
            reporteHTML += `
                <tr>
                    <td colspan="3">No hay observaciones registradas.</td>
                </tr>
            `;
        }

        reporteHTML += `
                </tbody>
            </table>
            <button class="btn btn-primary" onclick="mostrarListaReportes()">Volver a la Lista de Reportes</button>
            <button class="btn btn-info" onclick="agregarObservacion('${paciente.rut}')">Agregar Observación</button>
            <button class="btn btn-success" onclick="generarPDF('${paciente.rut}')">Generar PDF</button>
        `;

        contenidoPrincipal.innerHTML = reporteHTML;
    } else {
        contenidoPrincipal.innerHTML = '<p>Paciente no encontrado.</p>';
    }
}

function generarPDF(rut) {
    const { jsPDF } = window.jspdf;
    const pacientes = obtenerPacientesDeLocalStorage();
    const paciente = pacientes.find(paciente => paciente.rut === rut);

    if (paciente) {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Historial de Observaciones de ${paciente.nombreCompleto}`, 10, 10);

        let y = 20;
        doc.setFontSize(12);
        if (paciente.observaciones) {
            // Ordenar las observaciones por fecha, del más reciente al más antiguo
            paciente.observaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            paciente.observaciones.forEach(observacion => {
                doc.text(`Fecha: ${observacion.fecha}`, 10, y);
                doc.text(`Avances: ${observacion.avances}`, 10, y + 10);
                doc.text(`Observaciones de Sesión: ${observacion.observaciones}`, 10, y + 20);
                y += 30;
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
            });
        } else {
            doc.text("No hay observaciones registradas.", 10, y);
        }

        doc.save(`Reporte_${paciente.nombreCompleto}.pdf`);
    } else {
        alert("Paciente no encontrado.");
    }
}

function mostrarListaReportes() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const listaHTML = `
        <h2>Lista de Reportes</h2>
        <table class="table table-bordered">
            <thead class="table-light">
                <tr>
                    <th>Nombre Completo</th>
                    <th>RUT</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="listadepacientes"></tbody>
        </table>
    `;
    contenidoPrincipal.innerHTML = listaHTML;

    const pacientes = obtenerPacientesDeLocalStorage();
    for (const paciente of pacientes) {
        if (paciente.observaciones && paciente.observaciones.length > 0) {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td>${paciente.nombreCompleto}</td>`;
            fila.innerHTML += `<td>${paciente.rut}</td>`;
            fila.innerHTML += `
                <td>
                    <button class="btn btn-primary btn-sm" onclick="mostrarReporte('${paciente.rut}')">Ver Reporte</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarReporte('${paciente.rut}')">Eliminar Reporte</button>
                </td>
            `;
            document.querySelector("#listadepacientes").appendChild(fila);
        }
    }
}

function eliminarReporte(rut) {
    let pacientes = obtenerPacientesDeLocalStorage();
    pacientes = pacientes.map(paciente => {
        if (paciente.rut === rut) {
            paciente.observaciones = [];
        }
        return paciente;
    });
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    notificar("success", "Reporte eliminado con éxito");
    mostrarListaReportes();
}

function mostrarListaReportes() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const notification = document.createElement('div');
    notification.classList.add('notification', tipoMensaje);
    notification.textContent = mensaje;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function obtenerPacientesDeLocalStorage() {
    return JSON.parse(localStorage.getItem('pacientes')) || [];
}

function guardarPacienteEnLocalStorage(paciente) {
    let pacientes = obtenerPacientesDeLocalStorage();
    pacientes.push(paciente);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function guardarPacienteEnBaseDeDatos(paciente) {
    fetch('/api/pacientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paciente)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Paciente guardado en la base de datos con ID:', data.id);
    })
    .catch(error => {
        console.error('Error al guardar el paciente en la base de datos:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('nuevoPaciente').addEventListener('click', mostrarFormulario);
    document.getElementById('pacientes').addEventListener('click', mostrarLista);
    document.getElementById('reportes').addEventListener('click', function(event) {
        event.preventDefault();
        mostrarListaReportes();
    });
    document.getElementById('pagos').addEventListener('click', mostrarListaPagos);
    document.getElementById('manualUso').addEventListener('click', mostrarManualUsuario);
    document.getElementById('logo').addEventListener('click', function(event) {
        event.preventDefault();
        mostrarMenuPrincipal();
    });

    // Aplicar configuración al cargar la página
    aplicarConfiguracion();
});

function mostrarFormulario() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const formHTML = `
        <form id="pacienteForm" action="" method="" enctype="multipart/form-data" onsubmit="event.preventDefault(); validarFormulario(event)">
            <div class="mb-3">
                <label for="nombreCompleto" class="form-label">Nombre Completo</label>
                <input type="text" class="form-control" id="nombreCompleto" name="nombreCompleto" required>
                <div class="invalid-feedback">Por favor, ingrese el nombre completo.</div>
            </div>
            <div class="mb-3">
                <label for="rut" class="form-label">RUT</label>
                <input type="text" class="form-control" id="rut" name="rut" required pattern="[0-9]{9}">
                <div class="invalid-feedback">El RUT debe contener 9 dígitos sin el dígito verificador.</div>
            </div>
            <div class="mb-3">
                <label for="genero" class="form-label">Género</label>
                <select class="form-select" id="genero" name="genero" required>
                    <option value="">Seleccione Género:</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Prefiero no mencionar">Prefiero no mencionar</option>
                </select>
                <div class="invalid-feedback">Por favor, seleccione un género.</div>
            </div>
            <div class="mb-3">
                <label for="edad" class="form-label">Edad</label>
                <input type="number" class="form-control" id="edad" name="edad" required>
                <div class="invalid-feedback">Por favor, ingrese la edad.</div>
            </div>
            <div class="mb-3">
                <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
                <input type="date" class="form-control" id="fechaNacimiento" name="fechaNacimiento" required>
                <div class="invalid-feedback">Por favor, ingrese la fecha de nacimiento.</div>
            </div>
            <div class="mb-3">
                <label for="diagnosticoIngreso" class="form-label">Diagnóstico de Ingreso</label>
                <textarea class="form-control" id="diagnosticoIngreso" name="diagnosticoIngreso" required></textarea>
                <div class="invalid-feedback">Por favor, ingrese el diagnóstico de ingreso.</div>
            </div>
            <div class="mb-3">
                <label for="nacionalidad" class="form-label">Nacionalidad</label>
                <select class="form-select" id="nacionalidad" name="nacionalidad" required>
                    <option value="Chileno/a">Chileno/a</option>
                    <option value="Argentino/a">Argentino/a</option>
                    <option value="Boliviano/a">Boliviano/a</option>
                    <option value="Brasileño/a">Brasileño/a</option>
                    <option value="Colombiano/a">Colombiano/a</option>
                    <option value="Ecuatoriano/a">Ecuatoriano/a</option>
                    <option value="Mexicano/a">Mexicano/a</option>
                    <option value="Peruano/a">Peruano/a</option>
                    <option value="Uruguayo/a">Uruguayo/a</option>
                    <option value="Venezolano/a">Venezolano/a</option>
                    <option value="Otro">Otro</option>
                </select>
                <div class="invalid-feedback">Por favor, seleccione una nacionalidad.</div>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-mail electrónico</label>
                <input type="email" class="form-control" id="email" name="email" required>
                <div class="invalid-feedback">Por favor, ingrese un email válido.</div>
            </div>
            <div class="mb-3">
                <label for="estadoCivil" class="form-label">Estado Civil</label>
                <select class="form-select" id="estadoCivil" name="estadoCivil" required>
                    <option value="">Seleccione Estado Civil:</option>
                    <option value="Soltero/a">Soltero/a</option>
                    <option value="Casado/a">Casado/a</option>
                    <option value="Viudo/a">Viudo/a</option>
                </select>
                <div class="invalid-feedback">Por favor, seleccione un estado civil.</div>
            </div>
            <div class="mb-3">
                <label for="observacionInicial" class="form-label">Observación Inicial</label>
                <textarea class="form-control" id="observacionInicial" name="observacionInicial" required></textarea>
                <div class="invalid-feedback">Por favor, ingrese una observación inicial.</div>
            </div>
            <button type="submit" class="btn btn-primary">Guardar Paciente</button>
        </form>
    `;
    contenidoPrincipal.innerHTML = formHTML;
}

function agregarPaciente(nombreCompleto, rut, genero, edad, fechaNacimiento, diagnosticoIngreso, nacionalidad, email, estadoCivil, observacionInicial) {
    const nuevoPaciente = {
        nombreCompleto: nombreCompleto,
        rut: rut,
        genero: genero,
        edad: edad,
        fechaNacimiento: fechaNacimiento,
        diagnosticoIngreso: diagnosticoIngreso,
        nacionalidad: nacionalidad,
        email: email,
        estadoCivil: estadoCivil,
        observacionInicial: observacionInicial
    };
    guardarPacienteEnLocalStorage(nuevoPaciente);
    notificar("success", "Paciente agregado con éxito");
}

function mostrarLista() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const listaHTML = `
        <table class="table table-bordered">
            <thead class="table-light">
                <tr>
                    <th>Nombre Completo</th>
                    <th>RUT</th>
                    <th>Género</th>
                    <th>Edad</th>
                    <th>Fecha de Nacimiento</th>
                    <th>Diagnóstico de Ingreso</th>
                    <th>Nacionalidad</th>
                    <th>Email</th>
                    <th>Estado Civil</th>
                    <th>Observación Inicial</th>
                    <th>Prioridad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="listadepacientes"></tbody>
        </table>
    `;
    contenidoPrincipal.innerHTML = listaHTML;

    const pacientes = obtenerPacientesDeLocalStorage();
    for (const paciente of pacientes) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td onclick="mostrarReporte('${paciente.rut}')">${paciente.nombreCompleto}</td>`;
        fila.innerHTML += `<td>${paciente.rut}</td>`;
        fila.innerHTML += `<td>${paciente.genero}</td>`;
        fila.innerHTML += `<td>${paciente.edad}</td>`;
        fila.innerHTML += `<td>${paciente.fechaNacimiento}</td>`;
        fila.innerHTML += `<td>${paciente.diagnosticoIngreso}</td>`;
        fila.innerHTML += `<td>${paciente.nacionalidad}</td>`;
        fila.innerHTML += `<td>${paciente.email}</td>`;
        fila.innerHTML += `<td>${paciente.estadoCivil}</td>`;
        fila.innerHTML += `<td>${paciente.observacionInicial}</td>`;
        fila.innerHTML += `<td>${paciente.prioridad || 'Sin Categoría'}</td>`;
        fila.innerHTML += `
            <td>
                <button class="btn btn-secondary btn-sm" onclick="mostrarOpciones('${paciente.rut}')">...</button>
                <div id="opciones-${paciente.rut}" class="opciones" style="display: none;">
                    <button class="btn btn-primary btn-sm" onclick="categorizarPaciente('${paciente.rut}')">Categorizar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPaciente('${paciente.rut}')">Eliminar</button>
                    <button class="btn btn-info btn-sm" onclick="agregarObservacion('${paciente.rut}')">Agregar Observación</button>
                </div>
            </td>
        `;
        document.querySelector("#listadepacientes").appendChild(fila);
    }
}

function mostrarOpciones(rut) {
    const opciones = document.getElementById(`opciones-${rut}`);
    opciones.style.display = opciones.style.display === 'none' ? 'block' : 'none';
}

function categorizarPaciente(rut) {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const modalHTML = `
        <div class="modal" tabindex="-1" id="categorizarModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Categorizar Paciente</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Seleccione la prioridad para el paciente:</p>
                        <button class="btn btn-primary" onclick="guardarPrioridad('${rut}', 'Prioridad')">Prioridad</button>
                        <button class="btn btn-warning" onclick="guardarPrioridad('${rut}', 'Importante')">Importante</button>
                        <button class="btn btn-secondary" onclick="guardarPrioridad('${rut}', 'Poco importante')">Poco importante</button>
                        <button class="btn btn-danger" onclick="guardarPrioridad('${rut}', 'Desvinculado')">Desvinculado</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    contenidoPrincipal.innerHTML += modalHTML;
    const modal = new bootstrap.Modal(document.getElementById('categorizarModal'));
    modal.show();
}

function guardarPrioridad(rut, prioridad) {
    let pacientes = obtenerPacientesDeLocalStorage();
    pacientes = pacientes.map(paciente => {
        if (paciente.rut === rut) {
            paciente.prioridad = prioridad;
        }
        return paciente;
    });
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    const modal = bootstrap.Modal.getInstance(document.getElementById('categorizarModal'));
    modal.hide();
    mostrarLista();
}

function eliminarPaciente(rut) {
    let pacientes = obtenerPacientesDeLocalStorage();
    pacientes = pacientes.filter(paciente => paciente.rut !== rut);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    mostrarLista();
}

function agregarObservacion(rut) {
    const pacientes = obtenerPacientesDeLocalStorage();
    const paciente = pacientes.find(paciente => paciente.rut === rut);

    if (paciente) {
        const modalHTML = `
            <div class="modal fade" id="observacionModal" tabindex="-1" aria-labelledby="observacionModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="observacionModalLabel">Agregar Observación para ${paciente.nombreCompleto}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="observacionForm">
                                <div class="mb-3">
                                    <label for="rutPaciente" class="form-label">RUT</label>
                                    <input type="text" class="form-control" id="rutPaciente" name="rutPaciente" value="${paciente.rut}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="nombrePaciente" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="nombrePaciente" name="nombrePaciente" value="${paciente.nombreCompleto}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="edadPaciente" class="form-label">Edad</label>
                                    <input type="text" class="form-control" id="edadPaciente" name="edadPaciente" value="${paciente.edad}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="avancesDestacar" class="form-label">Avances</label>
                                    <input type="text" class="form-control" id="avancesDestacar" name="avancesDestacar" required>
                                </div>
                                <div class="mb-3">
                                    <label for="observacionesSesion" class="form-label">Observaciones de Sesión</label>
                                    <textarea class="form-control" id="observacionesSesion" name="observacionesSesion" rows="5" required></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="guardarObservacion('${rut}')">Guardar sesión</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('observacionModal'));
        modal.show();
    } else {
        notificar("error", "Paciente no encontrado");
    }
}

function guardarObservacion(rut) {
    const avancesDestacar = document.getElementById('avancesDestacar').value.trim();
    const observacionesSesion = document.getElementById('observacionesSesion').value.trim();

    if (avancesDestacar && observacionesSesion) {
        let pacientes = obtenerPacientesDeLocalStorage();
        pacientes = pacientes.map(paciente => {
            if (paciente.rut === rut) {
                if (!paciente.observaciones) {
                    paciente.observaciones = [];
                }
                paciente.observaciones.push({
                    fecha: new Date().toISOString().split('T')[0],
                    avances: avancesDestacar,
                    observaciones: observacionesSesion
                });
            }
            return paciente;
        });
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        const modal = bootstrap.Modal.getInstance(document.getElementById('observacionModal'));
        modal.hide();
        document.getElementById('observacionModal').remove();
        notificar("success", "Sesión guardada con éxito");
        mostrarListaReportes();
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

function mostrarReporte(rut) {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const pacientes = obtenerPacientesDeLocalStorage();
    const paciente = pacientes.find(paciente => paciente.rut === rut);

    if (paciente) {
        let reporteHTML = `
            <h2>Historial de Observaciones de ${paciente.nombreCompleto}</h2>
            <table class="table table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Fecha</th>
                        <th>Avances</th>
                        <th>Observaciones de Sesión</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (paciente.observaciones && paciente.observaciones.length > 0) {
            // Ordenar las observaciones por fecha, del más reciente al más antiguo
            paciente.observaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            paciente.observaciones.forEach(observacion => {
                reporteHTML += `
                    <tr>
                        <td>${observacion.fecha}</td>
                        <td>${observacion.avances}</td>
                        <td>${observacion.observaciones}</td>
                    </tr>
                `;
            });
        } else {
            reporteHTML += `
                <tr>
                    <td colspan="3">No hay observaciones registradas.</td>
                </tr>
            `;
        }

        reporteHTML += `
                </tbody>
            </table>
            <button class="btn btn-primary" onclick="mostrarListaReportes()">Volver a la Lista de Reportes</button>
            <button class="btn btn-info" onclick="agregarObservacion('${paciente.rut}')">Agregar Observación</button>
            <button class="btn btn-success" onclick="generarPDF('${paciente.rut}')">Generar PDF</button>
        `;

        contenidoPrincipal.innerHTML = reporteHTML;
    } else {
        contenidoPrincipal.innerHTML = '<p>Paciente no encontrado.</p>';
    }
}

function generarPDF(rut) {
    const { jsPDF } = window.jspdf;
    const pacientes = obtenerPacientesDeLocalStorage();
    const paciente = pacientes.find(paciente => paciente.rut === rut);

    if (paciente) {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Historial de Observaciones de ${paciente.nombreCompleto}`, 10, 10);

        let y = 20;
        doc.setFontSize(12);
        if (paciente.observaciones) {
            // Ordenar las observaciones por fecha, del más reciente al más antiguo
            paciente.observaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            paciente.observaciones.forEach(observacion => {
                doc.text(`Fecha: ${observacion.fecha}`, 10, y);
                doc.text(`Avances: ${observacion.avances}`, 10, y + 10);
                doc.text(`Observaciones de Sesión: ${observacion.observaciones}`, 10, y + 20);
                y += 30;
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
            });
        } else {
            doc.text("No hay observaciones registradas.", 10, y);
        }

        doc.save(`Reporte_${paciente.nombreCompleto}.pdf`);
    } else {
        alert("Paciente no encontrado.");
    }
}

function mostrarListaReportes() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const listaHTML = `
        <h2>Lista de Reportes</h2>
        <table class="table table-bordered">
            <thead class="table-light">
                <tr>
                    <th>Nombre Completo</th>
                    <th>RUT</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="listadepacientes"></tbody>
        </table>
    `;
    contenidoPrincipal.innerHTML = listaHTML;

    const pacientes = obtenerPacientesDeLocalStorage();
    for (const paciente of pacientes) {
        if (paciente.observaciones && paciente.observaciones.length > 0) {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td>${paciente.nombreCompleto}</td>`;
            fila.innerHTML += `<td>${paciente.rut}</td>`;
            fila.innerHTML += `
                <td>
                    <button class="btn btn-primary btn-sm" onclick="mostrarReporte('${paciente.rut}')">Ver Reporte</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarReporte('${paciente.rut}')">Eliminar Reporte</button>
                </td>
            `;
            document.querySelector("#listadepacientes").appendChild(fila);
        }
    }
}

function eliminarReporte(rut) {
    let pacientes = obtenerPacientesDeLocalStorage();
    pacientes = pacientes.map(paciente => {
        if (paciente.rut === rut) {
            paciente.observaciones = [];
        }
        return paciente;
    });
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    notificar("success", "Reporte eliminado con éxito");
    mostrarListaReportes();
}

function notificar(tipoMensaje, mensaje) {
    const notificationContainer = document.querySelector('.notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification', tipoMensaje);
    notification.textContent = mensaje;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function obtenerPacientesDeLocalStorage() {
    return JSON.parse(localStorage.getItem('pacientes')) || [];
}

function guardarPacienteEnLocalStorage(paciente) {
    let pacientes = obtenerPacientesDeLocalStorage();
    pacientes.push(paciente);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function guardarPacienteEnBaseDeDatos(paciente) {
    fetch('/api/pacientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paciente)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Paciente guardado en la base de datos con ID:', data.id);
    })
    .catch(error => {
        console.error('Error al guardar el paciente en la base de datos:', error);
    });
}

function mostrarFormularioPago() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const formHTML = `
        <form id="pagoForm" action="" method="" onsubmit="event.preventDefault(); registrarPago(event)">
            <div class="mb-3">
                <label for="rutPaciente" class="form-label">RUT del Paciente</label>
                <input type="text" class="form-control" id="rutPaciente" name="rutPaciente" required>
            </div>
            <div class="mb-3">
                <label for="fechaPago" class="form-label">Fecha del Pago</label>
                <input type="date" class="form-control" id="fechaPago" name="fechaPago" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="mb-3">
                <label for="montoPago" class="form-label">Monto del Pago</label>
                <input type="number" class="form-control" id="montoPago" name="montoPago" required>
            </div>
            <div class="mb-3">
                <label for="metodoPago" class="form-label">Método de Pago</label>
                <select class="form-select" id="metodoPago" name="metodoPago" required>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="comentariosPago" class="form-label">Comentarios</label>
                <textarea class="form-control" id="comentariosPago" name="comentariosPago" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Registrar Pago</button>
        </form>
    `;
    contenidoPrincipal.innerHTML = formHTML;
}
function registrarPago(event) {
    const rutPaciente = event.target.elements.rutPaciente.value.trim();
    const fechaPago = event.target.elements.fechaPago.value.trim();
    const montoPago = parseFloat(event.target.elements.montoPago.value.trim()).toFixed(2);
    const metodoPago = event.target.elements.metodoPago.value.trim();
    const estadoPago = event.target.elements.estadoPago.value.trim();

    if (rutPaciente && fechaPago && montoPago && metodoPago && estadoPago) {
        let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
        pagos.push({
            rut: rutPaciente,
            fecha: fechaPago,
            monto: montoPago,
            metodo: metodoPago,
            estado: estadoPago
        });
        localStorage.setItem('pagos', JSON.stringify(pagos));
        notificar("success", "Pago registrado con éxito");
        mostrarListaPagos();
    } else {
        notificar("error", "Por favor, complete todos los campos");
    }
}
function mostrarListaPagos() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const listaHTML = `
        <button class="btn btn-primary mb-3" onclick="mostrarFormularioPago()">Registrar Pago</button>
        <table class="table table-bordered">
            <thead class="table-light">
                <tr>
                    <th>RUT del Paciente</th>
                    <th>Fecha del Pago</th>
                    <th>Monto</th>
                    <th>Método de Pago</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="listadepagos"></tbody>
        </table>
    `;
    contenidoPrincipal.innerHTML = listaHTML;

    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    for (const pago of pagos) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${pago.rut}</td>`;
        fila.innerHTML += `<td>${pago.fecha}</td>`;
        fila.innerHTML += `<td>${formatearMonto(pago.monto)}</td>`;
        fila.innerHTML += `<td>${pago.metodo}</td>`;
        fila.innerHTML += `<td>${pago.estado}</td>`;
        fila.innerHTML += `
            <td>
                <button class="btn btn-success btn-sm" onclick="generarRecibo('${pago.rut}', '${pago.fecha}', this)">Generar Recibo</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPago('${pago.rut}', '${pago.fecha}')">Eliminar</button>
            </td>
        `;
        document.querySelector("#listadepagos").appendChild(fila);
    }
}

function formatearMonto(monto) {
    return `$${parseFloat(monto).toLocaleString('es-CL', { minimumFractionDigits: 0 })}`;
}
function mostrarFormularioPago() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const formHTML = `
        <form id="pagoForm" action="" method="" onsubmit="event.preventDefault(); registrarPago(event)">
            <div class="mb-3">
                <label for="rutPaciente" class="form-label">RUT del Paciente</label>
                <input type="text" class="form-control" id="rutPaciente" name="rutPaciente" required>
            </div>
            <div class="mb-3">
                <label for="fechaPago" class="form-label">Fecha del Pago</label>
                <input type="date" class="form-control" id="fechaPago" name="fechaPago" value="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="mb-3">
                <label for="montoPago" class="form-label">Monto del Pago</label>
                <input type="number" class="form-control" id="montoPago" name="montoPago" required>
            </div>
            <div class="mb-3">
                <label for="metodoPago" class="form-label">Método de Pago</label>
                <select class="form-select" id="metodoPago" name="metodoPago" required>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="estadoPago" class="form-label">Estado del Pago</label>
                <div>
                    <button type="button" class="btn btn-success" onclick="seleccionarEstado('Vigente')">Vigente</button>
                    <button type="button" class="btn btn-danger" onclick="seleccionarEstado('Pendiente')">Pendiente</button>
                </div>
                <input type="hidden" id="estadoPago" name="estadoPago" required>
            </div>
            <button type="submit" class="btn btn-primary">Registrar Pago</button>
        </form>
    `;
    contenidoPrincipal.innerHTML = formHTML;
}

function seleccionarEstado(estado) {
    document.getElementById('estadoPago').value = estado;
    notificar("success", `Estado del pago seleccionado: ${estado}`);
}
function registrarPago(event) {
    const rutPaciente = event.target.elements.rutPaciente.value.trim();
    const fechaPago = event.target.elements.fechaPago.value.trim();
    const montoPago = event.target.elements.montoPago.value.trim();
    const metodoPago = event.target.elements.metodoPago.value.trim();
    const estadoPago = event.target.elements.estadoPago.value.trim();

    if (rutPaciente && fechaPago && montoPago && metodoPago && estadoPago) {
        let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
        pagos.push({
            rut: rutPaciente,
            fecha: fechaPago,
            monto: montoPago,
            metodo: metodoPago,
            estado: estadoPago
        });
        localStorage.setItem('pagos', JSON.stringify(pagos));
        notificar("success", "Pago registrado con éxito");
        mostrarListaPagos();
    } else {
        notificar("error", "Por favor, complete todos los campos");
    }
}
function mostrarListaPagos() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const listaHTML = `
        <button class="btn btn-primary mb-3" onclick="mostrarFormularioPago()">Registrar Pago</button>
        <table class="table table-bordered">
            <thead class="table-light">
                <tr>
                    <th>RUT del Paciente</th>
                    <th>Fecha del Pago</th>
                    <th>Monto</th>
                    <th>Método de Pago</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="listadepagos"></tbody>
        </table>
    `;
    contenidoPrincipal.innerHTML = listaHTML;

    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    for (const pago of pagos) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${pago.rut}</td>`;
        fila.innerHTML += `<td>${pago.fecha}</td>`;
        fila.innerHTML += `<td>${pago.monto}</td>`;
        fila.innerHTML += `<td>${pago.metodo}</td>`;
        fila.innerHTML += `<td>${pago.estado}</td>`;
        fila.innerHTML += `
            <td>
                <button class="btn btn-success btn-sm" onclick="generarRecibo('${pago.rut}', '${pago.fecha}', this)">Generar Recibo</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPago('${pago.rut}', '${pago.fecha}')">Eliminar</button>
            </td>
        `;
        document.querySelector("#listadepagos").appendChild(fila);
    }
}
function generarRecibo(rut, fecha, buttonElement) {
    const { jsPDF } = window.jspdf;
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const pago = pagos.find(p => p.rut === rut && p.fecha === fecha);

    if (pago) {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Recibo de Pago`, 10, 10);

        doc.setFontSize(12);
        doc.text(`RUT del Paciente: ${pago.rut}`, 10, 20);
        doc.text(`Fecha del Pago: ${pago.fecha}`, 10, 30);
        doc.text(`Monto: ${formatearMonto(pago.monto)}`, 10, 40);
        doc.text(`Método de Pago: ${pago.metodo}`, 10, 50);
        doc.text(`Estado: ${pago.estado}`, 10, 60);

        const pdfOutput = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfOutput);

        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = `Recibo_${pago.rut}_${pago.fecha}.pdf`;
        downloadLink.textContent = 'Descargar PDF';
        downloadLink.classList.add('btn', 'btn-primary', 'btn-sm', 'ms-2');

        buttonElement.parentElement.appendChild(downloadLink);
    } else {
        alert("Pago no encontrado.");
    }
}
function eliminarPago(rut, fecha) {
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos = pagos.filter(p => !(p.rut === rut && p.fecha === fecha));
    localStorage.setItem('pagos', JSON.stringify(pagos));
    notificar("success", "Pago eliminado con éxito");
    mostrarListaPagos();
}
function filtrarPagos() {
    const estadoFiltro = document.getElementById('filtroEstado').value;
    const rutFiltro = document.getElementById('buscarRUT').value.trim().toLowerCase();
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const pagosFiltrados = pagos.filter(pago => {
        return (estadoFiltro === '' || pago.estado === estadoFiltro) &&
               (rutFiltro === '' || pago.rut.toLowerCase().includes(rutFiltro));
    });
    mostrarPagosFiltrados(pagosFiltrados);
}

function mostrarPagosFiltrados(pagos) {
    const tbody = document.getElementById('listadepagos');
    tbody.innerHTML = '';
    pagos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    for (const pago of pagos) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${pago.rut}</td>`;
        fila.innerHTML += `<td>${pago.fecha}</td>`;
        fila.innerHTML += `<td>${formatearMonto(pago.monto)}</td>`;
        fila.innerHTML += `<td>${pago.metodo}</td>`;
        fila.innerHTML += `<td>${pago.estado}</td>`;
        fila.innerHTML += `
            <td>
                <button class="btn btn-success btn-sm" onclick="generarRecibo('${pago.rut}', '${pago.fecha}', this)">Generar Recibo</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPago('${pago.rut}', '${pago.fecha}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    }
}
function filtrarPagos() {
    const estadoFiltro = document.getElementById('filtroEstado').value;
    const rutFiltro = document.getElementById('buscarRUT').value.trim().toLowerCase();
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    const pagosFiltrados = pagos.filter(pago => {
        return (estadoFiltro === '' || pago.estado === estadoFiltro) &&
               (rutFiltro === '' || pago.rut.toLowerCase().includes(rutFiltro));
    });
    mostrarPagosFiltrados(pagosFiltrados);
}

function mostrarPagosFiltrados(pagos) {
    const tbody = document.getElementById('listadepagos');
    tbody.innerHTML = '';
    pagos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    for (const pago of pagos) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${pago.rut}</td>`;
        fila.innerHTML += `<td>${pago.fecha}</td>`;
        fila.innerHTML += `<td>${formatearMonto(pago.monto)}</td>`;
        fila.innerHTML += `<td>${pago.metodo}</td>`;
        fila.innerHTML += `<td>${pago.estado}</td>`;
        fila.innerHTML += `
            <td>
                <button class="btn btn-success btn-sm" onclick="generarRecibo('${pago.rut}', '${pago.fecha}', this)">Generar Recibo</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPago('${pago.rut}', '${pago.fecha}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    }
}

function formatearMonto(monto) {
    return `$${parseFloat(monto).toLocaleString('es-CL', { minimumFractionDigits: 0 })}`;
}
function agregarObservacion(rut) {
    const pacientes = obtenerPacientesDeLocalStorage();
    const paciente = pacientes.find(paciente => paciente.rut === rut);

    if (paciente) {
        const modalHTML = `
            <div class="modal fade" id="observacionModal" tabindex="-1" aria-labelledby="observacionModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="observacionModalLabel">Agregar Observación para ${paciente.nombreCompleto}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="observacionForm">
                                <div class="mb-3">
                                    <label for="rutPaciente" class="form-label">RUT</label>
                                    <input type="text" class="form-control" id="rutPaciente" name="rutPaciente" value="${paciente.rut}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="nombrePaciente" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="nombrePaciente" name="nombrePaciente" value="${paciente.nombreCompleto}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="edadPaciente" class="form-label">Edad</label>
                                    <input type="text" class="form-control" id="edadPaciente" name="edadPaciente" value="${paciente.edad}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="avancesDestacar" class="form-label">Avances</label>
                                    <input type="text" class="form-control" id="avancesDestacar" name="avancesDestacar" required>
                                </div>
                                <div class="mb-3">
                                    <label for="observacionesSesion" class="form-label">Observaciones de Sesión</label>
                                    <textarea class="form-control" id="observacionesSesion" name="observacionesSesion" rows="5" required></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="guardarObservacion('${rut}')">Guardar sesión</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('observacionModal'));
        modal.show();
    } else {
        notificar("error", "Paciente no encontrado");
    }
}

function guardarObservacion(rut) {
    const avancesDestacar = document.getElementById('avancesDestacar').value.trim();
    const observacionesSesion = document.getElementById('observacionesSesion').value.trim();

    if (avancesDestacar && observacionesSesion) {
        let pacientes = obtenerPacientesDeLocalStorage();
        pacientes = pacientes.map(paciente => {
            if (paciente.rut === rut) {
                if (!paciente.observaciones) {
                    paciente.observaciones = [];
                }
                paciente.observaciones.push({
                    fecha: new Date().toISOString().split('T')[0],
                    avances: avancesDestacar,
                    observaciones: observacionesSesion
                });
            }
            return paciente;
        });
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        const modal = bootstrap.Modal.getInstance(document.getElementById('observacionModal'));
        modal.hide();
        document.getElementById('observacionModal').remove();
        notificar("success", "Sesión guardada con éxito");
        mostrarListaReportes();
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

function guardarPacientesEnLocalStorage(pacientes) {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function mostrarMenuPrincipal() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const menuHTML = `
        <div class="text-center animated fadeIn">
            <h1 class="animated-text">Bienvenido a FloreceSanando</h1>
            <p>Seleccione una opción del menú para comenzar.</p>
            <div class="d-flex justify-content-center mb-4">
                <button class="btn btn-menu mx-2 animated bounceIn" id="btnNuevoPaciente">Nuevo Paciente</button>
                <button class="btn btn-menu mx-2 animated bounceIn" id="btnPacientes">Pacientes</button>
                <button class="btn btn-menu mx-2 animated bounceIn" id="btnReportes">Reportes</button>
                <button class="btn btn-menu mx-2 animated bounceIn" id="btnPagos">Pagos</button>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <canvas id="pacientesChart" width="400" height="200"></canvas>
                </div>
                <div class="col-md-6">
                    <canvas id="contabilidadChart" width="400" height="200"></canvas>
                </div>
            </div>
        </div>
    `;
    contenidoPrincipal.innerHTML = menuHTML;

    document.getElementById('btnNuevoPaciente').addEventListener('click', mostrarFormulario);
    document.getElementById('btnPacientes').addEventListener('click', mostrarLista);
    document.getElementById('btnReportes').addEventListener('click', function(event) {
        event.preventDefault();
        mostrarListaReportes();
    });
    document.getElementById('btnPagos').addEventListener('click', mostrarListaPagos);

    // Inicializar los gráficos
    inicializarGraficoPacientes();
    inicializarGraficoContabilidad();
}

function inicializarGraficoPacientes() {
    const ctx = document.getElementById('pacientesChart').getContext('2d');
    const pacientesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Avances Buenos', 'Avances Intermedios', 'Avances Malos'],
            datasets: [{
                label: 'Estadísticas de Pacientes',
                data: [50, 30, 20], // Datos de ejemplo, reemplazar con datos reales
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Estadísticas de Pacientes'
                }
            }
        }
    });
}

function inicializarGraficoContabilidad() {
    const ctx = document.getElementById('contabilidadChart').getContext('2d');
    const contabilidadChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Gastos', 'Beneficios'],
            datasets: [{
                label: 'Contabilidad',
                data: [12000, 8000, 4000], // Datos de ejemplo, reemplazar con datos reales
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Contabilidad'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function mostrarConfiguracion() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const configuracionHTML = `
        <div class="text-center animated fadeIn">
            <h1>Configuración</h1>
            <form id="configuracionForm">
                <!-- Personalización de la Interfaz de Usuario -->
                <div class="mb-3">
                    <label for="tipoFuente" class="form-label">Tipo de Fuente</label>
                    <select class="form-select" id="tipoFuente">
                        <option value="Poppins">Poppins</option>
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Lucida Console">Lucida Console</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Oswald">Oswald</option>
                        <option value="Raleway">Raleway</option>
                        <option value="Ubuntu">Ubuntu</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="tamanoFuente" class="form-label">Tamaño de Fuente</label>
                    <input type="number" class="form-control" id="tamanoFuente" value="16">
                </div>
                <div class="mb-3">
                    <label for="colorFuente" class="form-label">Color de Fuente</label>
                    <input type="color" class="form-control" id="colorFuente" value="#000000">
                </div>
                <div class="mb-3">
                    <label for="modoTema" class="form-label">Modo de Tema</label>
                    <select class="form-select" id="modoTema">
                        <option value="claro">Claro</option>
                        <option value="oscuro">Oscuro</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="colorPlataforma" class="form-label">Color de la Plataforma</label>
                    <input type="color" class="form-control" id="colorPlataforma" value="#ADD8E6">
                </div>

                <!-- Preferencias de Usuario -->
                <div class="mb-3">
                    <label for="idioma" class="form-label">Idioma</label>
                    <select class="form-select" id="idioma">
                        <option value="es">Español</option>
                        <option value="en">Inglés</option>
                        <!-- Agrega más opciones de idioma según sea necesario -->
                    </select>
                </div>
                <div class="mb-3">
                    <label for="zonaHoraria" class="form-label">Zona Horaria</label>
                    <select class="form-select" id="zonaHoraria">
                        <option value="GMT-5">GMT-5</option>
                        <option value="GMT-6">GMT-6</option>
                        <!-- Agrega más opciones de zona horaria según sea necesario -->
                    </select>
                </div>
                <div class="mb-3">
                    <label for="formatoFecha" class="form-label">Formato de Fecha</label>
                    <select class="form-select" id="formatoFecha">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                </div>

                <!-- Configuración de Seguridad -->
                <div class="mb-3">
                    <label for="cambiarContrasena" class="form-label">Cambiar Contraseña</label>
                    <input type="password" class="form-control" id="cambiarContrasena">
                </div>
                <div class="mb-3">
                    <label for="autenticacionDosFactores" class="form-label">Autenticación de Dos Factores</label>
                    <input type="checkbox" id="autenticacionDosFactores">
                </div>

                <!-- Preferencias de Notificaciones -->
                <div class="mb-3">
                    <label for="notificacionesEmail" class="form-label">Notificaciones por Correo Electrónico</label>
                    <input type="checkbox" id="notificacionesEmail">
                </div>
                <div class="mb-3">
                    <label for="notificacionesSMS" class="form-label">Notificaciones por SMS</label>
                    <input type="checkbox" id="notificacionesSMS">
                </div>

                <!-- Configuración de Pagos -->
                <div class="mb-3">
                    <label for="metodoPago" class="form-label">Método de Pago Preferido</label>
                    <select class="form-select" id="metodoPago">
                        <option value="tarjetaCredito">Tarjeta de Crédito</option>
                        <option value="paypal">PayPal</option>
                        <!-- Agrega más opciones de método de pago según sea necesario -->
                    </select>
                </div>

                <!-- Accesibilidad -->
                <div class="mb-3">
                    <label for="modoAltoContraste" class="form-label">Modo de Alto Contraste</label>
                    <input type="checkbox" id="modoAltoContraste">
                </div>
                <div class="mb-3">
                    <label for="tamanoTextoAjustable" class="form-label">Tamaño de Texto Ajustable</label>
                    <input type="checkbox" id="tamanoTextoAjustable">
                </div>

                <button type="button" class="btn btn-primary" onclick="guardarConfiguracion()">Guardar Configuración</button>
            </form>
        </div>
    `;
    contenidoPrincipal.innerHTML = configuracionHTML;

    // Cargar configuración guardada
    cargarConfiguracion();
}

function guardarConfiguracion() {
    const tipoFuente = document.getElementById('tipoFuente').value;
    const tamanoFuente = document.getElementById('tamanoFuente').value;
    const colorFuente = document.getElementById('colorFuente').value;
    const modoTema = document.getElementById('modoTema').value;
    const colorPlataforma = document.getElementById('colorPlataforma').value;
    const idioma = document.getElementById('idioma').value;
    const zonaHoraria = document.getElementById('zonaHoraria').value;
    const formatoFecha = document.getElementById('formatoFecha').value;
    const cambiarContrasena = document.getElementById('cambiarContrasena').value;
    const autenticacionDosFactores = document.getElementById('autenticacionDosFactores').checked;
    const notificacionesEmail = document.getElementById('notificacionesEmail').checked;
    const notificacionesSMS = document.getElementById('notificacionesSMS').checked;
    const metodoPago = document.getElementById('metodoPago').value;
    const modoAltoContraste = document.getElementById('modoAltoContraste').checked;

    const paciente = {
        tipoFuente,
        tamanoFuente,
        colorFuente,
        modoTema,
        colorPlataforma,
        idioma,
        zonaHoraria,
        formatoFecha,
        cambiarContrasena,
        autenticacionDosFactores,
        notificacionesEmail,
        notificacionesSMS,
        metodoPago,
        modoAltoContraste
    };

    guardarPacienteEnLocalStorage(paciente);
    guardarPacienteEnBaseDeDatos(paciente);
}

function cargarConfiguracion() {
    const tipoFuente = localStorage.getItem('tipoFuente') || 'Poppins';
    const tamanoFuente = localStorage.getItem('tamanoFuente') || '16';
    const colorFuente = localStorage.getItem('colorFuente') || '#000000';
    const modoTema = localStorage.getItem('modoTema') || 'claro';
    const colorPlataforma = localStorage.getItem('colorPlataforma') || '#ADD8E6';
    const idioma = localStorage.getItem('idioma') || 'es';
    const zonaHoraria = localStorage.getItem('zonaHoraria') || 'GMT-5';
    const formatoFecha = localStorage.getItem('formatoFecha') || 'DD/MM/YYYY';
    const cambiarContrasena = localStorage.getItem('cambiarContrasena') || '';
    const autenticacionDosFactores = localStorage.getItem('autenticacionDosFactores') === 'true';
    const notificacionesEmail = localStorage.getItem('notificacionesEmail') === 'true';
    const notificacionesSMS = localStorage.getItem('notificacionesSMS') === 'true';
    const metodoPago = localStorage.getItem('metodoPago') || 'tarjetaCredito';
    const modoAltoContraste = localStorage.getItem('modoAltoContraste') === 'true';
    const tamanoTextoAjustable = localStorage.getItem('tamanoTextoAjustable') === 'true';

    document.getElementById('tipoFuente').value = tipoFuente;
    document.getElementById('tamanoFuente').value = tamanoFuente;
    document.getElementById('colorFuente').value = colorFuente;
    document.getElementById('modoTema').value = modoTema;
    document.getElementById('colorPlataforma').value = colorPlataforma;
    document.getElementById('idioma').value = idioma;
    document.getElementById('zonaHoraria').value = zonaHoraria;
    document.getElementById('formatoFecha').value = formatoFecha;
    document.getElementById('cambiarContrasena').value = cambiarContrasena;
    document.getElementById('autenticacionDosFactores').checked = autenticacionDosFactores;
    document.getElementById('notificacionesEmail').checked = notificacionesEmail;
    document.getElementById('notificacionesSMS').checked = notificacionesSMS;
    document.getElementById('metodoPago').value = metodoPago;
    document.getElementById('modoAltoContraste').checked = modoAltoContraste;
    document.getElementById('tamanoTextoAjustable').checked = tamanoTextoAjustable;

    aplicarConfiguracion();
}

function aplicarConfiguracion() {
    const tipoFuente = localStorage.getItem('tipoFuente') || 'Poppins';
    const tamanoFuente = localStorage.getItem('tamanoFuente') || '16';
    const colorFuente = localStorage.getItem('colorFuente') || '#000000';
    const modoTema = localStorage.getItem('modoTema') || 'claro';
    const colorPlataforma = localStorage.getItem('colorPlataforma') || '#ADD8E6';
    const idioma = localStorage.getItem('idioma') || 'es';
    const zonaHoraria = localStorage.getItem('zonaHoraria') || 'GMT-5';
    const formatoFecha = localStorage.getItem('formatoFecha') || 'DD/MM/YYYY';
    const autenticacionDosFactores = localStorage.getItem('autenticacionDosFactores') === 'true';
    const notificacionesEmail = localStorage.getItem('notificacionesEmail') === 'true';
    const notificacionesSMS = localStorage.getItem('notificacionesSMS') === 'true';
    const metodoPago = localStorage.getItem('metodoPago') || 'tarjetaCredito';
    const modoAltoContraste = localStorage.getItem('modoAltoContraste') === 'true';
    const tamanoTextoAjustable = localStorage.getItem('tamanoTextoAjustable') === 'true';

    document.body.style.fontFamily = tipoFuente;
    document.body.style.fontSize = `${tamanoFuente}px`;
    document.body.style.color = colorFuente;

    if (modoTema === 'oscuro') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    document.body.style.backgroundColor = colorPlataforma;

    // Aplica otras configuraciones según sea necesario
}

document.addEventListener('DOMContentLoaded', function() {
    const configuracionBtn = document.getElementById('configuracion');
    if (configuracionBtn) {
        configuracionBtn.addEventListener('click', function(event) {
            event.preventDefault();
            mostrarConfiguracion();
        });
    }

    const ayudaBtn = document.getElementById('ayuda');
    if (ayudaBtn) {
        ayudaBtn.addEventListener('click', function(event) {
            event.preventDefault();
            mostrarManualUsuario();
        });
    }

    // Aplicar configuración al cargar la página
    aplicarConfiguracion();
});

function mostrarManualUsuario() {
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const manualHTML = `
        <div class="manual-usuario">
            <h1>📘 Manual de Usuario</h1>
            <h2>👋 Introducción</h2>
            <p>Bienvenido al manual de usuario de FloreceSanando. Aquí encontrarás toda la información necesaria para utilizar la plataforma de manera efectiva.</p>
            
            <h2>📂 Secciones</h2>
            <ul>
                <li><strong>🆕 Nuevo Paciente:</strong> Permite registrar un nuevo paciente en la plataforma.</li>
                <li><strong>👥 Pacientes:</strong> Muestra la lista de pacientes registrados.</li>
                <li><strong>📊 Reportes:</strong> Permite generar y visualizar reportes de los pacientes.</li>
                <li><strong>💳 Pagos:</strong> Permite gestionar los pagos realizados por los pacientes.</li>
            </ul>
            
            <h2>🆕 Nuevo Paciente</h2>
            <p>Para registrar un nuevo paciente, sigue estos pasos:</p>
            <ol>
                <li>Haz clic en el botón "Nuevo Paciente" en el menú principal.</li>
                <li>Se abrirá un formulario donde deberás ingresar la siguiente información del paciente:
                    <ul>
                        <li><strong>Nombre Completo:</strong> Ingresa el nombre completo del paciente.</li>
                        <li><strong>RUT:</strong> Ingresa el RUT del paciente (9 dígitos sin el dígito verificador).</li>
                        <li><strong>Género:</strong> Selecciona el género del paciente (Masculino, Femenino, Prefiero no mencionar).</li>
                        <li><strong>Edad:</strong> Ingresa la edad del paciente.</li>
                        <li><strong>Fecha de Nacimiento:</strong> Selecciona la fecha de nacimiento del paciente.</li>
                        <li><strong>Diagnóstico de Ingreso:</strong> Ingresa el diagnóstico de ingreso del paciente.</li>
                        <li><strong>Nacionalidad:</strong> Selecciona la nacionalidad del paciente.</li>
                        <li><strong>Email:</strong> Ingresa el correo electrónico del paciente.</li>
                        <li><strong>Estado Civil:</strong> Selecciona el estado civil del paciente (Soltero/a, Casado/a, Viudo/a).</li>
                        <li><strong>Observación Inicial:</strong> Ingresa cualquier observación inicial relevante sobre el paciente.</li>
                    </ul>
                </li>
                <li>Una vez completado el formulario, haz clic en el botón "Guardar Paciente" para registrar la información en la plataforma.</li>
            </ol>
            
            <h2>👥 Pacientes</h2>
            <p>Para ver la lista de pacientes registrados, sigue estos pasos:</p>
            <ol>
                <li>Haz clic en el botón "Pacientes" en el menú principal.</li>
                <li>Se mostrará una tabla con la información de todos los pacientes registrados, incluyendo:
                    <ul>
                        <li>Nombre Completo</li>
                        <li>RUT</li>
                        <li>Género</li>
                        <li>Edad</li>
                        <li>Fecha de Nacimiento</li>
                        <li>Diagnóstico de Ingreso</li>
                        <li>Nacionalidad</li>
                        <li>Email</li>
                        <li>Estado Civil</li>
                        <li>Observación Inicial</li>
                        <li>Prioridad</li>
                    </ul>
                </li>
                <li>Puedes hacer clic en el nombre de un paciente para ver más detalles o realizar acciones adicionales como:
                    <ul>
                        <li><strong>Editar:</strong> Modificar la información del paciente.</li>
                        <li><strong>Eliminar:</strong> Eliminar el registro del paciente.</li>
                        <li><strong>Agregar Observación:</strong> Añadir nuevas observaciones sobre el paciente.</li>
                    </ul>
                </li>
            </ol>
            
            <h2>📊 Reportes</h2>
            <p>Para generar y visualizar reportes de los pacientes, sigue estos pasos:</p>
            <ol>
                <li>Haz clic en el botón "Reportes" en el menú principal.</li>
                <li>Se mostrará una lista de pacientes con reportes disponibles.</li>
                <li>Haz clic en el botón "Ver Reporte" junto al paciente deseado para ver el reporte detallado.</li>
                <li>Puedes generar nuevos reportes o eliminar reportes existentes según sea necesario.</li>
            </ol>
            
            <h2>💳 Pagos</h2>
            <p>Para gestionar los pagos realizados por los pacientes, sigue estos pasos:</p>
            <ol>
                <li>Haz clic en el botón "Pagos" en el menú principal.</li>
                <li>Se mostrará una tabla con la información de todos los pagos registrados, incluyendo:
                    <ul>
                        <li>RUT del Paciente</li>
                        <li>Fecha del Pago</li>
                        <li>Monto</li>
                        <li>Método de Pago</li>
                        <li>Estado</li>
                    </ul>
                </li>
                <li>Puedes registrar un nuevo pago haciendo clic en el botón "Registrar Pago" y rellenando el formulario correspondiente con la siguiente información:
                    <ul>
                        <li><strong>RUT del Paciente:</strong> Ingresa el RUT del paciente que realiza el pago.</li>
                        <li><strong>Fecha del Pago:</strong> Selecciona la fecha en que se realizó el pago.</li>
                        <li><strong>Monto:</strong> Ingresa el monto del pago.</li>
                        <li><strong>Método de Pago:</strong> Selecciona el método de pago utilizado (Tarjeta de Crédito, PayPal, etc.).</li>
                        <li><strong>Estado:</strong> Selecciona el estado del pago (Pagado, Pendiente, etc.).</li>
                    </ul>
                </li>
                <li>Haz clic en el botón "Guardar Pago" para registrar la información del pago en la plataforma.</li>
                <li>Puedes generar recibos de pago o eliminar pagos existentes según sea necesario.</li>
            </ol>
            
            <h2>📞 Contacto</h2>
            <p>Si tienes alguna duda o necesitas asistencia, por favor contacta con nuestro equipo de soporte a través del siguiente correo electrónico: soporte@florecesanando.com.</p>
        </div>
    `;
    contenidoPrincipal.innerHTML = manualHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('configuracion').addEventListener('click', function(event) {
        event.preventDefault();
        mostrarConfiguracion();
    });

    document.getElementById('ayuda').addEventListener('click', function(event) {
        event.preventDefault();
        mostrarManualUsuario();
    });

    // Aplicar configuración al cargar la página
    aplicarConfiguracion();
});