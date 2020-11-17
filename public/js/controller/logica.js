
import Anuncio_Mascota from '../entidades/anuncioMascota.js';
import {
    crearTabla,
    limpiar
} from '../entidades/tabla.js';

const URL = "http://localhost:5000/mascotas/";


export function obtenerMascotasXhr(){

    return new Promise( (resolve, reject)=>{
      
        const xhr = new XMLHttpRequest();
        let datos;

        xhr.addEventListener('readystatechange', ()=>{

            if(xhr.readyState == 4){ 
                if(xhr.status >= 200 && xhr.status < 300){
                    //Si todo sale bien
                    datos = JSON.parse(xhr.responseText);
    
                    resolve(datos);
    
                }else{
                    //salio todo mal
                    let mensaje = xhr.statusText || "Se produjo un ERROR";
                    reject( {status: xhr.status, statusText: mensaje} );
                }
            }
        });
        xhr.open('GET', URL);

        xhr.send();
    })
}





export function altaMascota(frm){
    const nuevaMascota = {
        "titulo": frm.titulo.value,
        "descripcion": frm.descripcion.value,
        "precio": parseInt(frm.precio.value),
        "animal":frm.animal.value,
        "raza": frm.raza.value,
        "fecha": frm.fecha.value,
        "vacuna": frm.vacuna.value
    }
    const config = {
        method: 'POST',
        headers: {
            "Content-type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(nuevaMascota)
    }

    return fetch(URL,config) //POST con configuracion y datos
    .then((response)=>{
        if(!response.ok) return Promise.reject(response); //retorna una promesa fallida
        return response.json(); //devuelve una promesa que es no bloqueante
    })
    .then((mascotaAgregada)=>{
        console.log("ENTRE AL ALTA ", mascotaAgregada);
       return true;
    })
    .catch((err)=>{
        console.error(err.status);
    })
}


export function bajaMascotaXhr(id){
    try {
        return new Promise( async ( resolve, reject ) => {
            const xhr = new XMLHttpRequest();
    
            xhr.addEventListener( 'readystatechange', () => {
                if ( xhr.readyState == 4 ) {
                    if ( xhr.status >= 200 && xhr.status < 300 ) {
                        resolve( true );
                    } else {
                        let mensaje = xhr.statusText || 'Se produjo un ERROR';
                        reject(  { status: xhr.status, statusText: mensaje } );
                    }
                }
            });
    
            xhr.open( 'DELETE', `${URL}/${id}` );
            xhr.setRequestHeader( 'Content-type', 'application/json;charset=utf-8' );
            xhr.send( );
        });

    } catch ( err ) {
        throw { status: err.status, statusText: err.statusText };
    }

}


export function modificarMascota(mascota){
    let id = mascota.id;
    delete mascota.id;

    const config = {
        method: 'PUT',
        headers: {
            "Content-type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(mascota)
    }

    fetch(URL + id, config) //PUT con configuracion y datos
    .then((response)=>{
        if(!response.ok) return Promise.reject(response); //retorna una promesa fallida
        return response.json(); //devuelve una promesa que es no bloqueante
    })
    .then(mascotaEditada=>{
        console.log("ENTRE A MODIFICAR ", mascotaEditada);
        return mascotaEditada;
    })
    .catch((err)=>{
        console.error(err.status);
    })

}


export function actualizarLista(listaMascotas){
    divTabla.innerHTML = "<img src='image/spinner.gif' style=' margin-top: 5vw;' class='text.center' >";
    setTimeout(() => {
        while (divTabla.firstChild) {
            divTabla.removeChild(divTabla.lastChild);
          }
          divTabla.appendChild(crearTabla(listaMascotas));
    }, 3000);
}

function mostrarSpinner(){
    divTabla.innerHTML = "<img src='image/spinner.gif' style=' margin-top: 5vw;' class='text.center' >";

    setTimeout(() => {
        divTabla.innerHTML = "";
    }, 1000);
}

export async function buscarMascota(id){

    let lista  = await obtenerMascotas();
    lista.forEach(element => {
        if(element['id'] == id){
            let frm = document.forms[0];
            frm.titulo.value = element['titulo'],
            frm.descripcion.value = element['descripcion'],
            frm.precio.value = element['precio'],
            frm.animal.value = element['animal'], 
            frm.raza.value = element['raza'],
            frm.fecha.value = element['fecha'],
            frm.vacuna.value = element['vacuna']
        }
    });
}

export function ocultarBotones(){
    const btns = document.getElementsByTagName('button');

    for (let index = 0; index < btns.length; index++) {
        btns[index].classList.toggle('ocultarBtn');
    }
}


export function promedio(filtro, lista){

    let media;     

    if(filtro != "todos"){

        const listaFiltrada = lista.filter(mascota => mascota.animal == filtro);
        console.log(listaFiltrada);

        const suma = listaFiltrada.reduce( (previo, actual)=>{
            return previo + actual.precio;
        }, 0);
    
        media = suma / listaFiltrada.length;
    
        actualizarLista(listaFiltrada);
    }else{
        const suma = lista.reduce( (previo, actual)=>{
            return previo + actual.precio;
        }, 0);
    
        media = suma / lista.length;
    
        actualizarLista(lista);
    }
    return media;
}








/*
export function obtenerMascotas(){

    return fetch(URL) // GET por default
    .then((response)=>{
        if(!response.ok) return Promise.reject(response); //retorna una promesa fallida
        return response.json(); //devuelve una promesa que es no bloqueante
    })
    .then((data)=>{
        const mascotas = [];

        data.forEach(element => {
            const mascotaOrdenada = new Anuncio_Mascota(
                element.id,
                element.titulo,
                element.descripcion,
                element.precio,
                element.animal,
                element.raza,
                element.fecha,
                element.vacuna
            );
            mascotas.push(mascotaOrdenada);
        });
        return mascotas;
    })
    .catch((err)=>{
        console.error(err.status);
    })
}
*/



/*
export function bajaMascota(id){
    const config = {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json;charset=utf-8"
        }
    }

    fetch(URL + id, config) //PUT con configuracion y datos
    .then((response)=>{
        if(!response.ok) return Promise.reject(response); //retorna una promesa fallida
        return response.json(); //devuelve una promesa que es no bloqueante
    })
    .then(mascotaEliminada=>{
        console.log("ENTRE A ELIMINAR ", mascotaEliminada);
        return mascotaEliminada
    })
    .catch((err)=>{
        console.error(err.status);
    })
}
*/