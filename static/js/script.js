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
    document.getElementById("error-dato-extra").style.display = "none";
    
    // validaciones
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
    
    if (!hayError) { 
        // si todo está bien, enviamos a python
        document.getElementById("form-miembro").submit(); 
    }
}


// validar formulario de Informar Actividad
function validarActividad(event) {
    event.preventDefault(); 
    
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
    if (actividad === "") {
        document.getElementById("error-actividad").style.display = "block";
        hayError = true;
    }
    if (tipoActividad === "") {
        document.getElementById("error-tipo-actividad").style.display = "block";
        hayError = true;
    }
    if (dia === "") {
        document.getElementById("error-dia").style.display = "block";
        hayError = true;
    }
    if (lugar === "") {
        document.getElementById("error-lugar").style.display = "block";
        hayError = true;
    }
    if (archivo === "") {
        document.getElementById("error-archivo").style.display = "block";
        hayError = true;
    }
    
    // enlace debe empezar con http:// o https:// seguido de algo más
    const regexLink = /^https?:\/\/.+/;
    if (enlace === "" || !regexLink.test(enlace)) {
        document.getElementById("error-enlace").style.display = "block";
        hayError = true;
    }
    
    if (!hayError) {
        // si todo está bien, enviamos  a python
        document.getElementById("form-actividad").submit();
    }
}