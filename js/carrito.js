/********* PRODUCTOS CARRITO *********/
let productosLS = localStorage.getItem("productos-carrito");
productosLS = JSON.parse(productosLS);

const contenedorCarrito = document.querySelector("#contenedor-productos-carrito");
const contenedorTotal = document.querySelector("#total");
const contenedorTotalConfirmar = document.querySelector("#total-confirmar");

const volverIndex = document.querySelector("#volver-tienda");

mostrarProductosCarrito(productosLS);

function mostrarProductosCarrito(productos) {

    contenedorCarrito.innerHTML = "";

    productos.forEach( producto => {

        const {imagen, titulo, cantidad, precio} = producto;

        const div = document.createElement("div");

        div.classList.add("producto-agregado");
        div.innerHTML = `
          <div class="producto-img"><img src="${imagen}" alt="${titulo}"></div>
          <div class="producto-nombre">${titulo}</div>
          <div class="producto-cantidad">${cantidad}</div>
          <div class="producto-precio">$${precio}</div>
        `;

        contenedorCarrito.append(div);
    });

    actualizarTotal();

}

function actualizarTotal(){
    const totalCalculado =  productosLS.reduce((acumulador, producto) => acumulador + (producto.precio * producto.cantidad), 0);
    contenedorTotal.textContent = `$${totalCalculado}`;
    contenedorTotalConfirmar.textContent = `$${totalCalculado}`;
}

volverIndex.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    productosLS.length = 0;
    localStorage.setItem("productos-carrito", JSON.stringify(productosLS));
}

/********* CARRITO - PASOS DE CONFIRMACION *********/
const divDetalles = document.querySelector("#detalles");
const divPago = document.querySelector("#pago");
const divConfirmacion = document.querySelector("#confirmacion");

const carritoDetallesForm = document.querySelector("#carrito-detalles-form");

const carritoPagoFormConfirmar = document.querySelector("#carrito-pago-form");
const BotonPagoFormAtras = document.querySelector("#boton-pago-atras");

const pasosDetallesNumero = document.querySelector("#pasos-detalles-numero");
const pasosDetallesTexto = document.querySelector("#pasos-detalles-texto");
const pasosPagoNumero = document.querySelector("#pasos-pago-numero");
const pasosPagoTexto = document.querySelector("#pasos-pago-texto");
const pasosConfirmacionNumero = document.querySelector("#pasos-confirmacion-numero");
const pasosConfirmacionTexto = document.querySelector("#pasos-confirmacion-texto");

const contenedorInformacion = document.querySelector("#informacion-personal");

/* Detalle Compra */
carritoDetallesForm.addEventListener("submit", confirmarDetalles);

/* Pago Compra */
BotonPagoFormAtras.addEventListener("click", atrasPago);
carritoPagoFormConfirmar.addEventListener("submit", confirmarPago);

function confirmarDetalles (evt) {
    evt.preventDefault();

    pasosDetallesNumero.classList.remove("active");
    pasosDetallesTexto.classList.remove("active");

    pasosPagoNumero.classList.add("active");
    pasosPagoTexto.classList.add("active");
    
    pasosConfirmacionNumero.classList.remove("active");
    pasosConfirmacionTexto.classList.remove("active");
    
    divDetalles.classList.add("disabled");
    divPago.classList.remove("disabled");

    contenedorInformacion.classList.remove("disabled")
    
    contenedorInformacion.innerHTML = "" 

    let infoPersonal = document.createElement("div"); // Agrega toda la info personal en la columna derecha
    infoPersonal.className = "informacion-personal";
    infoPersonal.innerHTML = `
      <h3>Tus detalles</h3>

      <div class="informacion-personal__nombre">${carritoDetallesForm[0].value} ${carritoDetallesForm[1].value}</div>
      <div class="informacion-personal__email">${carritoDetallesForm[2].value} - ${carritoDetallesForm[3].value} - ${carritoDetallesForm[4].value}</div>
      <div class="informacion-personal__pais">${carritoDetallesForm[5].value} ${carritoDetallesForm[6].value} - ${carritoDetallesForm[7].value}</div>
      <div class="informacion-personal__direccion">${carritoDetallesForm[8].value} - ${carritoDetallesForm[9].value}</div>
    `;
    contenedorInformacion.append(infoPersonal);
}

function atrasPago (evt) {
    evt.preventDefault();
    
    pasosDetallesNumero.classList.add("active");
    pasosDetallesTexto.classList.add("active");

    pasosPagoNumero.classList.remove("active");
    pasosPagoTexto.classList.remove("active");

    pasosConfirmacionNumero.classList.remove("active");
    pasosConfirmacionTexto.classList.remove("active");

    divDetalles.classList.remove("disabled");
    divPago.classList.add("disabled");
    divConfirmacion.classList.add("disabled");

    contenedorInformacion.classList.add("disabled")
}

function confirmarPago (evt) {
    evt.preventDefault();

    pasosConfirmacionNumero.classList.add("active");
    pasosConfirmacionTexto.classList.add("active");

    pasosPagoNumero.classList.remove("active");
    pasosPagoTexto.classList.remove("active");

    divPago.classList.add("disabled");
    divConfirmacion.classList.remove("disabled");
}