const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

const WIDTH_VIS_1 = 1000;
const HEIGHT_VIS_1 = 800;

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
      .range([20, 980])
    
    minimoLatitud = d3.min(datos, d => d.latitud_random);
    maximoLatitud = d3.max(datos, d => d.latitud_random);
    const escalaLatitud= d3.scaleLinear()
      .domain([minimoLatitud, maximoLatitud])
      .range([20, 780])
    
    minimoDuracion = d3.min(datos, d => d.duracion);
    maximoDuracion = d3.max(datos, d => d.duracion);
    const escalaDuracion= d3.scaleLinear()
      .domain([minimoDuracion, maximoDuracion])
      .range([2, 10])
    
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

      tooltip
      .html(`Titulo: ${d.titulo}<br>Director: ${d.director}<br> 
      Estreno: ${d.estreno_fecha}<br>Adición a Netflix: ${d.adicion}
      <br>Duración: ${d.duracion}<br>Calificación: ${d.calificacion}`)
      .style("opacity", 1)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget) // Selecciona el círculo actual
        .style("stroke", "none"); // Elimina el borde
      tooltip.style("opacity", 0);
      })

    });

