$(document).ready(function() {
    // Al hacer clic en "Regístrate"
    $('#go-to-register').on('click', function(e) {
        e.preventDefault();
        // Movemos el panel hacia la izquierda, quitamos el color azul y colocamos el verde
        $('.sliding-panel').addClass('move-left bg-accent-custom');
        $('.sliding-panel').removeClass('bg-primary-custom');
    });
          

    // Al hacer clic en "Inicia Sesión"
    $('#go-to-login').on('click', function(e) {
        e.preventDefault();
        // Devolvemos el panel a su posicion inicial, quitamos el color verde y agregamos el azul
        $('.sliding-panel').removeClass('move-left bg-accent-custom');
        $('.sliding-panel').addClass('bg-primary-custom');
    });
});