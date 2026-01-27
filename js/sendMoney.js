
function initSendMoney() {
    const destinyMail = document.getElementById("destinyMail");
    if (!destinyMail) return;

    // Lógica de cargar usuarios y renderizar
    const registeredUsersSend = JSON.parse(localStorage.getItem('dbUsers')) || [];
    const currentUserSend = localStorage.getItem('currentUser')
    const userIndex = registeredUsersSend.findIndex(user => user.mail === currentUserSend)

    //console.log(registeredUsersSend)

    const sendMoneyForm = document.querySelector("#sendMoneyForm");

    const actualBalanceUser = document.querySelector("#actualBalanceUser")
    showBalanceSendMoney(currentUserSend, actualBalanceUser, registeredUsersSend[userIndex].balance)

    sendMoneyForm.addEventListener("submit", (e) => {

        e.preventDefault()

        const alertFindUser = document.querySelector("#alertFindUser")
        const textFindUser = document.querySelector("#textFindUser")
        const findMail = destinyMail.value.trim().toLowerCase();

        // Identifico el botón al que se le dió click
        const buttoncLicked = e.submitter

        if (buttoncLicked.value === "findDestinyMail") {

            // Validación rápida: no transferirse a uno mismo
            if (findMail === currentUserSend) {
                showAlertMessageSend(alertFindUser, "alert-danger", textFindUser, "No te puedes enviar dinero a ti mismo")
                return;
            }

            // Buscar al destinatario en la "base de datos"
            const userDestiny = registeredUsersSend.find(user => user.mail === findMail);

            if (userDestiny) {
                // console.log("Usuario encontrado:", userDestiny.username);

                const transferSection = document.querySelector("#transferSection")
                const receiverUser = document.querySelector("#receiverUser")
                const findDestinyMail = document.querySelector("#findDestinyMail")

                receiverUser.textContent = userDestiny.mail
                transferSection.classList.remove("d-none")

                changeEnableState(destinyMail, findDestinyMail, true)

            } else {
                showAlertMessageSend(alertFindUser, "alert-warning", textFindUser, "Correo no registrado")
                return;
            }
        } else if (buttoncLicked.value === "confirmTransfer") {

            const transferAmount = document.querySelector("#transferAmount")
            const numberAmount = Number(transferAmount.value)

            transferAmount.required = true;
            transferAmount.min = 1000

            if (transferAmount.checkValidity()) {
                
                const alertSendMoney = document.querySelector("#alertSendMoney")
                const textSendMoney = document.querySelector("#textSendMoney")

                if (registeredUsersSend[userIndex].balance >= numberAmount) {

                    const dataForm = new FormData(sendMoneyForm)
                    const { destinyMail: destMail, transferAmount } = Object.fromEntries(dataForm.entries())

                    const transactionSender = {
                        id: Date.now(),                  // Un número único (usar el timestamp es un truco fácil)
                        date: new Date().toISOString(),  // Fecha completa para poder ordenar cronológicamente
                        type: "transfer",                // "deposit", "send" o "receive"
                        amount: Number(transferAmount),          // El valor numérico
                        sender: currentUserSend,             // Email o nombre de quien envía
                        receiver: destMail               // Email o nombre de quien recibe
                    }

                    // Agrego el registro de transaccion para el usuario que envía, modificando el tipo a transferencia
                    registeredUsersSend[userIndex].balance -= numberAmount
                    registeredUsersSend[userIndex].transactions.push(transactionSender)
                    localStorage.setItem('dbUsers', JSON.stringify(registeredUsersSend))

                    const transactionReceiver = {
                        id: Date.now(),                     // Un número único (usar el timestamp es un truco fácil)
                        date: new Date().toISOString(),     // Fecha completa para poder ordenar cronológicamente
                        type: "deposit",                    // "deposit", "send" o "receive"
                        amount: Number(transferAmount),             // El valor numérico
                        sender: currentUserSend,                   // Email o nombre de quien envía
                        receiver: destMail               // Email o nombre de quien recibe
                    }



                    // Busco al usuario que recive la transferencia por su correo
                    const receiveUserIndex = registeredUsersSend.findIndex(user => user.mail === destMail)

                    // Agrego el registro de transaccion para el usuario que recive, modificando el tipo a deposito
                    registeredUsersSend[receiveUserIndex].balance += numberAmount
                    registeredUsersSend[receiveUserIndex].transactions.push(transactionReceiver)
                    localStorage.setItem('dbUsers', JSON.stringify(registeredUsersSend))

                    showAlertMessageSend(alertSendMoney, "alert-success", textSendMoney, "Transferencia realizada con éxito")

                    showBalanceSendMoney(currentUserSend, actualBalanceUser, registeredUsersSend[userIndex].balance)


                } else {  
                    showAlertMessageSend(alertSendMoney, "alert-danger", textSendMoney, "No tienes suficiente saldo para transferir")
                    return;
                }

            }
        }
    });
}

// Funcion mostrar el saldo solo si currentUser y actualBalanceUser estan cargados previamente
function showBalanceSendMoney(elementUserSend, elementBalanceUserSend, userBalanceSend) {
    // Verifica que este logeado un usuario y que tenga balance
    if (elementUserSend && elementBalanceUserSend)
        // El formulario recibe como parametro el elemento del balanceActual y el balance de usuario
        formatBalanceSendMoney(elementBalanceUserSend, userBalanceSend)
    else
        console.log("Usuario o balance no han sido establecidos aún")
}

function formatBalanceSendMoney(element, newBalance) {
    element.textContent = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(newBalance);
}

function changeEnableState(inputText, findButton, state) {
    inputText.readOnly = state
    findButton.disabled = state
}

// Funcion que muestra un mensaje de alerta y lo restablece luego de 5 segundos
function showAlertMessageSend(alertElement, alertType, textElement, message) {
    alertElement.classList.remove('d-none')
    alertElement.classList.add('d-inline')
    alertElement.classList.add("d-flex", "align-items-center", "justify-content-center")
    alertElement.classList.remove('alert-success', 'alert-danger', 'alert-warning')
    alertElement.classList.add(alertType)
    textElement.textContent = message

    setTimeout(() => {
        restoreAlertSend(alertElement)
    }, 3000);
}

// Funcion que agrega la clase display none al alert ingresado como atributo
function restoreAlertSend(alertElement) {
    alertElement.classList.add('d-none')
    alertElement.classList.remove('d-inline')
}


