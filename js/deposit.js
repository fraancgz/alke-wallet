let actualUserDep

function initDeposit() {
    const actualBalanceUserDep = document.getElementById("actualBalanceUserDep");
    // Si no estamos en la página de transacciones, nos detenemos de inmediato
    if (!actualBalanceUserDep) return;

    // Lógica de cargar usuarios y renderizar
    const registeredUsers = JSON.parse(localStorage.getItem('dbUsers')) || [];
    const currentUserDep = localStorage.getItem('currentUser');
    const userIndexDep = registeredUsers.findIndex(user => user.mail === currentUserDep);

    if (userIndexDep !== -1) {
        // ... (setear nombres de perfil)
        // Le pasamos el elemento ya encontrado a la función hija
        renderDeposit(registeredUsers, userIndexDep, actualBalanceUserDep, currentUserDep);
    }
}

// 1. La lógica de dibujo ahora recibe "donde" dibujar
function renderDeposit(users, index, elementBalanceDep, curUserDep) {
    actualUserDep = users[index]
    showBalanceDeposit(curUserDep, elementBalanceDep, actualUserDep.balance)

    const depositForm = document.querySelector("#depositForm")
    depositForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const textDeposit = document.querySelector("#textDeposit")
        const alertDeposit = document.querySelector("#alertDeposit")

        const dataForm = new FormData(depositForm)
        const {depositAmountDep} = Object.fromEntries(dataForm.entries())
        actualUserDep.balance += Number(depositAmountDep)

        const transaction = {
            id: Date.now(),                                  // Un número único (usar el timestamp es un truco fácil)
            date: new Date().toISOString(),                  // Fecha completa para poder ordenar cronológicamente
            type: "deposit",                                 // "deposit", "send" o "receive"
            amount: Number(depositAmountDep),                // El valor numérico
            sender: actualUserDep.mail,                       // Email o nombre de quien envía
            receiver: actualUserDep.mail                      // Email o nombre de quien recibe
        }

        // console.log(transaction)

        actualUserDep.transactions.push(transaction)
        localStorage.setItem('dbUsers', JSON.stringify(users))

        showAlertMessageDep(alertDeposit, textDeposit, "Depósito realizado con éxito")
        showBalanceDeposit(curUserDep, elementBalanceDep, actualUserDep.balance)

        depositForm.reset()
    })
}

// Funcion mostrar el saldo solo si currentUserDeposit y actualBalanceUser estan cargados previamente
function showBalanceDeposit(elementActualUser, elementBalance, userBalance) {
    // console.log(actualBalanceUser + " " +currentUserDeposit)
    if (elementActualUser && elementBalance) {
        formatBalanceDeposit(elementBalance, userBalance)
    }
    else
        console.log("Usuario o balance no han sido establecidos aún")
}
function formatBalanceDeposit(element, newBalance) {
    element.textContent = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(newBalance);
}

// Funcion que muestra un mensaje de alerta y lo restablece luego de 5 segundos
function showAlertMessageDep(alertElement, textElement, message) {
    alertElement.classList.remove('d-none')
    alertElement.classList.add('d-inline')
    alertElement.classList.add("d-flex", "align-items-center", "justify-content-center")
    textElement.textContent = message

    setTimeout(() => {
        restoreAlertDep(alertElement)
    }, 3000);
}
// Funcion que agrega la clase display none al alert ingresado como atributo
function restoreAlertDep(alertElement) {
    alertElement.classList.add('d-none')
    alertElement.classList.remove('d-inline')
}

