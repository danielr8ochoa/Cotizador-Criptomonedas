const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

//Promise para cargar listado de criptomonedas
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();
  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  //Validar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  //Consultar la API con los resultados
  consultarAPI();
}

function mostrarAlerta(msg) {
  const existeError = document.querySelector(".error");

  if (!existeError) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");
    //Mensaje de error
    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) =>
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    );
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  //PRECIO
  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

  //PRECIO MÁS ALTO DEL DÍA
  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `Precio m&aacute;s alto del d&iacute;a: <span>${HIGHDAY}</span> `;

  //PRECIO MÁS BAJO DEL DÍA
  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `Precio m&aacute;s bajo del día: <span>${LOWDAY}</span> `;

  //VARIACIÓN EN EL DÍA
  const variacion = document.createElement("p");
  variacion.innerHTML = `Variaci&oacute;n &uacute;ltimas 24 horas: <span>${CHANGEPCT24HOUR}%</span> `;

  //ÚLTIMA ACTUALIZACIÓN
  const actualizacion = document.createElement("p");
  actualizacion.innerHTML = `&Uacute;ltima actualizaci&oacute;n: <span>${LASTUPDATE}</span> `;

  //AGREGAR RESULTADOS AL DOM
  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(variacion);
  resultado.appendChild(actualizacion);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML();

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>  
  `;
  resultado.appendChild(spinner);
}
