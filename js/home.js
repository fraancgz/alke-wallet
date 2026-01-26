// Al cargar el Home...
// Estas variables son "globales" para el archivo que se cargue
const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_db')) || [];
const mailActivo = localStorage.getItem('usuarioActivo');
// console.log(usuariosRegistrados)
// console.log(mailActivo)


document.addEventListener("DOMContentLoaded", () => {
    // Cargo la vista deposito para que quede por defecto
    cargarVista('deposit.html');
});

if (mailActivo) {
    // Busco los datos del usuario en el array principal
    const datosUsuario = usuariosRegistrados.find(user => user.mail === mailActivo);
    const usernameHome = document.querySelector("#usernameHome")

    if (datosUsuario) {
        usernameHome.textContent = datosUsuario.username
    } else
        console.log("no")
}

const depositForm = document.querySelector("#depositForm")
let userBalance = 0

// Esucho todos los eventos de tipo submit y filtro segun el id de formulario para saber cual es al que se hizo click
document.addEventListener("submit", (e) => {
    e.preventDefault()

    // Obtendo el id del formulario clickeado
    const id = e.target.id;

    if (id === "depositForm") {
        // console.log("Lógica de depósito");
        logicaFormularioDeposito()
    } else if (id === "sendForm") {
        console.log("Lógica de envío");
    }
})

function logicaFormularioDeposito() {
    const depositForm = document.querySelector("#depositForm")
    const saldoActualDeposito = document.querySelector("#saldoActualDeposito")
    const textDeposit = document.querySelector("#textDeposit")
    const alertDeposit = document.querySelector("#alertDeposit")

    formatearSaldo(saldoActualDeposito, userBalance)

    const dataForm = new FormData(depositForm)
    const objectJson = Object.fromEntries(dataForm.entries())

    userBalance += parseInt(objectJson.montoDeposito)

    mostrarMensajeDeAlerta(alertDeposit, textDeposit, "Depósito realizado con éxito")

    restablecerFormularioDeposito()
    formatearSaldo(saldoActualDeposito, userBalance);
}

// Funcion que muestra un mensaje de alerta y lo restablece luego de 5 segundos
function mostrarMensajeDeAlerta(alertElement, textElement, message) {
    alertElement.classList.remove('d-none')
    alertElement.classList.add('d-inline')
    alertElement.classList.add("d-flex", "align-items-center" ,"justify-content-center")
    textElement.textContent = message

    setTimeout(() => {
            restablecerAlert(alertElement)
    }, 3000);
}

// Funcion que agrega la clase display none al alert ingresado como atributo
function restablecerAlert(alertElement) {
    alertElement.classList.add('d-none')
    alertElement.classList.remove('d-inline')
}

function formatearSaldo(elemento, valorFinal) {

    elemento.textContent = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(valorFinal);
}

function restablecerFormularioDeposito() {
    document.querySelector("#montoDeposito").value = ""
    document.activeElement.blur()
}

function cargarVista(vista) {
    // Mediante la funcion fetch se inicia el proceso de comunicación de red para obtener la pagina solicitada
    // En resumen, busca el archivo HTML
    fetch(vista)
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar la vista")
            return response.text() // Convierto la respuesta a texto/html  
        })
        .then(html => {
            contenedorDinamico.innerHTML = html // Injecto el Html en el contenedor
        })
        .catch(error => {
            console.log(error)
            contenedorDinamico.innerHTML = "<p>Error al cargar el contenido</p>"
        })
}

function direccionar(e, url) {
    e.preventDefault()

    // Quito la clase active a todos los elementos  nav-link, para agregarla posteriormente solo al que se le de click
    document.querySelectorAll('.nav-link').forEach(nav => {
        nav.classList.remove('active')
    });
    e.currentTarget.classList.add('active')

    // Cargo la vista, llamando al metodo cargarVista
    cargarVista(url)

}

function logout(e) {
    e.preventDefault()
    window.location.href = "../index.html"
}
