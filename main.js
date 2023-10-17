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
    estreno_ano: parseInt(d["Año estreno (Número)"]),
    adicion: d["Fecha adición"],
    calificacion: +d["Calificación"],
    duracion: +d["Duración"],
    categoria_duracion: d["Categoría Duración"],
    latitud_random: +d["Latitud Random"],
    longitud_random: +d["Longitud Random"],
  };
}

function Color_calificacion(calificacion) {
  const colorMap = {
      'G': "orange",
      'NR': "blue",
      "PG": "green",
      "PG-13": "green",
      "R": "purple",
      "TV-14": "yellow",
      "TV-G": "yellow",
      "TV-MA": "yellow",
      "TV-PG": "yellow",
      "TV-Y7": "yellow",
      "UR": "red"
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
    console.log(escalaLongitud)
    
    minimoLatitud = d3.min(datos, d => d.latitud_random);
    maximoLatitud = d3.max(datos, d => d.latitud_random);
    const escalaLatitud= d3.scaleLinear()
      .domain([minimoLatitud, maximoLatitud])
      .range([20, 780])
    console.log(escalaLatitud)
    
    const peliculas = SVG1.selectAll(".pelicula")
      .data(datos)
      .enter() 

    peliculas.append("g")
      .attr("class", "pelicula")
      .style("opacity", 1)
      .append("circle")
      .attr("class", "circulo")
      .attr("fill", "red")// (d) => Color(d.calificacion))
      .attr("cx", (d) => escalaLongitud(d.longitud_random))
      .attr("cy", (d) => escalaLatitud(d.latitud_random))
      .style("cursor", "pointer")
      .attr("r", 0) 
      .transition() 
      .duration(500)
      .attr("r", 10);
  });

