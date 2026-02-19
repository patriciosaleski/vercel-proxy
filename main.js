document.getElementById("formulario").addEventListener("submit", async function (e) {
  e.preventDefault();
  const legajo = document.getElementById("legajo").value;
  const regex = /^\d+$/;
  if (!regex.test(legajo)) {
    alert("Por favor ingresá solo números en el legajo.");
    return;
  }

  const servidor = `https://vercel-proxy-tan-two.vercel.app/api/legajo.js?id=${legajo}`;

  try {
    const response = await fetchConReintento(servidor);
    const data = await response.json();
    const listaAsignaciones = document.getElementById("asignaciones");
    listaAsignaciones.innerHTML = "";
    let totalHoras = 0;

    if (data.asignaciones && data.asignaciones.length > 0) {
      data.asignaciones.forEach((asignacion) => {
        const horas = calcularHoras(asignacion.horaEntrada, asignacion.horaSalida);
        totalHoras += horas;
        const li = document.createElement("li");
        li.classList.add("fila-asignacion");
        li.innerHTML = `
          <span class="col-fecha">${asignacion.fecha}</span>
          <span class="col-hora">${asignacion.horaEntrada} a ${asignacion.horaSalida}</span>
          <span class="col-tiempo">${horas.toFixed(2)} hs</span>
          <span class="col-tienda">${asignacion.tienda}</span>
        `;
        listaAsignaciones.appendChild(li);
      });

      const total = document.createElement("li");
      total.innerHTML = `<strong>Total de horas: ${totalHoras.toFixed(2)} hs</strong>`;
      listaAsignaciones.appendChild(total);
    } else {
      listaAsignaciones.innerHTML = "<li>No hay asignaciones.</li>";
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    alert("Error al consultar las asignaciones. Intentá de nuevo en unos segundos.");
  }
});

async function fetchConReintento(url, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch (e) {
      if (i === intentos - 1) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error("No se pudo obtener respuesta tras varios intentos.");
}

function calcularHoras(entrada, salida) {
  const [h1, m1] = entrada.split(":").map(Number);
  const [h2, m2] = salida.split(":").map(Number);
  const inicio = new Date(0, 0, 0, h1, m1);
  const fin = new Date(0, 0, salida < entrada ? 1 : 0, h2, m2);
  const diffMs = fin - inicio;
  return diffMs / (1000 * 60 * 60);
}
