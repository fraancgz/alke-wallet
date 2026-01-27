// Declaro las variables fuera (vacías) para que sean globales
let userIndex = -1

// Cargo la vista deposito para que quede por defecto y asigno respectivos valores a variables globales
document.addEventListener("DOMContentLoaded", () => {

    const registeredUsers = JSON.parse(localStorage.getItem('dbUsers')) || []
    const currentUserDeposit = localStorage.getItem('currentUserDeposit')
    userIndex = registeredUsers.findIndex(user => user.mail === currentUserDeposit)

    // Cargo la vista por defecto, el salgo se cargara en el fetch.
    renderView('deposit.html');

});

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
            }

            // Inicializa la funcion cuando ya es seguro que cargo el HTML
            initTransactions()
            initSendMoney()
            initDeposit()
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
