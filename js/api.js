'use strict';

export default class API {
    constructor(){
        // Objeto de configuración para acceder a la Base de Datos
        firebase.initializeApp({
            apiKey: "AIzaSyC0I4h5WtUcmHRq79RmXJRWpWAOas76s4U",
            authDomain: "web-tools-app.firebaseapp.com",
            databaseURL: "https://web-tools-app.firebaseio.com",
            projectId: "web-tools-app",
            storageBucket: "web-tools-app.appspot.com",
            messagingSenderId: "139303521073",
            appId: "1:139303521073:web:2cd99c371c5e1ee23e7e10",
            measurementId: "G-D228X5VB4B"
        });

        this.dataBase = firebase.firestore();
    }

    // Devuelve los dcoumentos de una colección de Firestore
    async obtenerColeccion(coleccion) {
        let datos;

        try {
            datos = await this.dataBase.collection(coleccion);
            datos = await datos.get();
            datos = await datos.docs;

            return datos;
        } catch (error) {
            console.error('Error al obtener la colección ' + coleccion + ':', error);

            return [];
        }
    }

    // Obtiene el documento de una colección de Firestore
    async obtenerDocumento(coleccion,id){
        let documento;

        try {
            documento = await this.dataBase.collection(coleccion).doc(id);
            documento = await documento.get();
            
            return documento;
        } catch (error) {
            console.error('Error al verificar la existencia de la herramienta:', error);

            return undefined;
        }
    }

    // Actualiza el estatus de una herramienta
    async actualizarStatusHerramienta(coleccion, id, status) {
        try {
            let herramienta = await this.obtenerDocumento(coleccion, id);

            herramienta = herramienta.data();

            if(herramienta != undefined){
                if (herramienta.status != status) {
                    herramienta.status = status;

                    await this.dataBase.collection(coleccion).doc(id).update(herramienta);
                    
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al actualizar el status de la herramienta a ' + status + ':', error);

            return false;
        }        
    }
}