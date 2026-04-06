// campo extra en registro de miembro
function cambiarCampoExtra() {
    let tipoSeleccionado = document.getElementById("tipo").value;
    let divExtra = document.getElementById("div-extra");
    let labelExtra = document.getElementById("label-extra");
    // dependiendo del tipo seleccionado, hacemos la buena pregunta extra
    if (tipoSeleccionado === "pregrado" || tipoSeleccionado === "postgrado") {
        labelExtra.innerText = "Año de ingreso (Ej: 2020) (*):";
        divExtra.style.display = "block"; 
    } 
    else if (tipoSeleccionado === "academico") {
        labelExtra.innerText = "Cantidad de horas de docencia (Ej: 12) (*):";
        divExtra.style.display = "block"; 
    } 
    else if (tipoSeleccionado === "funcionario") {
        labelExtra.innerText = "Año de contratación (Ej: 2020) (*):";
        divExtra.style.display = "block"; 
    } 
    else {
        divExtra.style.display = "none"; 
    }
}


// validación registro de miembro
function validarMiembro(event) {
    event.preventDefault(); // evita que recargue la página
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let tipo = document.getElementById("tipo").value;
    let datoExtra = document.getElementById("dato-extra").value.trim();
    let hayError = false;
    // ocultar errores previos
    document.getElementById("error-nombre").style.display = "none";
    document.getElementById("error-email").style.display = "none";
    document.getElementById("error-tipo").style.display = "none";
    // validaciones
    if (nombre === "") { // nombre vacio
        document.getElementById("error-nombre").style.display = "block";
        hayError = true;
    }
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(email)) { // el email debe cumplir *@*.**
        document.getElementById("error-email").style.display = "block";
        hayError = true;
    }
    if (tipo === "") { // sin tipo
        document.getElementById("error-tipo").style.display = "block";
        hayError = true;
    }  

    if (datoExtra === "") { // sin dato extra
         document.getElementById("error-dato-extra").style.display = "block";
        hayError = true;
    }
    if (!hayError) { 
        alert("¡Miembro registrado con éxito!");
        document.getElementById("form-miembro").reset();
        document.getElementById("div-extra").style.display = "none"; // ocultar campo extra al resetear
    }
}


// validar formulario de Informar Actividad
function validarActividad(event) {
    event.preventDefault(); // evita que recargue la página
    let actividad = document.getElementById("actividad").value.trim();
    let tipoActividad = document.getElementById("tipo-actividad").value; 
    let dia = document.getElementById("dia").value.trim();
    let lugar = document.getElementById("lugar").value.trim(); 
    let archivo = document.getElementById("archivo").value;
    let enlace = document.getElementById("enlace").value.trim();
    let hayError = false;
    // ocultar errores previos
    document.getElementById("error-actividad").style.display = "none";
    document.getElementById("error-tipo-actividad").style.display = "none";
    document.getElementById("error-dia").style.display = "none";
    document.getElementById("error-lugar").style.display = "none";
    document.getElementById("error-archivo").style.display = "none";
    document.getElementById("error-enlace").style.display = "none"; 
    // validaciones
    if (actividad === "") { // actividad vacía
        document.getElementById("error-actividad").style.display = "block";
        hayError = true;
    }
    if (tipoActividad === "") { // sin tipo de actividad
        document.getElementById("error-tipo-actividad").style.display = "block";
        hayError = true;
    }
    if (dia === "") { // sin día ni fecha
        document.getElementById("error-dia").style.display = "block";
        hayError = true;
    }
    if (lugar === "") { // sin lugar
        document.getElementById("error-lugar").style.display = "block";
        hayError = true;
    }
    if (archivo === "") { // si no sube foto o video
        document.getElementById("error-archivo").style.display = "block";
        hayError = true;
    }
    // expresión regular: busca un punto seguido de al menos 2 letras
    const regexLink = /\.[a-zA-Z]{2,}$/;
    if (enlace === "" || !regexLink.test(enlace)) {
        document.getElementById("error-enlace").style.display = "block";
        hayError = true;
        }
    if (!hayError) {
        alert("¡Actividad registrada con éxito!");
        document.getElementById("form-actividad").reset();
    }
}

// ordenar tablas
function ordenarTabla(columna, idCuerpoTabla) {
    // agarramos las filas 
    let tbody = document.getElementById(idCuerpoTabla);
    let filas = Array.from(tbody.getElementsByTagName("tr"));
    // las ordenamos
    filas.sort(
        function(filaA, filaB) {
            let textoA = filaA.getElementsByTagName("td")[columna].innerText.toLowerCase();
            let textoB = filaB.getElementsByTagName("td")[columna].innerText.toLowerCase();
            if (textoA < textoB) return -1;
            if (textoA > textoB) return 1;
            return 0; 
        }
    );
    // las volvemos a agregar al tbody en el nuevo orden
    for (let i = 0; i < filas.length; i++) {
        tbody.appendChild(filas[i]);
    }
        if (document.getElementById('info-pagina')) {
        paginaActual = 1;
        actualizarTabla(); 
    }
}



let paginaActual = 1; 
const filasPorPagina = 4; 

// ante cualqueir cosa actualizamos las tablas (filtro o cambio de página)
function actualizarTabla() {
    // ver si queremos filtrar por actividades o por miembros
    const esPaginaActividades = document.getElementById('filtro-actividad') !== null;
    const idFiltro = esPaginaActividades ? 'filtro-actividad' : 'filtro-tipo';
    const claseFila = esPaginaActividades ? '.fila-actividad' : '.fila-miembro';   
    
    // si hay filtro bien, sino mostrar todo
    const selectorFiltro = document.getElementById(idFiltro);
    const valorFiltro = selectorFiltro ? selectorFiltro.value : 'todos';
    
    // agarrr las filas
    const todasLasFilas = document.querySelectorAll(claseFila);
    let filasQueCumplenFiltro = [];


    // por cada fila, ver si cumple el filtro 
    todasLasFilas.forEach(fila => {
        // Leemos el atributo personalizado 'data-tipo' de la fila (ej: "pregrado", "deportivo")
        const tipoFila = fila.getAttribute('data-tipo');
        let cumpleFiltro = false; // Empezamos asumiendo que la fila no cumple

        if (valorFiltro === 'todos') {
            cumpleFiltro = true;
        } else if (valorFiltro === 'pregrado-postgrado' && (tipoFila === 'pregrado' || tipoFila === 'postgrado')) {
            cumpleFiltro = true;
        } else if (tipoFila === valorFiltro) {
            cumpleFiltro = true;
        }

        // si cumple filtro, la guardamos, sino la ocultamos 
        if (cumpleFiltro) {
            filasQueCumplenFiltro.push(fila);
        } else {
            fila.style.display = 'none'; 
        }
    });


    // total de paginas
    const totalPaginas = Math.ceil(filasQueCumplenFiltro.length / filasPorPagina) || 1; 
    
    // si el filtro borra mucos datos, podemos quedar en una página que ya no existe, entonces volvemos a la 1 (en todo caso siempre volvemos a la 1)
    if (paginaActual > totalPaginas) {
        paginaActual = 1;
    }

    // índices de las filas a mostrar 
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;

    // mostar solo las filas que pasaron el filtro y están en la buena página
    filasQueCumplenFiltro.forEach((fila, index) => {
        if (index >= inicio && index < fin) {
            fila.style.display = ''; 
        } else {
            fila.style.display = 'none'; 
        }
    });

    
    // si estamos en una pagina donde se muestran tablas (vista por paginas)
    if (document.getElementById('info-pagina')) {
        // creamos el texto 
        document.getElementById('info-pagina').innerText = `Página ${paginaActual} de ${totalPaginas}`;
        
        // descativamos botones en casos bordes 
        document.getElementById('btn-anterior').disabled = (paginaActual === 1);
                document.getElementById('btn-siguiente').disabled = (paginaActual === totalPaginas || filasQueCumplenFiltro.length === 0);
    }
}





// funcion para cambiar de página (recibe +-1)
function cambiarPagina(direccion) {
    paginaActual += direccion;
    actualizarTabla();
}

// función tal que al filtrar siempre vovlamos a la pag 1
function filtrarActividades() {
    paginaActual = 1; 
    actualizarTabla(); 
}

// función tal que al filtrar siempre vovlamos a la pag 1
function filtrarListado() {
    paginaActual = 1; 
    actualizarTabla(); 
}

// al iniciar cada pagina
document.addEventListener('DOMContentLoaded', () => {
    // si la página en la que estamos tiene, tablas las ordenamos 
    if (document.getElementById('info-pagina')) {
        actualizarTabla();
    }
});