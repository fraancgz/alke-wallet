// Al cargar el Home...
// Estas variables son "globales" para el archivo que se cargue
const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_db')) || [];
const mailActivo = localStorage.getItem('usuarioActivo');
// console.log(usuariosRegistrados)
// console.log(mailActivo)

if (mailActivo) {
    // Busco los datos del usuario en el array principal
    const datosUsuario = usuariosRegistrados.find(user => user.mail === mailActivo);

    if (datosUsuario) {
        document.querySelector(".user").textContent = `Hey ${datosUsuario.username}, bienvenido`
    } else 
        console.log("no")
}

function cargarVista(vista) {
    const contenedorDinamico = document.querySelector("#contenedorDinamico")

    // Mediante la funcion fetch se inicia el proceso de comunicación de red para obtener la pagina solicitada
    // En resumen, busca el archivo HTML
    fetch(vista)
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar la vista")
                console.log(response)
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
