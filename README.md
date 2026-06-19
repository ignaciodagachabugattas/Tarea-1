# Tarea 4 - Gestión de Actividades - DCC - Calidad de Vida
CC5002-1 Otoño 2026 - Desarrollo de Aplicaciones Web  
Ignacio Dagach Abugattas  
Repositorio: https://github.com/ignaciodagachabugattas/desarrollo_web_ignacio_dagach_abugattas/tree/Tarea-4

## Descripción del Proyecto
Este proyecto es una evolución directa de las entregas anteriores para la plataforma de la sección de Calidad de Vida del DCC. Permite a la comunidad (estudiantes, profesores y funcionarios) registrar, buscar, evaluar y comentar actividades extracurriculares con el fin de potenciar la vida en comunidad dentro del departamento.

## Actualizaciones con respecto a la Tarea 3

* **Migración del Backend:** Se migró el servidor previo (Python) hacia el framework **Spring Boot (Java 17)**, utilizando **JPA** para la comunicación con la base de datos.
* **Continuidad del Sistema:** Se mantuvo intacto todo lo de las tareas anteriores.
* **Nuevas Funcionalidades Asíncronas:** Se implementó un motor de búsqueda predictiva en tiempo real y un sistema de notas para las actividades.



## Características Principales Nuevas

### Buscador de actividades
* **Búsqueda automática:** Tiene un único cuadro de texto. Al escribir 3 o más letras, empieza a buscar automáticamente en el servidor.
* **Dónde busca:** Encuentra coincidencias en el nombre de la actividad o el nombre de la comuna.
* **Resaltado:** Destaca con color el texto que coincide con lo que el usuario escribió.
* **Si no hay resultados:** Muestra un mensaje avisando que no se encontró nada.

### Sistema de notas
* **Ver promedio:** Cada actividad muestra su promedio de notas actual. Si nadie la ha evaluado todavía, aparece un "-".
* **Botón Evaluar:** Al hacer clic, pide al usuario ingresar una nota. El código asegura que sea solo un número entero entre 1 y 7.
* **Actualización al tiro:** Al guardar la nota, el promedio y la interfaz se recalculan y actualizan automáticamente con JavaScript, sin necesidad de recargar la página completa.
