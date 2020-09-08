/**
 * 2C = Two of Clubs
 * 2D = Two of Diamonds
 * 2H = Two of Hearts
 * 2S = Two of spades
 */
// Usar javascript minifier.
/**
* ---------Manipular DOM---------
*document.querySelector() -> Me da retorna el primer elemento que encuentra. #->id . -> clase.(RECOMENDADO).
*document.querySelector.All() -> Me da retorna todos los elementos que satisfagan esa busqueda.
*document.querySelector().innerHTML -> Pone texto html con su respectivo formato.
*document.querySelector().innerText -> Pone texto plano directamente ahi.
*document.getElementById() -> Retorna el elemento que coincida con el id.
*document.getElementsByClassName() -> Retorna el elemento que coincida con esa clase.
*-----Crear elementos HTML desde js----
*const divBotones = document.querySelector('#divBotones);
*const botonNuevo = document.createElement('button');
*divBotones.append(botonNuevo);
*botonNuevo.classList.add('btn-success');
*
*/

// USO DE PATRON MÓDULO

// Funcion anónima.
// Es una forma de que el usuario no acceda a las funciones ni a los datos.
const miModulo = (() => {
    'use strict'
    let deck = [],
        puntosJugadores = [];

    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedirCarta'),
        btnNuevoJuego = document.querySelector('#btnNuevoJuego'),
        btnDetener = document.querySelector('#btnDetener'),
        puntosHTML = document.querySelectorAll('small'),
        divCartas = document.querySelectorAll('#div-cartas');

    // Inicializa el juego.Por defecto 1 jugador.
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = []; 
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        // Recorro y limpio.
        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartas.forEach( elem => elem.innerHTML = '');
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    // Esta funcion crea una nueva baraja y la mezcla.
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo)
            }
        }
        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push(especial + tipo);
            }
        }
        // Mezclar la baraja
        return _.shuffle(deck);
    }

    // Esta funcion me permite tomar una carta.
    const pedirCarta = () => {
        if (deck.length == 0) throw 'No hay cartas en el deck.'
        // Agarro el ultimo elemento del arreglo.
        return deck.pop();
    }

    // Funcion para saber cuanto vale la carta que extraigo.
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        // Verifico si es un numero o no lo que esta adentro.True si no es un numero.
        if (isNaN(valor)) return (valor === 'A') ? 11 : 10;
        else return valor * 1;
    }

    // Turno:0 = primer jugador y el último será la computadora.
    const acumularPuntos = (turno, carta) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        let imagen = document.createElement('img');
        imagen.src = `assets/cartas/${carta}.png`;
        imagen.classList.add('carta');
        divCartas[turno].append(imagen);
    }

    // Funcion del turno de la computadora.
    const turnoComputadora = (puntosMinimos) => {
        while ((puntosJugadores[puntosJugadores.length - 1] <= 21) && (puntosJugadores[puntosJugadores.length - 1] <= puntosMinimos)) {
            let carta = pedirCarta();
            acumularPuntos(puntosJugadores.length - 1, carta);
            crearCarta(carta, puntosJugadores.length - 1);
            if (puntosMinimos > 21 || puntosMinimos == 0)
                break;
        }
        const determinarGanador = () => {
            const [puntosMinimos, puntosComputadora] = puntosJugadores;
            setTimeout(() => {
                if ( puntosComputadora == puntosMinimos)
                    alert('Empate!')
                else if (puntosMinimos > 21)
                    alert('Computadora gana!')
                else if ( puntosComputadora > 21)
                    alert('Usted gana!')
                else alert('Computadora gana!')
            }, 20);
        }
        determinarGanador();
    }


    // Eventos
    // Pedir carta.
    // Funcion callback -> Funcion que se envía como parametro.
    btnPedir.addEventListener('click', function () {
        let carta = pedirCarta(),
        puntosAcumulados = acumularPuntos(0, carta);
        crearCarta(carta, 0);
        if (puntosAcumulados > 21) {
            btnDetener.disabled = true;
            btnPedir.disabled = true;
            turnoComputadora(puntosAcumulados);
        } else if (puntosAcumulados == 21) {
            turnoComputadora(puntosAcumulados);
            btnDetener.disabled = true;
            btnPedir.disabled = true;
        }
    });

    // Boton detener
    btnDetener.addEventListener('click', function () {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    // Boton nuevo juego
    btnNuevoJuego.addEventListener('click', function () {
        inicializarJuego();
    });

    // Todo lo que retorne aca es lo que se va a ver al importar el módulo.
    return {
      nuevoJuego: inicializarJuego
    };
})();

