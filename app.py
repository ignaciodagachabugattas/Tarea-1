from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from datetime import datetime
import os
import re 
from werkzeug.utils import secure_filename



# abrimos Flask y SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/Imagenes'
db = SQLAlchemy(app)



# bases de datos necesarias
class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    comunas = db.relationship('Comuna', backref='region', lazy=True)

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)
    miembros = db.relationship('Miembro', backref='comuna_obj', lazy=True)

class Miembro(db.Model):
    __tablename__ = 'miembro'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False) # Conexión real a la tabla comuna
    dato_extra = db.Column(db.Integer)
    fecha_registro = db.Column(db.DateTime, default=datetime.now)
    actividades = db.relationship('Actividad', backref='creador', lazy=True)


class Actividad(db.Model):
    __tablename__ = 'actividad'
    id = db.Column(db.Integer, primary_key=True)
    nombre_actividad = db.Column(db.String(100), nullable=False)
    tipo_actividad = db.Column(db.String(50), nullable=False)
    horario = db.Column(db.String(100), nullable=False)
    lugar = db.Column(db.String(100), nullable=False)
    ruta_archivo = db.Column(db.String(255), nullable=False)
    enlace = db.Column(db.String(255), nullable=False)
    miembro_id = db.Column(db.Integer, db.ForeignKey('miembro.id'), nullable=False)
    comentarios = db.relationship('Comentario', backref='actividad', lazy=True, cascade="all, delete-orphan")

class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.String(300), nullable=False)
    fecha = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False) 
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)

# pagina de inicio que muestra los últimos 5 miembros registrados
@app.route('/')
def inicio():
    ultimos_5 = Miembro.query.order_by(Miembro.fecha_registro.desc()).limit(5).all()
    return render_template('0-index.html', miembros=ultimos_5)



# registrar miembros con validación en servidor 
@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form.get('nombre', '').strip()
        email = request.form.get('email', '').strip()
        tipo = request.form.get('tipo', '').strip()
        comuna_id = request.form.get('comuna_id', '').strip()
        dato_extra_form = request.form.get('dato_extra', '').strip()
        errores = {}

       # validación 
        if not nombre: errores['nombre'] = "El nombre es obligatorio."
        regex_email = r"^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not email or not re.match(regex_email, email): 
            errores['email'] = "Email inválido."
        if not tipo: errores['tipo'] = "Selecciona un tipo."
        if not comuna_id: errores['comuna'] = "Selecciona una comuna."
        if not dato_extra_form: 
                    errores['dato_extra'] = "Dato específico es obligatorio."
        else:
            try:
                # trabajamos los NaN y los valores no numéricos
                dato_extra_val = int(dato_extra_form)
            except ValueError:
                errores['dato_extra'] = "El dato específico debe ser un número entero válido."

        if errores:
            # si hay errores, regresamos los datos ingresados y los mensajes de error
            datos_ingresados = {'nombre': nombre, 'email': email, 'tipo': tipo, 'comuna_id': comuna_id, 'dato_extra': dato_extra_form}
            # pedimos las comunas de nuevo para rellenar el select
            lista_comunas = Comuna.query.order_by(Comuna.nombre.asc()).all()
            return render_template('1-registrar-miembro.html', errores=errores, datos=datos_ingresados, comunas=lista_comunas)

        # si todo está bien, guardamos:
        dato_extra_val = int(dato_extra_form)

        nuevo_miembro = Miembro(
            nombre=nombre,
            email=email,
            tipo=tipo,
            comuna_id=int(comuna_id),
            dato_extra=dato_extra_val
        )
        db.session.add(nuevo_miembro)
        db.session.commit()
        # mensaje de éxito  y volver al inicio
        return redirect(url_for('inicio', miembro_exito=1))
    
    # si es GET, enviamos las comunas ordenadas alfabéticamente
    lista_comunas = Comuna.query.order_by(Comuna.nombre.asc()).all()
    return render_template('1-registrar-miembro.html', errores={}, datos={}, comunas=lista_comunas)



# registrar actividad con validación en servidor 

# extensiones permitidas
EXTENSIONES_FOTO = {'png', 'jpg', 'jpeg', 'gif'}
EXTENSIONES_VIDEO = {'mp4', 'avi', 'mov', 'webm'}

# función para verificar el tipo de archivo
def obtener_tipo_archivo(filename):
    if '.' in filename:
        ext = filename.rsplit('.', 1)[1].lower()
        if ext in EXTENSIONES_FOTO:
            return 'foto'
        elif ext in EXTENSIONES_VIDEO:
            return 'video'
    return None


@app.route('/actividades', methods=['GET', 'POST'])
def actividades():
    if request.method == 'POST':
        miembro_id = request.form.get('miembro_id', '').strip()
        nombre_actividad = request.form.get('nombre_actividad', '').strip()
        tipo_actividad = request.form.get('tipo_actividad', '').strip()
        lugar = request.form.get('lugar', '').strip()
        enlace = request.form.get('enlace', '').strip()
        archivo = request.files.getlist('archivo')
        
        # cambiamos días y horarios 
        dia_semana = request.form.get('dia_semana', '').strip()
        hora_actividad = request.form.get('hora_actividad', '').strip()
        
        errores = {}
        
       # validación 
        if not dia_semana or not hora_actividad:
            errores['horario'] = "Debes seleccionar tanto el día como la hora."
            horario = ""
        else:
            horario = f"{dia_semana} a las {hora_actividad}"
        
        regex_enlace = r"^https?://.+"

        if not miembro_id: errores['miembro'] = "Debes seleccionar un miembro."
        if not nombre_actividad: errores['actividad'] = "Nombre de actividad obligatorio."
        if not tipo_actividad: errores['tipo_actividad'] = "Selecciona un tipo."
        if not horario: errores['horario'] = "Horario obligatorio."
        if not lugar: errores['lugar'] = "Lugar obligatorio."
        
        if not enlace or not re.match(regex_enlace, enlace): 
            errores['enlace'] = "Debe ingresar un enlace válido que comience con http:// o https://"
            
        if len(archivo) == 0 or archivo[0].filename == '': errores['archivo'] = "Debes subir un archivo."        
        # contadores 
        fotos = 0
        videos = 0
        
        # revisamos los aerchivos subidos
        for f in archivo:
            nombre = f.filename.lower()
            
            if nombre == '': 
                continue 
                
            # verificar archivos validos
            if nombre.endswith('.jpg') or nombre.endswith('.jpeg') or nombre.endswith('.png'):
                fotos += 1
            elif nombre.endswith('.mp4') or nombre.endswith('.avi'):
                videos += 1
            else:
                errores['archivo'] = "Archivo inválido. Solo se acepta .jpg, .png, .mp4 o .avi"
                
        # maximo de cada 1
        if fotos > 1:
            bytes_error = "Máximo 1 foto permitida."
            errores['archivo'] = bytes_error
        if videos > 1:
            errores['archivo'] = "Máximo 1 video permitido."
        if fotos == 0 and videos == 0:
            errores['archivo'] = "Debes subir al menos un archivo (foto o video)."
        # si hay errores, regresamos los datos ingresados y los mensajes de error
        if errores:
            datos_ingresados = {
                'miembro_id': miembro_id, 'nombre_actividad': nombre_actividad, 
                'tipo_actividad': tipo_actividad, 'horario': horario, 
                'lugar': lugar, 'enlace': enlace
            }
            lista_miembros = Miembro.query.all()
            return render_template('2-informar-actividad.html', miembros=lista_miembros, errores=errores, datos=datos_ingresados)

        # guardar el archivos
        nombres_para_bd = ""
        
        for f in archivo:
            if f.filename != '':
                ruta_guardado = os.path.join(app.config['UPLOAD_FOLDER'], f.filename)
                f.save(ruta_guardado)
                nombres_para_bd += f.filename + ","
                
        nombres_para_bd = nombres_para_bd.strip(",")

        # guardar los datos en la base de datos
        nueva_actividad = Actividad(
            nombre_actividad=nombre_actividad,
            tipo_actividad=tipo_actividad,
            horario=horario,
            lugar=lugar,
            ruta_archivo=nombres_para_bd,
            enlace=enlace,
            miembro_id=int(miembro_id)
        )
        db.session.add(nueva_actividad)
        db.session.commit()
        # mensaje de éxito  y volver al inicio
        return redirect(url_for('inicio', actividad_exito=1))

    # si es get pedimos la lista completa 
    lista_miembros = Miembro.query.all()
    return render_template('2-informar-actividad.html', miembros=lista_miembros, errores={}, datos={})



# listado de miembros y actividades con paginación, ordenamiento y filtrado
@app.route('/listado-miembros')
def listado_miembros():
    page = request.args.get('page', 1, type=int)
    sort_by = request.args.get('sort', 'fecha')
    filtro_tipo = request.args.get('tipo', '')  
    query = Miembro.query

    # si hay filtro, filtramos
    if filtro_tipo:
        query = query.filter(Miembro.tipo == filtro_tipo)

    # ordenamos
    if sort_by == 'nombre':
        query = query.order_by(Miembro.nombre.asc())
    elif sort_by == 'email':
        query = query.order_by(Miembro.email.asc())
    elif sort_by == 'tipo':
        query = query.order_by(Miembro.tipo.asc())
    else:
        query = query.order_by(Miembro.fecha_registro.desc())

    # paginación
    miembros_paginados = query.paginate(page=page, per_page=5, error_out=False)
    
    # mandamos a HTML para mostar
    return render_template('3-listado-miembros.html', miembros=miembros_paginados, sort_by=sort_by, filtro_tipo=filtro_tipo)



# listado de actividades com paginación, ordenamiento y filtrado por tipo de actividad
@app.route('/listado-actividades')
def listado_actividades():
    page = request.args.get('page', 1, type=int)
    filtro_tipo = request.args.get('tipo', '') # filtramos
    orden_col = request.args.get('sort', 'id') # por defecto ordenamos por id
    orden_dir = request.args.get('dir', 'desc') # por defecto descendente (los más nuevos primero)

    query = Actividad.query
    
    # si hay filtro, filttramos
    if filtro_tipo:
        query = query.filter(Actividad.tipo_actividad == filtro_tipo)

    # ordenamos
    if orden_col == 'nombre':
        if orden_dir == 'asc':
            query = query.order_by(Actividad.nombre_actividad.asc())
        else:
            query = query.order_by(Actividad.nombre_actividad.desc())
            
    elif orden_col == 'tipo':
        if orden_dir == 'asc':
            query = query.order_by(Actividad.tipo_actividad.asc())
        else:
            query = query.order_by(Actividad.tipo_actividad.desc())
            
    else: # orden por defecto 
        if orden_dir == 'asc':
            query = query.order_by(Actividad.id.asc())
        else:
            query = query.order_by(Actividad.id.desc())

    # paginación
    actividades_paginadas = query.paginate(page=page, per_page=5, error_out=False)
    
    # mandamos a HTML para mostar
    return render_template('4-listado-actividades.html', 
                           actividades=actividades_paginadas, 
                           filtro_tipo=filtro_tipo,
                           sort=orden_col,
                           dir=orden_dir)


# lisatdo de actividades por miembros
@app.route('/actividades-miembro/<int:id_miembro>')
def actividades_por_miembro(id_miembro):
    # guardamos la data del miembro y sus actividades
    miembro = Miembro.query.get_or_404(id_miembro) 
    actividades_del_miembro = Actividad.query.filter_by(miembro_id=id_miembro).all() 
    # mandomos al html
    return render_template('5-actividades-miembro.html', miembro=miembro, actividades=actividades_del_miembro)


# ruta que muestra el HTML de estadisticas
@app.route('/estadisticas')
def estadisticas():
    return render_template('6-estadisticas.html')


# garficos
@app.route('/api/datos-graficos')
def api_datos_graficos():
    # grafico 1: miembros registrados por día (líneas)
    miembros_dia = db.session.query(
        func.date(Miembro.fecha_registro), 
        func.count(Miembro.id)
    ).group_by(func.date(Miembro.fecha_registro)).all()
    
    datos_lineas = {
        "labels": [str(m[0]) for m in miembros_dia], 
        "data": [m[1] for m in miembros_dia]         
    }

    # grafico 2: total de actividades por tipo (torta)
    actividades_tipo = db.session.query(
        Actividad.tipo_actividad, 
        func.count(Actividad.id)
    ).group_by(Actividad.tipo_actividad).all()
    
    datos_torta = {
        "labels": [a[0] for a in actividades_tipo],
        "data": [a[1] for a in actividades_tipo]
    }

    # grafico 3: total de actividades registradas por comuna (barras)
    actividades_comuna = db.session.query(
        Comuna.nombre, 
        func.count(Actividad.id)
    ).join(Miembro, Comuna.id == Miembro.comuna_id)\
     .join(Actividad, Miembro.id == Actividad.miembro_id)\
     .group_by(Comuna.nombre).all()
    
    datos_barras = {
        "labels": [c[0] for c in actividades_comuna], 
        "data": [c[1] for c in actividades_comuna]    
    }

    return jsonify({
        "lineas": datos_lineas,
        "torta": datos_torta,
        "barras": datos_barras
    })

# ruta para ver el detalle de una actividad específica
@app.route('/actividad/<int:id_actividad>')
def detalle_actividad(id_actividad):
    # buscamos la actividad por su id
    actividad = Actividad.query.get_or_404(id_actividad)
    return render_template('7-detalle-actividad.html', actividad=actividad)

# API GET: obtiene los comentarios
@app.route('/api/actividad/<int:id_actividad>/comentarios', methods=['GET'])
def api_obtener_comentarios(id_actividad):
    comentarios = Comentario.query.filter_by(actividad_id=id_actividad).order_by(Comentario.fecha.desc()).all()
    # transformamos a diccionario para mandarlo a Javascript
    datos = [{
        "nombre": c.nombre,
        "texto": c.texto,
        "fecha": c.fecha.strftime("%Y-%m-%d %H:%M:%S")
    } for c in comentarios]
    return jsonify(datos)

# API POST: recibe y valida un nuevo comentario desde JS
@app.route('/api/actividad/<int:id_actividad>/comentarios', methods=['POST'])
def api_agregar_comentario(id_actividad):
    datos = request.get_json()
    nombre = datos.get('nombre', '').strip()
    texto = datos.get('texto', '').strip()
    
    errores = {}
    
    # validación
    if len(nombre) < 3 or len(nombre) > 80:
        errores['nombre'] = "El nombre debe tener entre 3 y 80 caracteres."
    if len(texto) < 5:
        errores['texto'] = "El comentario debe tener al menos 5 caracteres."
        
    if errores:
        # retornamos error 400 y los mensajes para que JS los muestre
        return jsonify({"status": "error", "errores": errores}), 400
        
    # si todo está bien, guardamos en la base de datos
    nuevo_comentario = Comentario(nombre=nombre, texto=texto, actividad_id=id_actividad)
    db.session.add(nuevo_comentario)
    db.session.commit()
    
    return jsonify({"status": "success", "mensaje": "Comentario agregado."}), 201

if __name__ == '__main__':
    with app.app_context():
        # creamos tablas
        db.create_all()  
    app.run(debug=True)