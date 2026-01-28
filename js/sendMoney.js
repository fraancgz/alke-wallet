function initSendMoney() {
    const destinyMail = document.getElementById("destinyMail");
    if (!destinyMail) return;

    const registeredUsersSend = JSON.parse(localStorage.getItem('dbUsers')) || [];
    const currentUserSend = localStorage.getItem('currentUser');
    const userIndex = registeredUsersSend.findIndex(user => user.mail === currentUserSend);
    const sendMoneyForm = document.querySelector("#sendMoneyForm");
    const actualBalanceUser = document.querySelector("#actualBalanceUser");
    const transferAmount = document.querySelector("#transferAmount");
    const confirmTransfer = document.querySelector("#confirmTransfer");

    showBalanceSendMoney(currentUserSend, actualBalanceUser, registeredUsersSend[userIndex].balance);

    // Permite apretar enter y e iniciar el evento submit
    transferAmount.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            // Si la sección de transferencia es visible, forzamos el clic en confirmar
            const transferSection = document.querySelector("#transferSection");
            if (!transferSection.classList.contains("containerInvisible")) {
                e.preventDefault();
                confirmTransfer.click();
            }
        }
    });

    sendMoneyForm.addEventListener("submit", (e) => {
        const buttonClicked = e.submitter;

        // 1. Validaciones previas si es Confirmar
        if (buttonClicked && buttonClicked.value === "confirmTransfer") {
            transferAmount.required = true;
            transferAmount.setAttribute('min', '1000');

            if (!sendMoneyForm.reportValidity()) {
                e.preventDefault();
                return;
            }
        }

        e.preventDefault(); // Detenemos el envío real

        const alertFindUser = document.querySelector("#alertFindUser");
        const textFindUser = document.querySelector("#textFindUser");
        const findMail = destinyMail.value.trim().toLowerCase();
        const receiverUser = document.querySelector("#receiverUser");
        const findDestinyMail = document.querySelector("#findDestinyMail");

        // LÓGICA: BUSCAR USUARIO
        if (buttonClicked.value === "findDestinyMail") {
            if (findMail === currentUserSend) {
                showAlertMessageSend(alertFindUser, "alert-danger", textFindUser, "No te puedes enviar dinero a ti mismo");
                return;
            }

            const userDestiny = registeredUsersSend.find(user => user.mail === findMail);

            if (userDestiny) {
                // Bloqueamos búsqueda
                changeEnableState(destinyMail, findDestinyMail, true);

                const transferSection = document.querySelector("#transferSection");
                receiverUser.textContent = userDestiny.mail;
                transferSection.classList.remove("containerInvisible");

                // Foco al monto
                setTimeout(() => transferAmount.focus(), 100);
            } else {
                showAlertMessageSend(alertFindUser, "alert-warning", textFindUser, "Correo no registrado");
            }

        // LÓGICA: CONFIRMAR TRANSFERENCIA
        } else if (buttonClicked.value === "confirmTransfer") {
            const numberAmount = Number(transferAmount.value);
            const alertSendMoney = document.querySelector("#alertSendMoney");
            const textSendMoney = document.querySelector("#textSendMoney");

            if (registeredUsersSend[userIndex].balance >= numberAmount) {
                // --- PROCESO DE GUARDADO ---
                const transAmount = numberAmount;
                const destMail = receiverUser.textContent;

                const transactionSender = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    type: "transfer",
                    amount: transAmount,
                    sender: currentUserSend,
                    receiver: destMail
                };

                registeredUsersSend[userIndex].balance -= transAmount;
                registeredUsersSend[userIndex].transactions.push(transactionSender);

                const receiveUserIndex = registeredUsersSend.findIndex(user => user.mail === destMail);
                if (receiveUserIndex !== -1) {
                    const transactionReceiver = { ...transactionSender, type: "deposit" };
                    registeredUsersSend[receiveUserIndex].balance += transAmount;
                    registeredUsersSend[receiveUserIndex].transactions.push(transactionReceiver);
                }

                localStorage.setItem('dbUsers', JSON.stringify(registeredUsersSend));

                // --- ÉXITO Y LIMPIEZA ---
                showAlertMessageSend(alertSendMoney, "alert-success", textSendMoney, "Transferencia realizada con éxito");
                showBalanceSendMoney(currentUserSend, actualBalanceUser, registeredUsersSend[userIndex].balance);

                sendMoneyForm.reset();
                receiverUser.textContent = "";
                document.querySelector("#transferSection").classList.add("containerInvisible");
                
                // Habilito correo para nueva búsqueda
                changeEnableState(destinyMail, findDestinyMail, false);
                transferAmount.required = false;
                transferAmount.removeAttribute('min');

            } else {
                showAlertMessageSend(alertSendMoney, "alert-danger", textSendMoney, "No tienes suficiente saldo");
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


