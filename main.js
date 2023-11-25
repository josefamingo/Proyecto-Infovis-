const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

const WIDTH_VIS_1 = 1000;
const HEIGHT_VIS_1 = 500;

const WIDTH_VIS_2 = 800;
const HEIGHT_VIS_2 = 800;

SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);

// Crear tooltip vacío con clase "tooltip". En el CSS está todo lo necesario
let tooltip = d3.select("body").append("div")
    .style("opacity", 0)
    .style("width", 200)
    .style("height", 50)
    .style("pointer-events", "none")
    .style("background", "rgb(117, 168, 234)")
    .style("border-radius", "8px")
    .style("padding", "4px")
    .style("position", "absolute");

function parseo(d) {
  return {
    titulo: d["Título"],
    director: d.Director,
    pais: d["País"],
    estreno_fecha: d["Año estreno (Fecha)"],
    estreno_ano: +d["Año estreno (Número)"],
    adicion: d["Fecha adición"],
    calificacion: d["Calificación"],
    duracion: +d["Duración"],
    categoria_duracion: d["Categoría Duración"],
    latitud_random: +d["Latitud Random"],
    longitud_random: +d["Longitud Random"],
  };
}

function Color(calificacion) {
  const colorMap = {
      'G': "rgb(240, 115, 5)",
      'NR': "",
      "PG": "green",
      "PG-13": "green",
      "R": "purple",
      "TV-14": "yellow",
      "TV-G": "rgb(5, 240, 205)",
      "TV-MA": "blue",
      "TV-PG": "rgb(173, 240, 5)",
      "TV-Y7": "red",
      "TV-Y": "red",
      "UR": ""
    };

  return colorMap[calificacion] 
};


d3.csv("data.csv", parseo)
  .then((datos) => {
    console.log(datos);

      minimoLongitud = d3.min(datos, d => d.longitud_random);
      maximoLongitud = d3.max(datos, d => d.longitud_random);
      const escalaLongitud= d3.scaleLinear()
        .domain([minimoLongitud, maximoLongitud])
        .range([20, WIDTH_VIS_1 - 20])
      
      minimoLatitud = d3.min(datos, d => d.latitud_random);
      maximoLatitud = d3.max(datos, d => d.latitud_random);
      const escalaLatitud= d3.scaleLinear()
        .domain([minimoLatitud, maximoLatitud])
        .range([20, HEIGHT_VIS_1 - 20])
      
      minimoDuracion = d3.min(datos, d => d.duracion);
      maximoDuracion = d3.max(datos, d => d.duracion);
      const escalaDuracion= d3.scaleLinear()
        .domain([minimoDuracion, maximoDuracion])
        .range([5, 12.5])
        
      const datosPorPais = d3.group(datos, d => d.pais);

      let PELICULAS = [];
      function preprocesarPeliculas(categoria, filtrar_dataset) {
        if (PELICULAS.length == 0) {
          PELICULAS = datos.filter(filtrar_dataset);
            return 0;
        }
      
        let data = JSON.parse(JSON.stringify(PELICULAS));

        // Cada vez que se oprime filtrar, se llama nuevamente
        // a preprocesarSatelites con filtro=true
        d3.select("#filter-button").on("click", (event) => {
            preprocesarSatelites(categoria, true);
        })
    
        // Cada vez que se oprime Restaurar filtro, se llama nuevamente
        // a preprocesarSatelites con filtro=false
        d3.select("#filter-reset").on("click", (event) => {
            preprocesarSatelites(categoria, false);
        })
  
        // Cada vez que cambia el selector de orden, se llama nuevamente
        // a crearSatelites para que actualice la visualización
        d3.select("#order-by").on("change", (_) => {
            let ordenar_dataset = document.getElementById("order-by").selectedOptions[0].value;
            crearSatelites(data, categoria, filtrar_dataset, ordenar_dataset);
        })
        
        // Llamamos a la segunda función encargada de crear los datos
        let ordenar_dataset = document.getElementById("order-by").selectedOptions[0].value;
        crearSatelites(data, categoria, filtrar_dataset, ordenar_dataset);
    }
    
      d3.select("#showCat1").on("click", () => preprocesarPeliculas("menos", false));
      d3.select("#showCat2").on("click", () => preprocesarPeliculas("entre", false));
      d3.select("#showCat3").on("click", () => preprocesarPeliculas("mas", false));



      function dibujarLineasPorPais(peliculasPorPais, visible = false) {
        // Eliminar líneas existentes antes de volver a dibujar
        SVG1.selectAll(".linea-conexion").remove();
      
        peliculasPorPais.forEach((peliculasEnPais) => {
          for (let i = 0; i < peliculasEnPais.length - 1; i++) {
            const pelicula1 = peliculasEnPais[i];
            const pelicula2 = peliculasEnPais[i + 1];
      
            // Dibujar línea solo si es visible
            if (visible) {
              SVG1.append("line")
                .attr("class", "linea-conexion")
                .attr("x1", escalaLongitud(pelicula1.longitud_random))
                .attr("y1", escalaLatitud(pelicula1.latitud_random))
                .attr("x2", escalaLongitud(pelicula2.longitud_random))
                .attr("y2", escalaLatitud(pelicula2.latitud_random))
                .style("stroke", "gray")
                .style("stroke-width", 1);
            }
          }
        });
      }  
    
    dibujarLineasPorPais(datosPorPais)
    const peliculas = SVG1
      .selectAll(".pelicula")
      .data(datos)
      .join((enter) =>{
    
    const P = enter
      .append("g")
      .attr("class", "pelicula")
      .style("opacity", 1);
    
    P.append("g")
      .attr("class", "pelicula")
      .style("opacity", 1)
      .append("circle")
      .attr("class", "circulo")
      .attr("fill", (d) => Color(d.calificacion))
      .attr("cx", (d) => escalaLongitud(d.longitud_random))
      .attr("cy", (d) => escalaLatitud(d.latitud_random))
      .style("cursor", "pointer")
      .attr("r", 0) 
      .transition() 
      .duration(500)
      .attr("r", (d) => escalaDuracion(d.duracion));
      });

      SVG1.selectAll("circle")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget) // Selecciona el círculo actual
      .style("stroke", "white") // Establece el borde blanco
      .style("stroke-width", 2); // Ancho del borde

      // Selecciona el botón por su ID
    const botonLimpiar = d3.select("#boton_limpiar");

    // Agrega un manejador de eventos para el clic en el botón
    botonLimpiar.on("click", function () {
      // Elimina todas las líneas existentes
    SVG1.selectAll(".linea-conexion").remove();
    });

      tooltip
      .html(`Titulo: ${d.titulo}<br>Director: ${d.director}<br> 
      Estreno: ${d.estreno_fecha}<br>Adición a Netflix: ${d.adicion}
      <br>Duración: ${d.duracion} min<br>Calificación: ${d.calificacion}<br>País: ${d.pais}`)
      .style("opacity", 1)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget) // Selecciona el círculo actual
        .style("stroke", "none"); // Elimina el borde
      tooltip.style("opacity", 0);
      })
      .on("click", (event, d) => {
        const paisSeleccionado = d.pais;

    // Verificar si las líneas están visibles
    const lineasVisible = SVG1.selectAll(".linea-conexion").size() > 0;

    // Obtener las películas del país seleccionado
    const peliculasEnPais = datos.filter(item => item.pais === paisSeleccionado);

    // Eliminar líneas existentes antes de volver a dibujar
    SVG1.selectAll(".linea-conexion").remove();

    // Si las líneas no estaban visibles o pertenecen a un país diferente, mostrarlas
    if (!lineasVisible || SVG1.selectAll(".linea-conexion").data()[0] === undefined) {
      dibujarLineasPorPais([peliculasEnPais], true);
    }
  });
    });


    

