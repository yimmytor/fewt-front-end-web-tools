'use strict';

import API from './api.js';
import {mostrarMenuPrincipal, ocultarMenuPrincipal} from './funciones.js';

(() => {
    let api = new API();

    // Método principal de la aplicación
    function main() {
        document.addEventListener('DOMContentLoaded', iniciarApp);
    }

    // Ejecuta los métodos iniciales de la aplicación
    function iniciarApp() {
        iniciarListeners();
    }

    // Asigna los listeners a sus respectivos elementos
    function iniciarListeners() {
        const botonMenu = document.querySelector('#boton-menu');

        document.addEventListener('click', ocultarMenuPrincipal);        
        botonMenu.addEventListener('click', mostrarMenuPrincipal);
    }        
    
    // Ejecución principal
    main();
})();

