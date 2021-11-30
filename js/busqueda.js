'use strict';

import API from './api.js';
import {mostrarMenuPrincipal, ocultarMenuPrincipal, mostrarBotonIrArriba, irArriba} from './funciones.js';

(() => {
    let api = new API();

    // Método principal de la aplicación
    function main() {
        document.addEventListener('DOMContentLoaded', iniciarApp);
    }

    // Ejecuta los métodos iniciales de la aplicación
    function iniciarApp() {
        renderizarClasesSelect();
        iniciarListeners();
    }

    // Asigna los listeners a sus respectivos elementos
    function iniciarListeners() {
        const botonBusqueda = document.querySelector('#button-search');
        const botonIrArriba = document.querySelector('.irArriba-contenedor');
        const botonMenu = document.querySelector('#boton-menu');

        document.addEventListener('click', ocultarMenuPrincipal);        
        window.addEventListener('scroll', mostrarBotonIrArriba);
        botonBusqueda.addEventListener('click', consultarHerramientas);
        botonIrArriba.addEventListener('click', irArriba);
        botonMenu.addEventListener('click', mostrarMenuPrincipal);
    }

    function ocultarElemento(elemento) {
        if (!elemento.classList.contains('oculto')) {
            elemento.classList.add('oculto');
        }
    }

    function mostrarElemento(elemento) {
        if (elemento.classList.contains('oculto')) {
            elemento.classList.remove('oculto');
        }
    }

    function mostrarError(mensaje) {
        const error = document.querySelector('#error');
        const mensajeError = document.querySelector('#error .error-info .error-description');

        mensajeError.textContent = mensaje;

        mostrarElemento(error);
    }

    // Copia el link de una herramienta en el portapapeles
    function copiarLink(e) {
        const input = document.createElement('input');

        input.value = this.dataset.url;        
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();

        animacionLinkCopiado(this);
    }

    // Ejecuta una animación al copiar un link
    function animacionLinkCopiado(boton) {
        const copiado = boton.firstElementChild;

        if(copiado.classList.contains('oculto')){
            copiado.classList.remove('oculto');
            copiado.classList.add('panel-copiado');

            setTimeout(() =>{
                copiado.classList.remove('panel-copiado');
                copiado.classList.add('oculto');
            },3000);
        }
    }   

    // Reporta un link inactivo o roto
    async function reportarLink(e) {
        let id = this.dataset.id;
        
        if(await api.actualizarStatusHerramienta('tools',id,'reportado')){
            this.classList.add('reportado');
            this.lastElementChild.textContent = "Reportado";
        }
    }

    // Renderiza las clases de herramientas en el Select
    async function renderizarClasesSelect() {
        const selectClase = document.querySelector('#select-clase');        
        const optionDefault = document.createElement('option');
        const clases = await obtenerClases();

        while(selectClase.firstChild){
            selectClase.removeChild(selectClase.firstChild);
        }

        optionDefault.value = 'ninguno';
        optionDefault.textContent = '- Seleccionar Clase de Recurso -';

        selectClase.appendChild(optionDefault);

        for(let i = 0; i < clases.length; i++) {
            const option = document.createElement('option');

            option.value = clases[i].category;
            option.textContent = clases[i].category;

            selectClase.appendChild(option);
        }
    }
    
    // Obtiene de la base de datos las clases de herramientas registradas
    async function obtenerClases() {                
        let resultados;
        let datos = [];
        
        resultados = await api.obtenerColeccion('categories');

        if(resultados.length > 0){
            for(let i=0; i<resultados.length; i++) {                
                datos.push(resultados[i].data());
            }

            datos = datos.sort((a,b) => {
                b.category - a.category;
            });
            
            return datos;        
        } else {
            return [];
        }
    }

    // Consulta las herramientas disponibles bajo los parámetros de búsqueda indicados
    async function consultarHerramientas(e) {
        e.preventDefault();
        
        const selectClase = document.querySelector('#select-clase');
        const inputValor = document.querySelector('#input-valor');
        const claseSeleccionada = selectClase.options[selectClase.selectedIndex].value;
        const sinResultados = document.querySelector('#sin-resultados');
        const spinner = document.querySelector('#spinner');
        const cardBody = document.querySelector('.busqueda .card-body');        
        let herramientas;

        limpiarListaHerramientas();

        cardBody.style.height = 'auto';

        mostrarElemento(spinner);

        if (validarCampos(claseSeleccionada, inputValor.value)) {
            herramientas = await obtenerHerramientas(claseSeleccionada, inputValor.value);

            if (herramientas.length > 0) {
                ocultarElemento(spinner);

                renderizarHerramientas(claseSeleccionada,inputValor.value, herramientas);
            } else {
                ocultarElemento(spinner);
                mostrarElemento(sinResultados);
            }
        } else {
            ocultarElemento(spinner);
            mostrarError("Si no especificas una clase debes especificar un valor de búsqueda");
        }

        inputValor.value = '';
        selectClase.selectedIndex = 0;
    }

    // Renderiza las herramientas que fueron extraidas de la base de datos bajo los parámetros indicados
    function renderizarHerramientas(clase, valorBusqueda, herramientas) {
        const listaHerramientas = document.querySelector('#lista-recursos');        
        const coincidencias = document.querySelector('#coincidencias');

        for (let i = 0; i < herramientas.length; i++) {
            const articulo = document.createElement('article');
            const header = document.createElement('header');    
            const resourceBody = document.createElement('div');
            const resourceDescription = document.createElement('p');
            const resourceUrl = document.createElement('div');
            const botonSitio = document.createElement('a');
            const botonCopiar = document.createElement('button');
            const botonReportar = document.createElement('button');          
            let estado = '';
            
            header.innerHTML = `
                <div class="favicon-box">       
                    <img height="16" width="16" src='http://www.google.com/s2/favicons?domain=${herramientas[i].url}'/>                         
                </div>      
                <h2>${herramientas[i].name}</h2>
            `;

            resourceBody.classList.add('resource-body');

            resourceDescription.textContent = herramientas[i].description;
            resourceDescription.classList.add('resource-description');
            
            resourceUrl.classList.add('resource-url')

            botonSitio.classList.add('resource-boton');
            botonSitio.href = herramientas[i].url;
            botonSitio.setAttribute('rel','noopener noreferrer');
            botonSitio.title = "Visitar sitio web";
            botonSitio.target = "_blank";
            botonSitio.innerHTML = `
                <div class="icon-box">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>
                <p>Abrir</p>
            `;

            botonCopiar.classList.add('resource-boton');
            botonCopiar.title = "Copiar enlace";
            botonCopiar.setAttribute('data-url',herramientas[i].url);
            botonCopiar.innerHTML = `
                <p class="oculto">Copiado</p>
                <div class="icon-box">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <p>Copiar</p>
            `;
            botonCopiar.addEventListener('click',copiarLink);

            if(herramientas[i].status == 'reportado'){
                botonReportar.classList.add('resource-boton','reportado');
                estado = "Reportado"
            }else{
                botonReportar.classList.add('resource-boton');
                estado = "Reportar"
            }

            botonReportar.title = "Reportar enlace roto";
            botonReportar.setAttribute('data-id',herramientas[i].id);
            botonReportar.innerHTML = `
                <div class="icon-box">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                </div>
                <p>${estado}</p>
            `;
            botonReportar.addEventListener('click',reportarLink);

            resourceUrl.appendChild(botonSitio);
            resourceUrl.appendChild(botonCopiar);
            resourceUrl.appendChild(botonReportar);

            resourceBody.appendChild(resourceDescription);
            resourceBody.appendChild(resourceUrl);

            articulo.classList.add('resource');

            articulo.appendChild(header);
            articulo.appendChild(resourceBody);            

            listaHerramientas.appendChild(articulo);
        }
        
        if(clase != 'ninguno' && valorBusqueda == ''){
            coincidencias.innerHTML = clase + ': ' + herramientas.length + (herramientas.length == 1? ' resultado':' resultados');
        }else if(clase == 'ninguno' && valorBusqueda != ''){
            coincidencias.innerHTML = valorBusqueda + ': ' + (herramientas.length + herramientas.length == 1? ' resultado':' resultados');
        }else if(clase != 'ninguno' && valorBusqueda != ''){
            coincidencias.innerHTML = clase + ' (' + valorBusqueda + '): ' + herramientas.length + (herramientas.length == 1? ' resultado':' resultados');
        }        

        mostrarElemento(coincidencias);
    }

    // Consulta las herramientas de la base de datos y las filtra según los parámetros indicados por el usuario
    async function obtenerHerramientas(clase, valor) {
        let datos;
        let resultado = [];
        let datoActual;
        let agregar;

        valor = valor.toLowerCase();
        
        try {
            datos = await api.obtenerColeccion('tools');            

            for (let i = 0; i < datos.length; i++) {
                datoActual = datos[i].data();
                agregar = false;

                if(datoActual.status != 'pendiente'){
                    if (clase == 'ninguno') {
                        agregar = datoActual.name.toLowerCase().includes(valor);
                    } else {
                        if (valor == '') {
                            agregar = datoActual.category == clase;
                        } else {
                            agregar = datoActual.category == clase && datoActual.name.toLowerCase().includes(valor);
                        }
                    }

                    if(agregar) {
                        datoActual.id = datos[i].id;
                        resultado.push(datoActual);
                    }
                }
            }

            resultado = resultado.sort((a,b) => {
                a.name - b.name;
            });

            return resultado;
        } catch (error) {
            console.error(error);

            return [];
        }
    }   

    // Valida que los parámetros de búsqueda tengan valores correctos
    function validarCampos(clase, valor) {
        return (clase == 'ninguno' && valor != '') || (clase != 'ninguno');
    }

    // Limpia la lista de herramientas
    function limpiarListaHerramientas() {
        const spinner = document.querySelector('#spinner');
        const sinResultados = document.querySelector('#sin-resultados');
        const error = document.querySelector('#error');
        const listaHerramientas = document.querySelector('#lista-recursos');
        const cardBody = document.querySelector('.busqueda .card-body');
        const coincidencias = document.querySelector('#coincidencias');

        cardBody.style.height = 0;

        ocultarElemento(spinner);
        ocultarElemento(sinResultados);
        ocultarElemento(error);
        ocultarElemento(coincidencias);

        while (listaHerramientas.firstChild) {
            listaHerramientas.removeChild(listaHerramientas.firstChild);
        }
    }      

    // Ejecución principal
    main();
})();

