/*  
    Intento traer los usuarios de la "memoria del navegador"
    Si no hay nada (primera vez), creo un array vacío []
*/
let registeredUsers = JSON.parse(localStorage.getItem('dbUsers')) || []

const goToRegister = document.querySelector("#go-to-register");
const goToLogin = document.querySelector("#go-to-login");
const loginSection = document.querySelector("#loginSection");
const registerSection = document.querySelector("#registerSection");
const slidingPanel = document.querySelector(".sliding-panel");

function slidingPanelOnNormalDevices(e) {
    e.preventDefault();

    if (window.innerWidth < 768) {
        // Mobile revices: Switch puro entre d-none y d-flex
        // Login: si tiene d-none lo quita, si no, lo pone.
        loginSection.classList.toggle('d-none');
        loginSection.classList.toggle('d-flex');
        
        // Registro: igual
        registerSection.classList.toggle('d-none');
        registerSection.classList.toggle('d-flex');
    } else {
        // Desktop: Mover el panel y cambiar color
        slidingPanel.classList.toggle('move-left');
        
        if (slidingPanel.classList.contains('move-left')) {
            slidingPanel.classList.toggle('bg-accent-custom');
            slidingPanel.classList.toggle('bg-primary-custom');
        } else {
            slidingPanel.classList.toggle('bg-primary-custom');
            slidingPanel.classList.toggle('bg-accent-custom');
        }
    }
}
    
goToRegister.addEventListener("click", slidingPanelOnNormalDevices);
goToLogin.addEventListener("click", slidingPanelOnNormalDevices);


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
    // Obtengo los datos ingresados por el usuario al formulario Login, mediante FormData
    const data = new FormData(loginForm)

    // Convierto los datos recibidos a un objeto de tipo JSON, y aplicando la DESTRUCTURACION se los asigno a las variables mail y pass.
    const { mail, pass } = Object.fromEntries(data.entries())

    // Buscamos al usuario que tenga las credenciales correctas con la funcion find
    const usuario = registeredUsers.find(user => user.mail === mail && user.pass === pass)

    // Si lo encuentra, lo redirijo al Home. Si no muestro un mensaje de creedenciales incorrectas
    if (usuario) {
        await new Promise(res => setTimeout(res, 2000))

        // Guardamos SOLO el mail del usuario que acaba de entrar
        localStorage.setItem('currentUser', usuario.mail);

        restoreButton(btnLogin, "Ingresar")
        restoreForm()
        window.location.href = "./views/home.html"
        // console.log(`${mail} ${pass}`)
    }
    else {
        await new Promise(res => setTimeout(res, 200));
        
        // Funcion que modifica un alert, necesita como parametros el elemento alert, el tipo de alerta, el elemento texto y el mensaje
        showAlertMessage(alertLogin, "alert-danger", textLogin, "Correo y contraseña no coinciden")
        restoreButton(btnLogin, "Ingresar")
    }
})
/* -------------------------------------------------------------------------------------------------------------- */


/* ------------------------- Obtencion de datos y validación para el formulario Registro -----------------------*/

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
    if (registeredUsers.find(user => user.mail === mailClean)) {
        // console.log("Correo ya existe")
        showAlertMessage(alertRegister, 'alert-warning', textRegister, 'Correo en uso')
        restoreButton(btnRegister, "Registrar")
    }
    else {
        const usernameClean = objectJson.username.trim().toLowerCase()
        const passClean = objectJson.pass.trim().toLowerCase()

        // Creo el objeto usuario, y adicionalmente le asigno el atributo saldo en 0 para futuraas operaciones
        const newUser = {
            username: usernameClean,
            mail: mailClean,
            pass: passClean,
            balance: 0
        }

        registeredUsers.push(newUser)
        await new Promise(res => setTimeout(res, 1000))
        localStorage.setItem('dbUsers', JSON.stringify(registeredUsers))

        restoreForm()
        restoreButton(btnRegister, "Registrar")

        document.activeElement.blur()
        showAlertMessage(alertRegister, 'alert-success', textRegister, 'Usuario registrado con exito')
        
    }

})


/* -------------------------------------------------------------------------------------------------------------- */



// Funcion para restablecer valores iniciales de los botones, recibe boton y texto
function restoreButton(btn, texto) {
    btn.disabled = false
    btn.innerHTML = texto
}

// Funcion limpia los input del Formulario
function restoreForm() {
    document.querySelector("#loginPass").value = ""
    document.querySelector("#loginMail").value = ""
    document.querySelector("#username").value = ""
    document.querySelector("#mail").value = ""
    document.querySelector("#pass").value = ""
}

// Funcion que muestra un mensaje de alerta, modifica el tipo de alerta y lo restablece luego de 5 segundos
function showAlertMessage(alertElement, alertType, textElement, message) {
    alertElement.classList.remove('d-none')
    alertElement.classList.add('d-inline')
    alertElement.classList.remove('alert-success','alert-danger','alert-warning')
    alertElement.classList.add(alertType)
    alertElement.classList.add("d-flex", "align-items-center" ,"justify-content-center")
    textElement.textContent = message

    setTimeout(() => {
            restoreAlert(alertElement)
    }, 5000);
}

// Funcion que agrega la clase display none al alert ingresado como parametro
function restoreAlert(alertElement) {
    alertElement.classList.add('d-none')
    alertElement.classList.remove('d-inline')
}
