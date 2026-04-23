# Tarea 2 - Gestión de Actividades - DCC - Calidad de Vida
CC5002-1 Otoño 2026- Desarrollo de Aplicaciones Web  
Ignacio Dagach Abugattas
Repositorio: https://github.com/ignaciodagachabugattas/desarrollo_web_ignacio_dagach_abugattas/tree/Tarea-2


## Descripción del Proyecto
Este proyecto es un prototipo, que mejora la entrega de la tarea anterior, de una página web para el área de Calidad de Vida del DCC. La idea es tener una plataforma donde la comunidad (estudiantes, profes y funcionarios) pueda registrar y ver las actividades extracurriculares que se hacen en el departamento, para fomentar y potenciar la vida en comunidad. 


## Actualizaciones importantes
Ahora se cuenta con un servidor Python (Flask) y una base de datos (MySQL) para la implementación de la página, sumado a lo previamente realizado con HTML, JavaScript y CSS.


## Lo que hace: Todo lo siguiente con validaciones JavaScript y en el servidor de Python
1. **Registro de Miembros:** Formulario para registro de miembros
2. **Registro Actividades:** Formulario para registro de actividades
3. **Listados con Filtros y Ordenamiento:** Tablas relacionadas que muestran a los miembros y actividades ya registradas. Cuentan con filtros por tipo y se pueden ordenar al hacer clic en los títulos de las columnas. En la página de presentación se muestran a los últimos 5 miembros registrados y se muestran estadísticas de la comunidad. 
4. **Paginación:** Para mantener el orden, las tablas son de a 5 filas por página.
5. **Listado de Actividades por Miembro:** Como es pedido en el enunciado, se muestran la información y las actividades de un miembro al hacer clic en su nombre en la tabla de Miembros.


## Decisiones (Para la corrección)
1. El enunciado menciona que al hacer clic "sobre una fila" se debe mostrar la información y actividades del miembro desde la base de datos. En mi desarrollo, esta acción se realiza haciendo clic en el nombre del miembro (como se avisa en la misma página). Tomé esta decisión simplemente por un tema estético y para mantener el orden de la tabla. En resumen, se cumple el mismo objetivo técnico y el espíritu de lo pedido, pero en vez de dejar clickeable toda la fila, lo acoté solo al nombre porque queda mucho más limpio.