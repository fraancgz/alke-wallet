// Al cargar el Home...
// Estas variables son "globales" para el archivo que se cargue
const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_db')) || [];
const mailActivo = localStorage.getItem('usuarioActivo');
console.log(usuariosRegistrados)
console.log(mailActivo)

if (mailActivo) {
    // Busco los datos del usuario en el array principal
    const datosUsuario = usuariosRegistrados.find(user => user.mail === mailActivo);

    if (datosUsuario) {
        // Modificamos el DOM
        console.log("Si")
        document.querySelector(".user").textContent = `Hey ${datosUsuario.username}, bienvenido`
    } else 
        console.log("no")
}
