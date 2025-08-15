# 🚀 Guía Completa de Despliegue en GitHub para FaceYoga AI+
## Para usuarios sin conocimientos técnicos - Paso a paso detallado

### 📋 ÍNDICE
1. [Requisitos Previos](#requisitos-previos)
2. [Crear Cuenta en GitHub](#crear-cuenta-en-github)
3. [Instalar Git en tu Computadora](#instalar-git-en-tu-computadora)
4. [Configurar Git por Primera Vez](#configurar-git-por-primera-vez)
5. [Subir el Proyecto a GitHub](#subir-el-proyecto-a-github)
6. [Verificar que Todo Funciona](#verificar-que-todo-funciona)
7. [Cómo Trabajar con Claude en Futuros Chats](#cómo-trabajar-con-claude-en-futuros-chats)
8. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

---

## 🎯 REQUISITOS PREVIOS

### ✅ Lo que necesitas ANTES de empezar:
- Una computadora con Windows, Mac o Linux
- Conexión a internet
- Una cuenta de correo electrónico (Gmail, Outlook, etc.)
- Aproximadamente 30-45 minutos de tiempo

### ❌ Lo que NO necesitas:
- Conocimientos de programación
- Experiencia con GitHub o Git
- Software complicado
- Dinero (todo es gratis)

---

## 📧 CREAR CUENTA EN GITHUB

### Paso 1: Ir a GitHub
1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. Ve a: [https://github.com](https://github.com)
3. Haz clic en el botón "**Sign up**" en la esquina superior derecha

### Paso 2: Completar el Registro
1. **Username**: Elige un nombre de usuario (ej: `mi-nombre-2025`)
   - Ejemplos: `maria-gonzalez-2025`, `juan-perez-dev`, `faceyoga-user`
   - Este será tu nombre público en GitHub

2. **Email address**: Ingresa tu correo electrónico
   - Usa un correo que puedas acceder (te enviarán un código de verificación)

3. **Password**: Crea una contraseña segura
   - Debe tener al menos 8 caracteres
   - Usa letras mayúsculas, minúsculas, números y símbolos
   - Ejemplo: `FaceYoga2025!Segura`

4. **Email verification**: Revisa tu correo y haz clic en el enlace de verificación

### Paso 3: Configurar tu Perfil
1. GitHub te pedirá más información:
   - **Nombre completo**: Ingresa tu nombre real
   - **¿Ya sabes programar?**: Selecciona "No, todavía no"
   - **¿Qué te interesa?**: Selecciona opciones relacionadas con salud/belleza/tecnología

2. Haz clic en "**Complete setup**"

### Paso 4: Verificar tu Email
1. Revisa tu bandeja de entrada (y carpeta de spam)
2. Busca un email de GitHub con el asunto "Please verify your email address"
3. Haz clic en el botón de verificación en el email

---

## 💻 INSTALAR GIT EN TU COMPUTADORA

Git es una herramienta que te permite subir tus archivos a GitHub. No te preocupes, es como instalar cualquier programa.

### 🔧 Para Windows:

#### Método 1: Descargar Directo (Recomendado)
1. Ve a: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Haz clic en "**Download for Windows**"
3. Se descargará un archivo `.exe`
4. Haz doble clic en el archivo descargado
5. Sigue las instrucciones del instalador:
   - Haz clic en "Next" en todas las pantallas
   - Cuando pregunte "Select Components", deja todo marcado
   - Cuando pregunte "Choosing the default editor", selecciona "Use Visual Studio Code as Git's default editor"
   - Haz clic en "Install" y espera a que termine
   - Haz clic en "Finish"

#### Método 2: Usar GitHub Desktop (Más Fácil)
1. Ve a: [https://desktop.github.com/](https://desktop.github.com/)
2. Haz clic en "**Download for Windows**"
3. Instala el programa (sigue las instrucciones en pantalla)

### 🔧 Para Mac:

#### Método 1: Usar Terminal (Más Rápido)
1. Abre la aplicación **Terminal** (búscala en Spotlight: ⌘ + Espacio)
2. Escribe este comando y presiona Enter:
   ```bash
   brew install git
   ```

#### Método 2: Descargar Directo
1. Ve a: [https://git-scm.com/download/mac](https://git-scm.com/download/mac)
2. Haz clic en el archivo `.dmg`
3. Arrastra el ícono de Git a tu carpeta de Aplicaciones

### 🔧 Para Linux:
1. Abre la terminal (Ctrl + Alt + T)
2. Dependiendo de tu distribución, usa uno de estos comandos:

**Para Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install git
```

**Para Fedora:**
```bash
sudo dnf install git
```

**Para Arch Linux:**
```bash
sudo pacman -S git
```

---

## ⚙️ CONFIGURAR GIT POR PRIMERA VEZ

Ahora que tienes Git instalado, necesitas decirle quién eres. Esto es como poner tu nombre en una etiqueta.

### Paso 1: Abrir Terminal/Command Prompt

**Windows:**
- Presiona `Windows + R`
- Escribe `cmd` y presiona Enter
- Se abrirá una ventana negra (Command Prompt)

**Mac:**
- Abre la aplicación **Terminal** (búscala en Spotlight: ⌘ + Espacio)

**Linux:**
- Abre la terminal (Ctrl + Alt + T)

### Paso 2: Configurar tu Nombre
En la terminal que abriste, copia y pega este comando (cambia el nombre por el tuyo):

```bash
git config --global user.name "Tu Nombre Completo"
```

**Ejemplos:**
```bash
git config --global user.name "María González"
git config --global user.name "Juan Pérez"
```

### Paso 3: Configurar tu Email
Ahora pega este comando (usa el mismo email que usaste en GitHub):

```bash
git config --global user.email "tu@email.com"
```

**Ejemplos:**
```bash
git config --global user.email "maria.gonzalez@email.com"
git config --global user.email "juan.perez@email.com"
```

### Paso 4: Verificar la Configuración
Para asegurarte de que todo está bien configurado, escribe:

```bash
git config --list
```

Deberías ver tu nombre y email en la lista. Si los ves, ¡perfecto! 🎉

---

## 📤 SUBIR EL PROYECTO A GITHUB

Ahora viene la parte importante: subir todo el código de FaceYoga AI+ a GitHub.

### Paso 1: Crear un Nuevo Repositorio en GitHub

1. **Inicia sesión en GitHub**: Ve a [https://github.com](https://github.com) e inicia sesión
2. **Crea nuevo repositorio**:
   - Haz clic en el "+" en la esquina superior derecha
   - Selecciona "**New repository**"
   
3. **Configura tu repositorio**:
   - **Repository name**: Escribe `faceyoga-ai-plus`
   - **Description**: Escribe `FaceYoga AI+ - Aplicación de yoga facial con IA`
   - **Public/Private**: Selecciona "**Public** (para que sea visible)
   - **NO marques** "Add a README file", "Add .gitignore", "Add license"
   
4. **Crea el repositorio**:
   - Haz clic en "**Create repository**"

5. **Copia la URL del repositorio**:
   - Verás una página con una URL verde
   - Haz clic en el portapapeles junto a la URL
   - La URL se verá algo así: `https://github.com/tu-usuario/faceyoga-ai-plus.git`

### Paso 2: Preparar los Archivos Locales

1. **Abre una terminal** en tu computadora (como hicimos antes)

2. **Navega a la carpeta del proyecto**:
   Necesitas decirle a la terminal dónde están tus archivos. Si no sabes dónde están, busca la carpeta `my-project` en tu computadora.
   
   Una vez que sepas dónde está, usa el comando `cd` para navegar hasta allí:
   ```bash
   cd ruta/a/tu/carpeta/my-project
   ```
   
   **Ejemplo en Windows:**
   ```bash
   cd C:\Users\TuNombre\Documents\my-project
   ```
   
   **Ejemplo en Mac/Linux:**
   ```bash
   cd /home/tunombre/Documents/my-project
   ```

3. **Inicializa Git en la carpeta**:
   ```bash
   git init
   ```

4. **Añade todos los archivos**:
   ```bash
   git add .
   ```

5. **Haz el primer commit**:
   ```bash
   git commit -m "Versión inicial de FaceYoga AI+"
   ```

### Paso 3: Conectar con GitHub

1. **Añade el repositorio remoto**:
   Pega este comando, reemplazando la URL con la que copiaste de GitHub:
   ```bash
   git remote add origin https://github.com/tu-usuario/faceyoga-ai-plus.git
   ```

2. **Sube los archivos a GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

3. **Inicia sesión en GitHub**:
   - Te pedirá tu nombre de usuario de GitHub
   - Te pedirá tu contraseña de GitHub
   - **Importante**: Si tienes autenticación de dos factores, usa tu código de autenticación

### Paso 4: ¡Listo! Verifica en GitHub

1. **Ve a tu repositorio**: Ve a [https://github.com/tu-usuario/faceyoga-ai-plus](https://github.com/tu-usuario/faceyoga-ai-plus)
2. **Deberías ver todos tus archivos** allí
3. **¡Felicidades! 🎉** Ya tienes tu proyecto en GitHub

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Paso 1: Verificar los Archivos en GitHub

1. Abre tu repositorio en GitHub
2. Deberías ver todos los archivos y carpetas del proyecto
3. Haz clic en algunos archivos para verificar que el contenido esté ahí

### Paso 2: Probar la Aplicación Localmente

1. **Abre una terminal** en la carpeta del proyecto
2. **Instala las dependencias**:
   ```bash
   npm install
   ```
3. **Inicia la aplicación**:
   ```bash
   npm run dev
   ```
4. **Abre tu navegador** y ve a `http://localhost:3000`
5. Deberías ver la página principal de FaceYoga AI+

### Paso 3: Comprobar el Estado de Git

1. **Abre una terminal** en la carpeta del proyecto
2. **Verifica el estado**:
   ```bash
   git status
   ```
3. Debería decir: "nothing to commit, working tree clean"

---

## 🤖 CÓMO TRABAJAR CON CLAUDE EN FUTUROS CHATS

Ahora que tienes tu proyecto en GitHub, aquí te explico cómo trabajar conmigo en futuras conversaciones:

### 📝 Escenario 1: Quieres Hacer Cambios

**Si quieres:**
- Modificar alguna funcionalidad
- Agregar nuevas características
- Corregir errores
- Mejorar el diseño

**Pasos:**
1. **Abre un nuevo chat con Claude**
2. **Dime**: "Hola Claude, quiero trabajar en mi proyecto FaceYoga AI+ que está en GitHub. Mi usuario es [tu-usuario] y el repositorio es faceyoga-ai-plus"
3. **Explica lo que quieres hacer**: "Quiero agregar [funcionalidad] o modificar [parte de la app]"
4. **Yo te ayudaré** con el código y las instrucciones

### 🔄 Escenario 2: Quieres Actualizar el Proyecto

**Si ha pasado tiempo y quieres actualizar:**
1. **Abre una terminal** en la carpeta del proyecto
2. **Trae los últimos cambios**:
   ```bash
   git pull origin main
   ```
3. **Abre un nuevo chat con Claude** y dile: "Quiero actualizar mi proyecto FaceYoga AI+ con las últimas características"

### 📤 Escenario 3: Quieres Subir Cambios

**Después de trabajar con Claude:**
1. **Guarda los cambios** que Claude te ayudó a hacer
2. **Abre una terminal** en la carpeta del proyecto
3. **Verifica el estado**:
   ```bash
   git status
   ```
4. **Añade los archivos modificados**:
   ```bash
   git add .
   ```
5. **Haz commit con un mensaje descriptivo**:
   ```bash
   git commit -m "Describe lo que cambiaste"
   ```
6. **Sube a GitHub**:
   ```bash
   git push origin main
   ```

### 💡 Consejos para Trabajar con Claude:

1. **Sé específico**: En lugar de "quiero mejorar la app", di "quiero agregar un nuevo ejercicio para reducir arrugas alrededor de los ojos"
2. **Menciona tu nivel**: "No tengo experiencia en programación" o "Soy principiante en React"
3. **Pide explicaciones**: "Explícame esto como si tuviera 15 años" o "Paso a paso por favor"
4. **Sé paciente**: A veces necesito varios intentos para entender exactamente lo que necesitas
5. **Guarda tu trabajo**: Siempre haz commit y push de tus cambios importantes

---

## 🛠️ SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Problema: "Git no se reconoce como comando"
**Solución:**
- Reinicia tu computadora después de instalar Git
- Verifica que Git esté instalado: `git --version`
- Si usas Windows, busca "Git Bash" en lugar de "Command Prompt"

### ❌ Problema: "Error: Authentication failed"
**Solución:**
- Verifica tu nombre de usuario y contraseña de GitHub
- Si tienes autenticación de dos factores, usa un token de acceso personal:
  1. Ve a GitHub → Settings → Developer settings → Personal access tokens
  2. Genera un nuevo token con permisos "repo"
  3. Usa el token como contraseña

### ❌ Problema: "Permission denied (publickey)"
**Solución:**
- Necesitas configurar SSH keys en lugar de HTTPS:
  1. Sigue esta guía: [GitHub SSH Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
  2. O usa la URL HTTPS en lugar de SSH

### ❌ Problema: "npm command not found"
**Solución:**
- Necesitas instalar Node.js:
  1. Ve a [https://nodejs.org](https://nodejs.org)
  2. Descarga la versión LTS (Long Term Support)
  3. Instálala y reinicia tu computadora

### ❌ Problema: "La aplicación no se inicia en localhost:3000"
**Solución:**
- Verifica que Node.js esté instalado: `node --version`
- Verifica que npm esté instalado: `npm --version`
- Asegúrate de estar en la carpeta correcta del proyecto
- Intenta: `npm install` antes de `npm run dev`

### ❌ Problema: "No puedo encontrar la carpeta my-project"
**Solución:**
- Busca la carpeta en tu computadora:
  - **Windows**: Usa el explorador de archivos y busca "my-project"
  - **Mac**: Usa Finder y busca "my-project"
  - **Linux**: Usa el comando `find /home -name "my-project" -type d`

### ❌ Problema: "GitHub me pide un código de verificación"
**Solución:**
- Revisa tu email (incluida la carpeta de spam)
- Busca un email de GitHub con un código de 6 dígitos
- Ingresa ese código en la página de GitHub

---

## 🎉 ¡FELICITACIONES! 🎉

Si has llegado hasta aquí, ya tienes:

✅ **Cuenta en GitHub** lista para usar  
✅ **Git instalado** en tu computadora  
✅ **Proyecto FaceYoga AI+** subido a GitHub  
✅ **Conocimientos básicos** para trabajar con Git  
✅ **Guía completa** para futuros trabajos con Claude  

### 📌 Próximos Pasos:

1. **Explora tu repositorio** en GitHub
2. **Comparte el enlace** con amigos o familiares
3. **Prueba la aplicación** localmente
4. **Abre un nuevo chat con Claude** cuando quieras hacer mejoras

### 📧 Si Necesitas Ayuda:

- **Para problemas técnicos**: Busca en Google el error específico
- **Para problemas con GitHub**: Consulta la ayuda de GitHub
- **Para problemas con el código**: Abre un nuevo chat con Claude y describe el problema

---

## 📚 RECURSOS ÚTILES

### Enlaces Oficiales:
- [GitHub Documentation](https://docs.github.com/es)
- [Git Documentation](https://git-scm.com/doc)
- [Node.js Documentation](https://nodejs.org/es/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Videos Tutoriales (YouTube):
- "Git y GitHub para principiantes"
- "Cómo subir un proyecto a GitHub paso a paso"
- "Tutorial de Next.js para principiantes"

### Comunidades:
- [Stack Overflow](https://stackoverflow.com) - Para preguntas técnicas
- [GitHub Community Forum](https://github.community) - Para preguntas sobre GitHub
- [Discord de desarrolladores](https://discord.gg/programming) - Para ayuda en tiempo real

---

**¡Recuerda:** Todos empezamos algún día, y lo importante es que ya estás dando los primeros pasos para crear algo increíble con FaceYoga AI+ 🚀

Si tienes alguna duda durante el proceso, no dudes en abrir un nuevo chat conmigo y te ayudaré con gusto.