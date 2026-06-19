// ========================================================
// 4. LISTADO DE MIEMBROS (CLON CORREGIDO DE ACTIVIDADES)
// ========================================================
document.addEventListener("DOMContentLoaded", function() {
    let tablaMiembros = document.getElementById("cuerpo-tabla-miembros");
    let formFiltroMiembros = document.getElementById("form-filtro"); 
    let selectTipoMiembro = document.getElementById("tipo"); 

    if (tablaMiembros) {
        const urlParams = new URLSearchParams(window.location.search);
        let filtroTipo = urlParams.get('tipo') || "";
        let columnaOrden = urlParams.get('sort') || "";

        if (selectTipoMiembro && filtroTipo) {
            selectTipoMiembro.value = filtroTipo;
        }
        
        let dataTableMiembros;

        function renderizarFilas(miembros) {
            if (typeof dataTableMiembros !== 'undefined' && dataTableMiembros) {
                dataTableMiembros.destroy();
            }

            let tablaMiembrosViva = document.getElementById("cuerpo-tabla-miembros");
            if (!tablaMiembrosViva) return;
            tablaMiembrosViva.innerHTML = "";

            if (!miembros || miembros.length === 0) {
                tablaMiembrosViva.innerHTML = "<tr><td colspan='5' style='text-align: center; color: red; font-weight: bold;'>No se encontraron miembros.</td></tr>";
                return;
            }

            miembros.forEach(miembro => {
                let fila = document.createElement("tr");
                let fechaTexto = miembro.fechaRegistro ? miembro.fechaRegistro.replace('T', ' ') : "Sin fecha";

                fila.innerHTML = `
                    <td><a href="/perfil-miembro.html?id=${miembro.id}" style="color: #007bff; text-decoration: none; font-weight: bold;">${miembro.nombre}</a></td>
                    <td>${miembro.email}</td>
                    <td>${miembro.tipo}</td>
                    <td>${miembro.datoExtra || 'N/A'}</td>
                    <td>${fechaTexto}</td>
                `;
                tablaMiembrosViva.appendChild(fila);
            });

            const tablaHTML = tablaMiembrosViva.closest("table");
            if (tablaHTML && typeof simpleDatatables !== 'undefined') {
                dataTableMiembros = new simpleDatatables.DataTable(tablaHTML, {
                    perPage: 5,
                    searchable: false,
                    labels: {
                        placeholder: "Buscar...",
                        perPage: "registros por página",
                        noRows: "No hay registros para mostrar",
                        info: "Mostrando {start} a {end} de {rows} registros"
                    }
                });
            }
        }

        function cargarMiembros() {
            let url = 'http://localhost:8080/api/miembros';
            let params = [];
            
            if (filtroTipo) {
                // Formateamos el string para que la primera letra vaya en Mayúscula (ej: "academico" -> "Academico")
                // Esto empareja el filtro con el formato exacto guardado en tu base de datos
                let tipoFormateado = filtroTipo.charAt(0).toUpperCase() + filtroTipo.slice(1);
                params.push(`tipo=${encodeURIComponent(tipoFormateado)}`);
            }
            if (columnaOrden) params.push(`sort=${encodeURIComponent(columnaOrden)}`);
            if (params.length > 0) url += "?" + params.join("&");

            fetch(url)
            .then(response => response.json())
            .then(data => renderizarFilas(data))
            .catch(error => console.error("Error al cargar miembros:", error));
        }

        if (formFiltroMiembros) {
            formFiltroMiembros.addEventListener("submit", function(event) {
                event.preventDefault();
                if (selectTipoMiembro) {
                    filtroTipo = selectTipoMiembro.value;
                }
                cargarMiembros();
            });
        }

        document.querySelectorAll("table thead th a").forEach(enlace => {
            enlace.addEventListener("click", function(event) {
                event.preventDefault();
                columnaOrden = this.getAttribute("data-sort");
                cargarMiembros();
            });
        });

        cargarMiembros();
    }
});

// ========================================================
// FUNCIONES GLOBALES (PONERLAS AL INICIO DEL ARCHIVO)
// ========================================================
function resaltar(texto, busqueda) {
    if (!busqueda || busqueda.length < 3) return texto;
    const regex = new RegExp(`(${busqueda})`, 'gi');
    return texto.replace(regex, '<mark style="background-color: yellow;">$1</mark>');
}

function evaluarActividad(idActividad) {
    let inputNota = prompt("Ingresa una nota (Número entero del 1 al 7):");
    if (inputNota === null) return; 

    let nota = parseInt(inputNota);
    if (isNaN(nota) || nota < 1 || nota > 7) {
        alert("Error: Solo se aceptan notas que sean números enteros entre 1 y 7.");
        return;
    }

    const params = new URLSearchParams();
    params.append('valor', nota);

    fetch(`http://localhost:8080/api/actividades/${idActividad}/evaluar`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`El servidor respondió con código ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert("¡Nota agregada exitosamente!");
        location.reload(); 
    })
    .catch(error => {
        console.error("Error completo:", error);
        alert("No se pudo guardar la nota. Revisa la consola del navegador.");
    });
}

// ========================================================
// 1. VALIDACIÓN REGISTRO DE MIEMBRO
// ========================================================
function validarMiembro(event) {
    event.preventDefault(); 
    
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let tipo = document.getElementById("tipo").value;
    let datoExtra = document.getElementById("dato-extra").value.trim();
    let idComuna = document.getElementById("comuna_id").value; 
    let hayError = false;
    
    document.getElementById("error-nombre").style.display = "none";
    document.getElementById("error-email").style.display = "none";
    document.getElementById("error-tipo").style.display = "none";
    document.getElementById("error-dato-extra").style.display = "none";
    
    if (nombre === "") {
        document.getElementById("error-nombre").style.display = "block";
        hayError = true;
    }
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(email)) {
        document.getElementById("error-email").style.display = "block";
        hayError = true;
    }
    if (tipo === "") {
        document.getElementById("error-tipo").style.display = "block";
        hayError = true;
    }  
    if (datoExtra === "") {
         document.getElementById("error-dato-extra").style.display = "block";
        hayError = true;
    }
    if (idComuna === "") {
        alert("Por favor, selecciona una comuna válida.");
        hayError = true;
    }
    
    if (!hayError) { 
        let datosMiembro = {
            nombre: nombre,
            email: email,
            tipo: tipo,
            datoExtra: parseInt(datoExtra),
            comuna: { id: parseInt(idComuna) }
        };

        fetch('http://localhost:8080/api/miembros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosMiembro)
        })
        .then(response => {
            if(response.ok) {
                window.location.href = "index.html?exito=miembro";
            } else {
                alert("Hubo un problema al registrar el miembro. Verifica los datos.");
            }
        })
        .catch(error => console.error("error:", error));
    }
}

// ========================================================
// 2. VALIDAR FORMULARIO DE INFORMAR ACTIVIDAD
// ========================================================
function validarActividad(event) {
    event.preventDefault(); 
    
    let idMiembro = document.getElementById("miembro_id").value;
    let actividad = document.getElementById("actividad").value.trim();
    let tipoActividad = document.getElementById("tipo-actividad").value; 
    let lugar = document.getElementById("lugar").value.trim(); 
    let archivoInput = document.getElementById("archivo").files[0]; 
    let enlace = document.getElementById("enlace").value.trim();
    let diaSemana = document.getElementById("dia_semana").value;
    let horaActividad = document.getElementById("hora_actividad").value;
    
    let hayError = false;
    
    document.getElementById("error-miembro").style.display = "none";
    document.getElementById("error-actividad").style.display = "none";
    document.getElementById("error-tipo-actividad").style.display = "none";
    document.getElementById("error-dia").style.display = "none";
    document.getElementById("error-lugar").style.display = "none";
    document.getElementById("error-archivo").style.display = "none";
    document.getElementById("error-enlace").style.display = "none"; 
    
    if (idMiembro === "") { document.getElementById("error-miembro").style.display = "block"; hayError = true; }
    if (actividad === "") { document.getElementById("error-actividad").style.display = "block"; hayError = true; }
    if (tipoActividad === "") { document.getElementById("error-tipo-actividad").style.display = "block"; hayError = true; }
    if (diaSemana === "" || horaActividad === "") { document.getElementById("error-dia").style.display = "block"; hayError = true; }
    if (lugar === "") { document.getElementById("error-lugar").style.display = "block"; hayError = true; }
    if (!archivoInput) { document.getElementById("error-archivo").style.display = "block"; hayError = true; }
    const regexLink = /^https?:\/\/.+/;
    if (enlace === "" || !regexLink.test(enlace)) { document.getElementById("error-enlace").style.display = "block"; hayError = true; }
    
    if (!hayError) {
        let formData = new FormData();
        formData.append("nombreActividad", actividad);
        formData.append("tipoActividad", tipoActividad);
        formData.append("lugar", lugar);
        formData.append("enlace", enlace);
        formData.append("horario", diaSemana + " a las " + horaActividad);
        formData.append("creadorId", parseInt(idMiembro));
        formData.append("archivo", archivoInput); 

        fetch('http://localhost:8080/api/actividades', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if(response.ok) {
                window.location.href = "index.html?exito=actividad";
            } else {
                alert("Hubo un problema al crear la actividad.");
            }
        })
        .catch(error => console.error("error:", error));
    }
}

// ========================================================
// 3. CARGA DINÁMICA DE SELECTORES (COMUNAS Y MIEMBROS)
// ========================================================
document.addEventListener("DOMContentLoaded", function() {
    let selectComuna = document.getElementById("comuna_id");
    let selectMiembro = document.getElementById("miembro_id");
    let formMiembro = document.getElementById("form-miembro");
    let formActividad = document.getElementById("form-actividad");

    if (formMiembro) formMiembro.addEventListener("submit", validarMiembro);
    if (formActividad) formActividad.addEventListener("submit", validarActividad);

    if (selectComuna) {
        fetch('http://localhost:8080/api/comunas')
        .then(response => response.json()) 
        .then(comunas => {
            selectComuna.innerHTML = '<option value="">Selecciona Comuna</option>';
            comunas.forEach(comuna => {
                let opcion = document.createElement("option");
                opcion.value = comuna.id; 
                opcion.textContent = comuna.nombre; 
                selectComuna.appendChild(opcion); 
            });
        })
        .catch(error => console.error("error al traer comunas de la bd:", error));
    }

    if (selectMiembro) {
        fetch('http://localhost:8080/api/miembros')
        .then(response => response.json()) 
        .then(miembros => {
            selectMiembro.innerHTML = '<option value="">Selecciona Miembro</option>';
            miembros.forEach(miembro => {
                let opcion = document.createElement("option");
                opcion.value = miembro.id; 
                opcion.textContent = miembro.nombre; 
                selectMiembro.appendChild(opcion); 
            });
        })
        .catch(error => console.error("error al traer miembros de la bd:", error));
    }
});


// ========================================================
// 5. LISTADO DE ACTIVIDADES DEFINITIVO Y RECUPERACIÓN DEL DESTACADO
// ========================================================
document.addEventListener("DOMContentLoaded", function() {
    let tablaActividades = document.getElementById("cuerpo-tabla-actividades");
    let formFiltroActividades = document.getElementById("form-filtro-actividades");
    let selectTipoActividad = document.getElementById("tipo");
    let cajaBusqueda = document.getElementById("caja-busqueda");
    let contenedorDestacado = document.getElementById("actividad-destacada") || document.getElementById("tarjeta-destacada");

    const urlParams = new URLSearchParams(window.location.search);
    let filtroTipo = urlParams.get('tipo') || "";
    let columnaOrden = urlParams.get('sort') || "";

    if (selectTipoActividad && filtroTipo) {
        selectTipoActividad.value = filtroTipo;
    }
    
    let dataTableActividades;

    function renderizarFilas(actividades) {
        if (typeof dataTableActividades !== 'undefined' && dataTableActividades) {
            try {
                dataTableActividades.destroy();
            } catch(e) {
                console.warn("Ignorando error menor de la tabla...");
            }
        }

        let tablaActividadesViva = document.getElementById("cuerpo-tabla-actividades");
        if (!tablaActividadesViva) return;
        tablaActividadesViva.innerHTML = "";

        let textoBusqueda = cajaBusqueda ? cajaBusqueda.value.trim() : "";

        if (!actividades || actividades.length === 0) {
            tablaActividadesViva.innerHTML = "<tr><td colspan='9' style='text-align: center; color: red; font-weight: bold;'>No se encontraron actividades.</td></tr>";
            return;
        }

        actividades.forEach(act => {
            let fila = document.createElement("tr");

            let nombreAct = act.nombre_actividad || act.nombreActividad || "Sin nombre";
            let creadorNombre = act.miembro_nombre || (act.creador ? act.creador.nombre : 'N/A');
            let comunaNombre = act.creador && act.creador.comuna && act.creador.comuna.nombre ? act.creador.comuna.nombre : 'Sin comuna';

            nombreAct = resaltar(nombreAct, textoBusqueda);
            comunaNombre = resaltar(comunaNombre, textoBusqueda);

            let archivoLimpio = act.ruta_archivo || act.rutaArchivo;
            if (archivoLimpio) {
                archivoLimpio = archivoLimpio.split('\\').pop().split('/').pop();
            }
            let archivoCelda = archivoLimpio ? `<a href="http://localhost:8080/uploads/${archivoLimpio}" target="_blank">Ver archivo</a>` : "Sin archivo";
            let enlaceCelda = act.enlace ? `<a href="${act.enlace}" target="_blank">Visitar link</a>` : "Sin enlace";

            let promedioMostrado = "-";
            if (act.notes || act.notas) {
                let listaNotas = act.notas || act.notes;
                if (listaNotas.length > 0) {
                    let suma = listaNotas.reduce((acc, n) => acc + (n.valor || n.nota || 0), 0);
                    promedioMostrado = (suma / listaNotas.length).toFixed(1);
                }
            }

            let botonEvaluar = `<button onclick="evaluarActividad(${act.id})" style="padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Evaluar</button>`;

            fila.innerHTML = `
                <td><strong><a href="/detalle-actividad.html?id=${act.id}" style="color: #007bff; text-decoration: none;">${nombreAct}</a></strong></td>
                <td>${act.tipo_actividad || act.tipoActividad}</td>
                <td>
                    <div>Horario: ${act.horario}</div>
                    <div>Lugar: ${act.lugar}</div>
                </td>
                <td>${archivoCelda}</td>
                <td>${enlaceCelda}</td>
                <td>${creadorNombre}</td>
                <td>${comunaNombre}</td>
                <td style="text-align: center; font-weight: bold; font-size: 1.1em;">${promedioMostrado}</td>
                <td style="text-align: center;">${botonEvaluar}</td>
            `;
            tablaActividadesViva.appendChild(fila);
        });

        const tablaHTML = tablaActividadesViva.closest("table");
        if (tablaHTML && typeof simpleDatatables !== 'undefined') {
            dataTableActividades = new simpleDatatables.DataTable(tablaHTML, {
                perPage: 5,
                searchable: false,
                labels: {
                    placeholder: "Buscar...",
                    perPage: "registros por página",
                    noRows: "No hay registros para mostrar",
                    info: "Mostrando {start} a {end} de {rows} registros"
                }
            });
        }
    }

    function cargarActividades() {
        let textoBusqueda = cajaBusqueda ? cajaBusqueda.value.trim() : "";
        let url = 'http://localhost:8080/api/actividades';
        
        if (textoBusqueda.length >= 3) {
            url = `http://localhost:8080/api/actividades/buscar?q=${encodeURIComponent(textoBusqueda)}`;
        } else {
            let params = [];
            if (filtroTipo) params.push(`tipo=${encodeURIComponent(filtroTipo)}`);
            if (columnaOrden) params.push(`sort=${encodeURIComponent(columnaOrden)}`);
            if (params.length > 0) url += "?" + params.join("&");
        }

        fetch(url)
        .then(response => {
            if (!response.ok) return []; 
            return response.json();
        })
        .then(data => {
            renderizarFilas(data);
            
            if (contenedorDestacado && data.length > 0) {
                let mejorAct = null;
                let maxPromedio = -1;

                data.forEach(act => {
                    let listaNotas = act.notas || act.notes || [];
                    if (listaNotas.length > 0) {
                        let suma = listaNotas.reduce((acc, n) => acc + (n.valor || 0), 0);
                        let prom = suma / listaNotas.length;
                        if (prom > maxPromedio) {
                            maxPromedio = prom;
                            mejorAct = act;
                        }
                    }
                });

                if (mejorAct) {
                    contenedorDestacado.innerHTML = `
                        <div style="padding: 15px; border: 2px solid #ffc107; background-color: #fff9e6; border-radius: 8px;">
                            <h4 style="margin-top:0; color: #b58100;">⭐ Actividad Destacada (Mejor Evaluada)</h4>
                            <p style="font-size: 1.2em; margin: 5px 0;"><strong>${mejorAct.nombreActividad || mejorAct.nombre_actividad}</strong></p>
                        </div>
                    `;
                }
            }
        })
        .catch(error => console.error("Error al cargar actividades:", error));
    }

    if (formFiltroActividades) {
        formFiltroActividades.addEventListener("submit", function(event) {
            event.preventDefault();
            if (selectTipoActividad) {
                filtroTipo = selectTipoActividad.value;
            }
            cargarActividades();
        });
    }

    if (cajaBusqueda) {
        let timeoutBusqueda; 
        
        cajaBusqueda.addEventListener("input", function() {
            let valor = this.value.trim();
            clearTimeout(timeoutBusqueda);
            
            timeoutBusqueda = setTimeout(() => {
                if (valor.length >= 3 || valor.length === 0) {
                    cargarActividades();
                }
            }, 400);
        });
    }

    if (tablaActividades) {
        cargarActividades();
    }
});

// ========================================================
// 6. PERFIL DE MIEMBRO Y SUS ACTIVIDADES
// ========================================================
document.addEventListener("DOMContentLoaded", function() {
    let spanNombre = document.getElementById("perfil-nombre");
    let tablaActividadesMiembro = document.getElementById("tabla-actividades-miembro");

    if (spanNombre && tablaActividadesMiembro) {
        const urlParams = new URLSearchParams(window.location.search);
        const idMiembro = urlParams.get('id');

        if (!idMiembro) {
            spanNombre.innerText = "Error: ID no especificado en la ruta.";
            return;
        }

        fetch(`http://localhost:8080/api/miembros/${idMiembro}`)
        .then(response => response.json())
        .then(miembro => {
            spanNombre.innerText = miembro.nombre;
            document.getElementById("perfil-email").innerText = miembro.email;
            document.getElementById("perfil-tipo").innerText = miembro.tipo;
            document.getElementById("perfil-dato-extra").innerText = miembro.datoExtra || "N/A";
            document.getElementById("perfil-fecha").innerText = miembro.fechaRegistro ? miembro.fechaRegistro.replace('T', ' ') : "Sin fecha";
            document.getElementById("perfil-comuna").innerText = miembro.comuna ? miembro.comuna.nombre : "Sin comuna";
        })
        .catch(error => console.error("Error al cargar el perfil del miembro:", error));

        fetch('http://localhost:8080/api/actividades')
        .then(response => response.json())
        .then(actividades => {
            tablaActividadesMiembro.innerHTML = "";
            
            let susActividades = actividades.filter(act => 
                (act.creador && act.creador.id == idMiembro) || act.miembro_id == idMiembro
            );

            if (susActividades.length === 0) {
                tablaActividadesMiembro.innerHTML = "<tr><td colspan='5' style='text-align: center;'>No tiene actividades informadas.</td></tr>";
                return;
            }

            susActividades.forEach(act => {
                let archivoLimpio = act.ruta_archivo || act.rutaArchivo;
                if (archivoLimpio) archivoLimpio = archivoLimpio.split('\\').pop().split('/').pop();
                
                let archivoCelda = archivoLimpio ? `<a href="http://localhost:8080/uploads/${archivoLimpio}" target="_blank">Ver archivo</a>` : "Sin archivo";
                let enlaceCelda = act.enlace ? `<a href="${act.enlace}" target="_blank">Visitar link</a>` : "Sin enlace";

                let fila = document.createElement("tr");
                fila.innerHTML = `
                    <td><a href="/detalle-actividad.html?id=${act.id}">${act.nombre_actividad || act.nombreActividad}</a></td>
                    <td>${act.tipo_actividad || act.tipoActividad}</td>
                    <td>${act.horario} / ${act.lugar}</td>
                    <td>${archivoCelda}</td>
                    <td>${enlaceCelda}</td>
                `;
                tablaActividadesMiembro.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al cargar las actividades del miembro:", error));
    }
});

// ====== PORTADA: CARGAR ÚLTIMOS 5 MIEMBROS ======
document.addEventListener("DOMContentLoaded", function() {
    const tablaPortada = document.getElementById("tabla-ultimos-miembros");
    const mensajeSinMiembros = document.getElementById("mensaje-sin-miembros");

    if (tablaPortada) {
        fetch('http://localhost:8080/api/miembros')
        .then(response => response.json())
        .then(miembros => {
            tablaPortada.innerHTML = "";
            if (!miembros || miembros.length === 0) {
                if (mensajeSinMiembros) mensajeSinMiembros.style.display = "block";
                return;
            }
            if (mensajeSinMiembros) mensajeSinMiembros.style.display = "none";

            // Ordenamos por fecha de registro descendente para asegurar que sean los "ÚLTIMOS"
            let ultimosCinco = miembros.sort((a, b) => {
                return new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0);
            }).slice(0, 5);

            ultimosCinco.forEach(miembro => {
                let fila = document.createElement("tr");
                let fechaTexto = miembro.fechaRegistro ? miembro.fechaRegistro.replace('T', ' ') : "Sin fecha";

                fila.innerHTML = `
                    <td style="padding: 8px; border: 1px solid #ddd; border-collapse: collapse;"><a href="/perfil-miembro.html?id=${miembro.id}" style="color: #007bff; text-decoration: none; font-weight: bold;">${miembro.nombre}</a></td>
                    <td style="padding: 8px; border: 1px solid #ddd; border-collapse: collapse;">${miembro.email}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; border-collapse: collapse;">${miembro.tipo}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; border-collapse: collapse;">${fechaTexto}</td>
                `;
                tablaPortada.appendChild(fila);
            });
        })
        .catch(error => console.error("Error cargando los últimos 5 miembros:", error));
    }
});