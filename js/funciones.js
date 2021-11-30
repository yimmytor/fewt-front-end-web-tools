'use strict'

// Oculta el menu principal al hacer click fuera de él
export function ocultarMenuPrincipal(e) {
    let ocultar = false;
    let elemento = e.target.closest('ul');

    if(elemento == null){
        elemento = e.target.closest('button');

        if(elemento == null) {
            ocultar = true;
        } else {
            if(elemento.id != 'boton-menu') {
                ocultar = true;
            }
        }
    }else{            
        if(elemento.id != 'menu') {                
            ocultar = true;                
        }
    }

    if(ocultar) {
        const menu = document.querySelector('#menu');
        
        menu.classList.remove('menu-visible');
    }
}

// Muestra el menu principal
export function mostrarMenuPrincipal() {
    const menu = document.querySelector('#menu');

    menu.classList.add('menu-visible');
}

// Muestra un botón para desplazarse a la parte superior de la página
export function mostrarBotonIrArriba() {
    if(document.documentElement.scrollTop > 200){
        document.querySelector('.irArriba-contenedor').classList.add('boton-visible');
    }else{
        document.querySelector('.irArriba-contenedor').classList.remove('boton-visible');
    }
}

// Realiza el desplazamiento a la parte superior de la página
export function irArriba() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}