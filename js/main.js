const carritoBoton = document.querySelector("#boton-carrito");
const carritoMain = document.querySelector("#main-carrito");
const cerrarCarritoBoton = document.querySelector("#cerrar-carrito");

const botonesCategorias = document.querySelectorAll(".cat");
const tituloPrincipal = document.querySelector("#titulo-principal");

const contenedorProductos = document.querySelector("#main-productos");
const cantidad = document.querySelector("#cantidad-productos");
let botonesAgregar = document.querySelectorAll(".producto-agregar");

const carritoProductos = document.querySelector("#carrito-productos");
const botonVaciar = document.querySelector("#vaciar-carrito");

const contenedorTotal = document.querySelector("#total");

const buscadorHeader = document.querySelector("#header-buscador");
const buscadorInput = document.querySelector("#buscador-input");

const productosAgregadosNombres = document.querySelectorAll(".producto-nombre");

const pedirProductos = async () => {
    const resp = await fetch ("./js/productos.json");
    let productos = await resp.json();
    return productos;
}

let productos = pedirProductos();

productos
.then( productos => {
    mostrarProductos(productos);
    cargarBotonesCategorias(productos);
});

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-carrito");

if (productosEnCarritoLS){
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarCantidad();
    mostrarProductosCarrito(productosEnCarrito);
} else{
    productosEnCarrito = [];
}

function cargarBotonesCategorias(productos) {
    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
    
            botonesCategorias.forEach(boton => boton.classList.remove("active"));
            e.currentTarget.classList.add("active");
    
            if (e.currentTarget.id != "todos") {
                const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
                tituloPrincipal.textContent = productoCategoria.categoria.nombre;
                const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
                mostrarProductos(productosBoton);
                tituloPrincipal.scrollIntoView();
            } else {
                tituloPrincipal.textContent = "Todos los productos";
                mostrarProductos(productos);
                tituloPrincipal.scrollIntoView();
            }
    
        })
    });
}

carritoBoton.addEventListener("click", abrirCarrito);
cerrarCarritoBoton.addEventListener("click", cerrarCarrito);

function abrirCarrito () {
    carritoBoton.classList.add("disabled");
    carritoMain.classList.remove("disabled");

    confirmarFaltaDeProductos();
}
    
function cerrarCarrito () {
    carritoBoton.classList.remove("disabled");
    carritoMain.classList.add("disabled");
}

function mostrarProductos (productos) {

    contenedorProductos.innerHTML = "";

    productos.forEach( producto => {

        const {imagen, titulo, precio, id} = producto;

        const div = document.createElement("div");

        div.classList.add("producto");
        div.innerHTML = `
          <img src="${imagen}" alt="${titulo}">
          <div class="producto-descripcion">
              <p><b>${titulo}</b></p>
              <p>$${precio}</p>
              <button class="producto-agregar" id="${id}">AGREGAR</button>
          </div>
        `;        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProductoCarrito);
    });
}

function agregarProductoCarrito(e){
        
    const idBoton = e.currentTarget.id;

    let productos = pedirProductos();
    productos
    .then( productos => {
        const productoAgregar = productos.find(producto => producto.id == idBoton);

        if (productosEnCarrito.some(producto => producto.id == idBoton)){
            const indexProducto = productosEnCarrito.findIndex(producto => producto.id == idBoton);
            productosEnCarrito[indexProducto].cantidad += 1;
        } else{
            productoAgregar.cantidad = 1;
            productosEnCarrito.push(productoAgregar);
        }

        actualizarCantidad();

        localStorage.setItem("productos-carrito", JSON.stringify(productosEnCarrito));

        productosEnCarritoLS = localStorage.getItem("productos-carrito");
        productosEnCarrito = JSON.parse(productosEnCarritoLS);

        mostrarProductosCarrito(productosEnCarrito);

    });

    Toastify({
        text: "Producto Agregado",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#27292b",
          color: "#fee801",
          fontSize: ".7rem",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

function actualizarCantidad(){
    let num = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad , 0);
    cantidad.innerText = num;
}

function mostrarProductosCarrito(productos) {

    carritoProductos.innerHTML = "";

    productos.forEach( producto => {

        const {imagen, titulo, cantidad, precio, id} = producto;

        const div = document.createElement("div");

        div.classList.add("producto-agregado");
        div.innerHTML = `
          <div class="producto-img"><img src="${imagen}" alt="${titulo}"></div>
          <div class="producto-nombre">${titulo}</div>
          <div class="producto-cantidad">${cantidad}</div>
          <div class="producto-precio">$${precio}</div>
          <div class="producto-borrar" id="${id}"><i class="bi bi-trash-fill"></i></div>
        `
        carritoProductos.append(div);
    });

    actualizarBotonesEliminar();
    actualizarTotal();
}

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".producto-borrar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    mostrarProductosCarrito(productosEnCarrito);

    localStorage.setItem("productos-carrito", JSON.stringify(productosEnCarrito));

    confirmarFaltaDeProductos();
    actualizarCantidad();

    Toastify({
        text: "Producto Eliminado",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#27292b",
          color: "#fee801",
          fontSize: ".7rem",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {

    if(cantidad.innerText != 0){
        swal.fire({
            title: '¿Deseas vaciar el carrito?',
            text: `Tenés ${cantidad.innerText} ${cantidad.innerText > 1 ? "productos" : "producto"} en el carrito.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            background: '#fee801',
            confirmButtonColor: '#27292b',
            color: '#27292b', 
            iconColor: 'red',
            reverseButtons: true,
        }).then(result => {
            if(result.isConfirmed){
                Swal.fire({
                    text: `Carrito vacio! Se eliminaron ${cantidad.innerText} producto/s.`,
                    icon: 'success',
                    background: '#fee801',
                    color: '#27292b',
                    iconColor: 'green',
                    confirmButtonColor: '#27292b',
                })
    
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-carrito", JSON.stringify(productosEnCarrito));
                mostrarProductosCarrito(productosEnCarrito);
    
                confirmarFaltaDeProductos();
                actualizarCantidad();
            }
        })
    } else {
        swal.fire({
            text: `No tenes productos en el carrito`,
            icon: 'error',
            confirmButtonText: 'Ok',
            background: '#fee801',
            confirmButtonColor: '#27292b',
            color: '#27292b', 
            iconColor: 'red',
        });
    }

}

function actualizarTotal(){
    const totalCalculado =  productosEnCarrito.reduce((acumulador, producto) => acumulador + (producto.precio * producto.cantidad), 0);
    contenedorTotal.textContent = `$${totalCalculado}`;
}

function confirmarFaltaDeProductos(){
    if(carritoProductos.innerHTML == "" || carritoProductos.innerHTML == null) {
        const p = document.createElement("p");
        p.textContent = "No hay Productos";
        carritoProductos.append(p); 
    }
}

buscadorHeader.addEventListener("submit", buscarJuego);

function buscarJuego(evt) {
    evt.preventDefault();

    const input = buscadorInput.value.toLowerCase();
    
    let productos = pedirProductos();

    productos
    .then( productos => {

        const array = productos.filter( 
            producto => producto.titulo.toLowerCase().includes(input)
        );

        if (array.length === 0 || input === "" || input == " "){
            array.length = 0;
            tituloPrincipal.textContent = `No se encontro "${input}"`;
            tituloPrincipal.scrollIntoView();
            mostrarProductos(array);
        } else {
            tituloPrincipal.textContent = `Resultados de "${input}"`;
            mostrarProductos(array);
            tituloPrincipal.scrollIntoView();
        }

    });

    buscadorHeader.reset();
}