# Tarea 1 - Gestión de Actividades - DCC - Calidad de Vida
CC5002-1 Otoño 2026- Desarrollo de Aplicaciones Web  
Ignacio Dagach Abugattas
Repositorio: https://github.com/ignaciodagachabugattas/desarrollo_web_ignacio_dagach_abugattas/tree/Tarea-1 



## Descripción del Proyecto
Este proyecto es un prototipo de página web para el área de Calidad de Vida del DCC. La idea es tener una plataforma donde la comunidad (estudiantes, profes y funcionarios) pueda registrar y ver las actividades extracurriculares que se hacen en el departamento, para fomentar y potenciar la vida en comunidad.


## Lo que hace
1. **Registro de Miembros:** Hay un formulario que se adapta. Si eliges "Estudiante" (puedes elegir entre pregrado y postgrado) te pide el año de ingreso (a pregrado o postgrado, respectivamente). Lo mismo para "Funcionarios". Y si eliges "Académico", te pide las horas de docencia. 
2. **Registro Actividades:** Hay también un formulario para subir la información de las actividades, incluyendo URL y archivos multimedia.
3. **Listados con Filtros:** Hay tablas (una de personas y otra de actividades). Les puse filtros por tipo y se pueden ordenar al hacer clic en los títulos de las columnas.
4. **Paginación:** Para mantener el orden, las talas son de a 4 filas por página.
5. **Métricas:** En el inicio hay gráficos de barra, e imágenes (propias) para que se vea visualmente cuánta gente hay por categoría, y como serían las actividades.


## Decisiones (Para la corrección)

1. **Paginación y Filtros:** A grandes rasgos, la lógica de estas carácteristicas de las tablas está dada por la función `actualizarTabla()`.
2. **Imágenes:** En las métricas usé fotos de prueba para demostrar cómo se vería el sistema con contenido real. Estas fotos son de mis mascotas, y son tomadas por mi.


## Cómo probarlo
1. Clona el repositorio y muévete a la rama **"Tarea 1"**.
2. Abre el archivo `HTML/0-index.html` en el navegador.
3. Desde ahí puedes moverte por el menú a las otras páginas:
    * `Métricas` (Inicio)
    * `Registrar Miembro` 
    * `Informar Actividad` 
    * `Listado de Miembros` 
    * `Listado de Actividades` 
