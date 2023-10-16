const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

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

DATA = data.scv

const WIDTH_VIS_1 = 800;
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

function joinDeDatos(datos) {
    const data2020 = datos.filter((d) => d.estreno_ano >= 2020);
    console.log(data2020);
}


function Color(calificacion) {
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

d3.csv("Netflix dataset - ConRandoms.csv", parseo)
    .then((datos) => {
        joinDeDatos(datos);
        const peliculas = SVG1
    
        .selectAll("peliculas")
        .data(data)
        .join(
          enter => {
          const P = enter.append("g")
          .attr("class", "pelicula")
          .style("opacity", 1)
      
        P.append("circle")
        .attr("class", "circulo")
        .attr("fill", "red")//(d) => Color(d.calificacion))
        .attr("cx", (d) => 100)//d.longitud_random)
        .attr("cy", (d) => 100)//d.latitud_random)
        .style("cursor", "pointer") 
        .transition()
        .duration(500)
        .attr("r", 50);
    
      }
    )
      })
