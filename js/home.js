// Declaro las variables fuera (vacías) para que sean globales
let registeredUsers
let currentUser
let userBalance = 0
let userIndex = -1
let textDeposit
let actualBalanceUser

// Cargo la vista deposito para que quede por defecto y asigno respectivos valores a variables globales
document.addEventListener("DOMContentLoaded", () => {

    registeredUsers = JSON.parse(localStorage.getItem('dbUsers')) || []
    currentUser = localStorage.getItem('currentUser')
    userIndex = registeredUsers.findIndex(user => user.mail === currentUser)

    // Cargo la vista por defecto, el salgo se cargara en el fetch.
    renderView('transactions.html');

});

// Funcion mostrar el saldo solo si currentUser y actualBalanceUser estan cargados previamente
function showBalance() {
    // console.log(actualBalanceUser + " " +currentUser)
    if (currentUser && actualBalanceUser)
        formatBalance(actualBalanceUser, registeredUsers[userIndex].balance)
    else
        console.log("Usuario o balance no han sido establecidos aún")
}

const depositForm = document.querySelector("#depositForm")

// Esucho todos los eventos de tipo submit y filtro segun el id de formulario para saber cual es al que se hizo click
document.addEventListener("submit", (e) => {
    e.preventDefault()

    // Obtendo el id del formulario clickeado
    const id = e.target.id;

    if (id === "depositForm") {
        // console.log("Lógica de depósito");
        loginFormDeposit()
    } else if (id === "sendForm") {
        console.log("Lógica de envío");
    }
})

function loginFormDeposit() {
    const depositForm = document.querySelector("#depositForm")
    actualBalanceUser = document.querySelector("#actualBalanceUser")
    textDeposit = document.querySelector("#textDeposit")
    const alertDeposit = document.querySelector("#alertDeposit")

    const dataForm = new FormData(depositForm)
    const objectJson = Object.fromEntries(dataForm.entries())

    userBalance += parseInt(objectJson.depositAmount)
    registeredUsers[userIndex].balance += userBalance

    localStorage.setItem('dbUsers', JSON.stringify(registeredUsers))

    showAlertMessage(alertDeposit, textDeposit, "Depósito realizado con éxito")
    restoreDepositForm()
    formatBalance(actualBalanceUser, registeredUsers[userIndex].balance);
}

// Funcion que muestra un mensaje de alerta y lo restablece luego de 5 segundos
function showAlertMessage(alertElement, textElement, message) {
    alertElement.classList.remove('d-none')
    alertElement.classList.add('d-inline')
    alertElement.classList.add("d-flex", "align-items-center", "justify-content-center")
    textElement.textContent = message

    setTimeout(() => {
        restoreAlert(alertElement)
    }, 3000);
}

// Funcion que agrega la clase display none al alert ingresado como atributo
function restoreAlert(alertElement) {
    alertElement.classList.add('d-none')
    alertElement.classList.remove('d-inline')
}

function formatBalance(element, newBalance) {
    element.textContent = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(newBalance);
}

function restoreDepositForm() {
    document.querySelector("#depositAmount").value = ""
    document.activeElement.blur()
}

function renderView(view) {

    const dynamicContainer = document.querySelector("#dynamicContainer")

    // Mediante la funcion fetch se inicia el proceso de comunicación de red para obtener la pagina solicitada
    // En resumen, busca el archivo HTML
    fetch(view)
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar la vista")
            return response.text() // Convierto la respuesta a texto/html  
        })
        .then(html => {
            dynamicContainer.innerHTML = html // Injecto el Html en el contenedor
           
            const usernameHome = document.querySelector("#usernameHome")

            if (userIndex != -1) {
                // Establesco el nombre de usuario
                usernameHome.textContent = registeredUsers[userIndex].username
                
                // Ejecuto la funcion para mostrar el saldo al momento de cargar el HTML
                actualBalanceUser = document.querySelector("#actualBalanceUser")
                showBalance();
            }
        })
        .catch(error => {
            console.log(error)
            dynamicContainer.innerHTML = "<p>Error al cargar el contenido</p>"
        })
}

function direct(e, url) {
    e.preventDefault()

    // Quito la clase active a todos los elementos  nav-link, para agregarla posteriormente solo al que se le de click
    document.querySelectorAll('.nav-link').forEach(nav => {
        nav.classList.remove('active')
    });
    e.currentTarget.classList.add('active')

    // Cargo la vista, llamando al metodo cargarVista
    renderView(url)

}

function logout(e) {
    e.preventDefault()
    window.location.href = "../index.html"
}
