const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

const WIDTH_VIS_1 = 1000;
const HEIGHT_VIS_1 = 500;

const WIDTH_VIS_2 = 800;
const HEIGHT_VIS_2 = 500;

SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);


let tooltip1 = d3.select("body").append("div")
    .style("opacity", 0)
    .style("width", 200)
    .style("height", 50)
    .style("pointer-events", "none")
    .style("background", "rgb(117, 168, 234)")
    .style("border-radius", "8px")
    .style("padding", "4px")
    .style("position", "absolute");

  let tooltip2 = d3.select("body").append("div")
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

let datosOriginales;

d3.csv("data.csv", parseo)
  .then((datos) => {
    console.log(datos);

    datosOriginales = datos;

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

      const escalaBarra = d3.scaleLinear()
          .domain([minimoDuracion, maximoDuracion])
          .range([20, WIDTH_VIS_2 - 20])
        
      const datosPorPais = d3.group(datos, d => d.pais);

      function dibujarLineasPorPais(peliculasPorPais, visible = false) {
        
        SVG1.selectAll(".linea-conexion").remove();
      
        peliculasPorPais.forEach((peliculasEnPais) => {
          for (let i = 0; i < peliculasEnPais.length - 1; i++) {
            const pelicula1 = peliculasEnPais[i];
            const pelicula2 = peliculasEnPais[i + 1];
      
        
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
        d3.select(event.currentTarget) 
      .style("stroke", "white") 
      .style("stroke-width", 2); 
    

    const botonLimpiar = d3.select("#boton_limpiar");

    botonLimpiar.on("click", function () {
    SVG1.selectAll(".linea-conexion").remove();
    actualizarVisualizacion(null);
    });

      tooltip1
      .html(`Titulo: ${d.titulo}<br>Director: ${d.director}<br> 
      Estreno: ${d.estreno_fecha}<br>Adición a Netflix: ${d.adicion}
      <br>Duración: ${d.duracion} min<br>Calificación: ${d.calificacion}<br>País: ${d.pais}`)
      .style("opacity", 1)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget) 
        .style("stroke", "none"); 
      tooltip1.style("opacity", 0);
      })
      .on("click", (event, d) => {
        const paisSeleccionado = d.pais;
    
    const lineasVisible = SVG1.selectAll(".linea-conexion").size() > 0;
    
    const peliculasEnPais = datos.filter(item => item.pais === paisSeleccionado);
    
    SVG1.selectAll(".linea-conexion").remove();

    if (!lineasVisible || SVG1.selectAll(".linea-conexion").data()[0] === undefined) {
      dibujarLineasPorPais([peliculasEnPais], true);
      
      const duracionPelicula = escalaBarra(d.duracion);
      const colorPelicula = d.calificacion;
      const nombrePelicula = d.titulo

      
      dibujarBarras(datos, duracionPelicula, colorPelicula, nombrePelicula);
    }
  });

  function actualizarVisualizacion(datos) {

    const datosFiltrados = datos === null ? datosOriginales : datos;

    const peliculas = SVG1
      .selectAll(".pelicula")
      .data(datosFiltrados);

    peliculas.select(".circulo")
      .transition()
      .duration(500)
      .attr("cx", (d) => escalaLongitud(d.longitud_random))
      .attr("cy", (d) => escalaLatitud(d.latitud_random))
      .attr("r", (d) => escalaDuracion(d.duracion));

    peliculas.enter()
      .append("g")
      .attr("class", "pelicula")
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

    peliculas.exit().remove();

    nuevosCirculos
    .on("mouseover", (event, d) => {
      d3.select(event.currentTarget) 
        .style("stroke", "white") 
        .style("stroke-width", 2); 

      tooltip
        .html(`Titulo: ${d.titulo}<br>Director: ${d.director}<br> 
        Estreno: ${d.estreno_fecha}<br>Adición a Netflix: ${d.adicion}
        <br>Duración: ${d.duracion} min<br>Calificación: ${d.calificacion}<br>País: ${d.pais}`)
        .style("opacity", 1)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", (event, d) => {
      d3.select(event.currentTarget) 
        .style("stroke", "none"); 
      tooltip.style("opacity", 0);
    })
    .on("click", (event, d) => {
      const paisSeleccionado = d.pais;

    });
  }

d3.select("#showCat1").on("click", () => {
  const datosFiltrados = datos.filter((d) => d.categoria_duracion === "Menos 1 hora");
  actualizarVisualizacion(datosFiltrados);
});

d3.select("#showCat2").on("click", () => {
  const datosFiltrados = datos.filter((d) => d.categoria_duracion === "Entre 1 y 2 horas");
  actualizarVisualizacion(datosFiltrados);
});

d3.select("#showCat3").on("click", () => {
  const datosFiltrados = datos.filter((d) => d.categoria_duracion === "Más 2 horas");
  actualizarVisualizacion(datosFiltrados);
});

d3.select("#order-by").on("change", () => {
  let ordenar_dataset = document.getElementById("order-by").selectedOptions[0].value;
  
  const datosOrdenados = datos.filter((d) => d.calificacion === ordenar_dataset);
  actualizarVisualizacion(datosOrdenados);
});

const botonLimpiar = d3.select("#boton_limpiar");


botonLimpiar.on("click", function () {

SVG1.selectAll(".linea-conexion").remove();
actualizarVisualizacion(null);
});


const lineasVisible = SVG1.selectAll(".linea-conexion").size() > 0;

const peliculasEnPais = datos.filter(item => item.pais === paisSeleccionado);

SVG1.selectAll(".linea-conexion").remove();


if (!lineasVisible || SVG1.selectAll(".linea-conexion").data()[0] === undefined) {
  
      const duracionPelicula = escalaBarra(d.duracion);
      const colorPelicula = d.calificacion;
      const nombrePelicula = d.titulo

      dibujarBarras(datos, duracionPelicula, colorPelicula, nombrePelicula)  

}

    });

let contador = 0; 
function dibujarBarras(datos, duracion, color, nombre) {
  const Grafico = SVG2.selectAll(".barra")
        .data(datos)
        .join(
          enter => {
          const S = enter.append("g")
          .attr("class", "grupo_barra")
          .style("opacity", 1)
          .attr("transform", `translate(0, ${contador * 60})`);
    
            S.append('rect')
              .attr("class", "rectangulo")
              .attr("fill", d => Color(color))
              .attr("y", 20)
              .attr("x", 0)
              .transition()
              .duration(500)
              .attr("height", 30)
              .attr("width", duracion);
    
            S.append("text")
              .attr("x", 10)
              .attr("y", 10)
              .attr("text-anchor", "left")
              .attr("font-size", "12px")
              .attr("fill", "white")
              .text(nombre);
          
          contador++;

          },
    
          update => {
            update.select(".barra")
              .transition()
              .duration(500)
              .attr("fill", d => Color(duracion));
    
            update.select("text").text(nombre);
    
            return update;
          },
    
          exit => {
            exit.selectAll(".barra").remove();
            exit.selectAll("text").remove();
            exit.remove();
    
            return exit;
          }
        );
      
        const botonLimpiar2 = d3.select("#boton_limpiar2");
      
        botonLimpiar2.on("click", function () {
          SVG2.selectAll(".grupo_barra").remove(); 
          contador = 0;
        });

    }
    
    
    


    
