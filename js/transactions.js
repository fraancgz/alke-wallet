// Variables globales del módulo Transactions
let transactionsList;

// 2. Funciones de lógica (Viven fuera, listas para ser usadas)
function renderTransactions(users, index) {
    const transactionsList = document.querySelector("#transactionsList");

    if (!transactionsList) return;

    transactionsList.innerHTML = ""; // Limpiar
    const user = users[index] || {}
    const history = users[index].transactions || []

    if (history.length === 0) {
        transactionsList.innerHTML = `<p class="text-center text-muted">No hay transacciones aún.</p>`
        return;
    }

    history.toReversed().forEach(transaction => {
        const isDeposit = transaction.type === 'deposit'
        const color = isDeposit ? 'success' : 'danger'
        const symbol = isDeposit ? '+' : '-'
        const transaccionDate = new Date(transaction.date)

        const dateTrans = transaccionDate.toLocaleDateString('es-ES'); // "27/01/2026"
        const hourTrans = transaccionDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); // "18:26"
       
        const cardHTML = `
            <div class="card border-0 shadow-sm border-start border-${color} border-5">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1 fw-bold text-capitalize">${dateTrans} | ${hourTrans}</h6>
                        <p class="mb-1 text-muted">Origen: ${transaction.sender}</p>
                        <small class="text-muted">Destino: ${transaction.receiver}</small>
                       
                    </div>
                    
                    <div class="text-end">
                        <span class="h5 fw-bold text-${color}">
                            ${symbol} $${transaction.amount.toLocaleString('es-CL')}
                        </span>
                        <div class="small text-uppercase opacity-50" style="font-size: 0.7rem;">
                            ${isDeposit ? 'Depósito' : 'Transferencia'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Agregamos la tarjeta al final del contenedor
        transactionsList.innerHTML += cardHTML;
    });
}


function initTransactions() {
    const el = document.getElementById("transactionsList");
    if (!el) return;

    // Lógica de cargar usuarios y renderizar
    const registeredUsers = JSON.parse(localStorage.getItem('dbUsers')) || [];
    const currentUser = localStorage.getItem('currentUser')
    const userIndex = registeredUsers.findIndex(user => user.mail === currentUser)

    const profileName = document.querySelector("#profileName")
    const profileMail = document.querySelector("#profileEmail")

    profileName.textContent = registeredUsers[userIndex].username
    profileMail.textContent = currentUser

    
    // Ejecutamos la carga de datos
    renderTransactions(registeredUsers, userIndex);

}
