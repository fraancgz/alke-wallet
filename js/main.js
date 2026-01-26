/*  
    Intento traer los usuarios de la "memoria del navegador"
    Si no hay nada (primera vez), creo un array vacío []
*/
let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_db')) || []

const goToRegister = document.querySelector("#go-to-register");
const goToLogin = document.querySelector("#go-to-login");
const loginSection = document.querySelector("#loginSection");
const registerSection = document.querySelector("#registerSection");
const slidingPanel = document.querySelector(".sliding-panel");

function cambiarInterfaz(e) {
    e.preventDefault();

    if (window.innerWidth < 768) {
        // LÓGICA MÓVIL: Switch puro entre d-none y d-flex
        // Login: si tiene d-none lo quita, si no, lo pone.
        loginSection.classList.toggle('d-none');
        loginSection.classList.toggle('d-flex');
        
        // Registro: igual
        registerSection.classList.toggle('d-none');
        registerSection.classList.toggle('d-flex');
    } else {
        // LÓGICA DESKTOP: Mover el panel y cambiar color
        slidingPanel.classList.toggle('move-left');
        
        if (slidingPanel.classList.contains('move-left')) {
            slidingPanel.classList.add('bg-accent-custom');
            slidingPanel.classList.remove('bg-primary-custom');
        } else {
            slidingPanel.classList.add('bg-primary-custom');
            slidingPanel.classList.remove('bg-accent-custom');
        }
    }
}
    

goToRegister.addEventListener("click", cambiarInterfaz);
goToLogin.addEventListener("click", cambiarInterfaz);


/* ------------------------- Obtencion de datos y validación para el formulario Login -----------------------*/
const loginForm = document.querySelector("#loginForm")
const btnLogin = document.querySelector("#btnLogin")
const alertLogin = document.querySelector("#alertLogin")
const textLogin = document.querySelector("#textLogin")

loginForm.addEventListener('submit', async (e) => {

    e.preventDefault()

    // Desactivo el boton de Ingreso y agrego un spinner al boton
    btnLogin.disabled = true
    btnLogin.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Ingresando ...</span>
        `

    // Obtengo los datos ingresados por el usuario al formulario Login mediante FormData
    const data = new FormData(loginForm)

    // Convierto los datos recibidos a un objeto de tipo JSON, y aplicando la DESTRUCTURACION se los asigno a las variables mail y pass.
    const { mail, pass } = Object.fromEntries(data.entries())

    // Buscamos al usuario que tenga las credenciales correctas con la funcion find
    const usuario = usuariosRegistrados.find(user => user.mail === mail && user.pass === pass)

    // Si lo encuentra, lo redirijo al Home. Si no muestro un mensaje de creedenciales incorrectas
    if (usuario) {
        await new Promise(res => setTimeout(res, 2000))

        // Guardamos SOLO el mail del usuario que acaba de entrar
        localStorage.setItem('usuarioActivo', usuario.mail);

        restablecerBoton(btnLogin, "Ingresar")
        restableceFormulario()
        window.location.href = "./views/home.html"
        // console.log(`${mail} ${pass}`)
    }
    else {
        await new Promise(res => setTimeout(res, 200));
        mostrarMensajeDeAlerta(alertLogin, "alert-danger", textLogin, "Correo y contraseña no coinciden")
        restablecerBoton(btnLogin, "Ingresar")
    }
})
/* -------------------------------------------------------------------------------------------------------------- */


/* ------------------------- Obtencion de datos y validación para el formulario Login -----------------------*/

const registerForm = document.querySelector("#registerForm")
const btnRegister = document.querySelector("#btnRegister")
const textRegister = document.querySelector("#textRegister")
const alertRegister = document.querySelector("#alertRegister")

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Desactivo el boton de Registro y agrego un spinner al boton
    btnRegister.disabled = true
    btnRegister.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Registrando ...</span>
        `

    const data = new FormData(registerForm)

    const objectJson = Object.fromEntries(data.entries())

    // Aplico trim para eliminar espacios al inicio y final del input, y lowerCase a nombre y mail
    const mailClean = objectJson.mail.trim().toLowerCase()
    if (usuariosRegistrados.find(user => user.mail === mailClean)) {
        console.log("Correo ya existe")
        mostrarMensajeDeAlerta(alertRegister, 'alert-warning', textRegister, 'Correo en uso')
        restablecerBoton(btnRegister, "Registrar")
    }
    else {
        const usernameClean = objectJson.username.trim().toLowerCase()
        const passClean = objectJson.pass.trim().toLowerCase()

        const newUser = {
            username: usernameClean,
            mail: mailClean,
            pass: passClean
        }

        usuariosRegistrados.push(newUser)
        await new Promise(res => setTimeout(res, 1000))
        localStorage.setItem('usuarios_db', JSON.stringify(usuariosRegistrados))

        restableceFormulario()
        restablecerBoton(btnRegister, "Registrar")

        document.activeElement.blur()
        mostrarMensajeDeAlerta(alertRegister, 'alert-success', textRegister, 'Usuario registrado con exito')
        
    }

})


/* -------------------------------------------------------------------------------------------------------------- */



// Funcion para restablecer valores iniciales de los botones, recibe boton y texto
function restablecerBoton(btn, texto) {
    btn.disabled = false
    btn.innerHTML = texto
}

// Funcion limpia los input del Formulario
function restableceFormulario() {
    document.querySelector("#loginPass").value = ""
    document.querySelector("#loginMail").value = ""
    document.querySelector("#username").value = ""
    document.querySelector("#mail").value = ""
    document.querySelector("#pass").value = ""
}

// Funcion que muestra un mensaje de alerta, modifica el tipo de alerta y lo restablece luego de 5 segundos
function mostrarMensajeDeAlerta(alertElement, alertType, textElement, message) {
    alertElement.classList.remove('d-none')
    alertElement.classList.add('d-inline')
    alertElement.classList.remove('alert-success','alert-danger','alert-warning')
    alertElement.classList.add(alertType)
    alertElement.classList.add("d-flex", "align-items-center" ,"justify-content-center")
    textElement.textContent = message

    setTimeout(() => {
            restablecerAlert(alertElement)
    }, 5000);
}

// Funcion que agrega la clase display none al alert ingresado como atributo
function restablecerAlert(alertElement) {
    alertElement.classList.add('d-none')
    alertElement.classList.remove('d-inline')
}
