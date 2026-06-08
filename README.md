# Tarea 3 - Gestión de Actividades - DCC - Calidad de Vida
CC5002-1 Otoño 2026 - Desarrollo de Aplicaciones Web  
Ignacio Dagach Abugattas  
Repositorio: https://github.com/ignaciodagachabugattas/desarrollo_web_ignacio_dagach_abugattas/tree/Tarea-3

## Descripción del Proyecto
Este proyecto es un prototipo, que mejora la entrega de la tarea anterior (Tarea 2), de una página web para el área de Calidad de Vida del DCC. La idea es tener una plataforma donde la comunidad (estudiantes, profesores y funcionarios) pueda registrar y ver las actividades extracurriculares que se hacen en el departamento, para fomentar y potenciar la vida en comunidad. 

## Actualizaciones importantes
Para esta Tarea 3, se agregaron gráficos interactivos para las estadísticas de la comunidad y un sistema para agregar y ver comentarios en cada actividad. Se agregó también la variable comuna para los miembros, ya que esta es la primera tarea en la que es estrictamente necesaria.

Además, se actualizó el código para solucionar el feedback de las entregas anteriores:
* **Arreglos según comentarios de la Tarea 1:** Se solucionó el problema de los horarios (cambiando el texto libre por selectores de Día y Hora para que no metan cualquier cosa) y se ajustó la validación el servidor en Python para que si llega un "NaN" o texto en los datos extra.
* **Comentarios de la Tarea 2:** no hay

## Lo que hace: Todo lo siguiente con validaciones JavaScript y en el servidor de Python
1. **Registro de Miembros:** Formulario para registro de miembros (ahora protegido contra los NaN en dato extra).
2. **Registro Actividades:** Formulario para registro de actividades (ahora con selectores de día y hora en horario).
3. **Listados con Filtros y Ordenamiento:** Tablas relacionadas que muestran a los miembros y actividades ya registradas con sus filtros y ordenamientos por columna.
4. **Paginación:** Las tablas se muestran de a 5 filas por página para mantener el orden.
5. **Listado de Actividades por Miembro:** Se muestra la información y las actividades de un miembro al hacer clic en su nombre.
6. **Estadísticas con Gráficos:** En la página de estadísticas se cargan 3 gráficos usando la biblioteca Highcharts mediante fetch: uno de líneas para los miembros inscritos por día, uno de torta para los tipos de actividades y uno de barras para ver las actividades por comuna. Al final hay un botón para volver al inicio.
7. **Comentarios:** En el detalle de cada actividad se pueden ver los comentarios existentes (con su fecha y nombre) y hay un botón con el texto “Agregar comentario”. Todo funciona con fetch.

## Decisiones (Para la corrección)
1. no hay
