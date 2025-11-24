# Frontend - Auto Track

Frontend desarrollado en React para el Sistema de Alquiler de Vehículos.

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn
- Backend corriendo en Docker o localmente en `http://localhost:5000`

### Pasos para ejecutar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   
   Crea un archivo `.env` en la raíz del proyecto (o copia `.env.example`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_API_TIMEOUT=30000
   ```
   
   **Nota:** Si tu backend está corriendo en Docker, asegúrate de que el puerto 5000 esté expuesto y accesible desde `localhost:5000`.

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   La aplicación estará disponible en `http://localhost:3000`

### Asegúrate de que el backend esté corriendo

El frontend se conecta al backend en `http://localhost:5000` (o la URL configurada en `.env`). 

**Para Docker:**
```bash
# En el directorio del backend
docker compose up
```

**Para desarrollo local:**
```bash
# En el directorio del backend
python app.py
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables (Layout, estilos)
│   ├── pages/          # Páginas principales de la aplicación
│   ├── services/       # Servicios API para comunicación con backend
│   ├── config/         # Configuración (API, variables de entorno)
│   ├── utils/          # Utilidades (formateo de fechas, validadores)
│   ├── App.jsx         # Componente principal con rutas
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── .env                # Variables de entorno (no versionar)
```

## 🎨 Características

- **CRUD completo** para todas las entidades:
  - Clientes
  - Vehículos
  - Alquileres
  - Reservas
  - Empleados
  - Marcas
  - Modelos
  - Multas

- **Interfaz moderna y responsiva** con diseño limpio
- **Navegación intuitiva** entre secciones con pestañas modernas
- **Formularios validados** para crear y editar registros
- **Manejo de errores** y estados de carga mejorados
- **Filtros** para vehículos por estado
- **Sistema de autenticación** con inicio de sesión JWT
- **Validaciones** de patentes argentinas y formateo de fechas
- **Animaciones y microinteracciones** profesionales

## 🔧 Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **React Router** - Enrutamiento para aplicaciones React
- **Vite** - Herramienta de construcción rápida
- **CSS3** - Estilos modernos y responsivos
- **React Icons** - Iconos para la interfaz

## 🔌 Configuración de Conexión con Backend

### Opción 1: Usar variables de entorno (Recomendado)

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

### Opción 2: Usar Proxy de Vite (Alternativa)

Si tienes problemas de CORS, puedes usar el proxy configurado en `vite.config.js`:

1. Cambia `VITE_API_BASE_URL` en `.env` a `/api`
2. El proxy redirigirá automáticamente las peticiones a `http://localhost:5000`

### Verificar Conexión

El frontend intentará conectarse automáticamente al backend. Si hay problemas:

1. Verifica que el backend esté corriendo: `curl http://localhost:5000/health` (si existe)
2. Verifica que el puerto 5000 esté accesible
3. Revisa la consola del navegador para errores de CORS o conexión

## 📝 Notas

- El frontend está configurado para conectarse al backend en `http://localhost:5000` por defecto
- Si el backend está en otro puerto o dominio, modifica `VITE_API_BASE_URL` en `.env`
- Los estilos están organizados en archivos CSS separados para mejor mantenibilidad
- El sistema de autenticación usa JWT almacenado en localStorage

## 🐛 Solución de Problemas

### Error: "No se pudo conectar con el servidor"
- Verifica que el backend esté corriendo
- Verifica que el puerto 5000 esté accesible
- Revisa la configuración en `.env`

### Error de CORS
- Asegúrate de que el backend tenga CORS configurado para permitir `http://localhost:3000`
- O usa el proxy de Vite configurado en `vite.config.js`

### Error 401 (No autorizado)
- Verifica que el token JWT sea válido
- Inicia sesión nuevamente si el token expiró
