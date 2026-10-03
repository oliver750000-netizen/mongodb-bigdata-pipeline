// Verificar sesión
if (!Auth.isLoggedIn()) {
  window.location.href = "index.html";
}

// Mostrar nombre de usuario
document.getElementById("userName").textContent = Auth.getUsername() || "Usuario";

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.panel).classList.add("active");
  });
});

// Helpers
function mostrarTabla(containerId, data, columnas) {
  const container = document.getElementById(containerId);
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="empty">Sin resultados</div>';
    return;
  }

  let html = '<table><thead><tr>';
  columnas.forEach(col => { html += `<th>${col.label}</th>`; });
  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    columnas.forEach(col => {
      let valor = row[col.key];
      if (typeof valor === "number" && col.decimals !== undefined) {
        valor = valor.toLocaleString("es-MX", { maximumFractionDigits: col.decimals });
      }
      html += `<td>${valor ?? ""}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

async function cargar(containerId, endpoint, columnas) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="loading">⏳ Cargando...</div>';
  try {
    const data = await Auth.fetchConToken(`${API_URL}/queries/${endpoint}`);
    mostrarTabla(containerId, data, columnas);
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
  }
}

// 2.1
async function cargar21() {
  const pais = document.getElementById("pais21").value.trim();
  if (!pais) return alert("Escribe un país");
  const container = document.getElementById("result21");
  container.innerHTML = '<div class="loading">⏳ Cargando...</div>';
  try {
    const data = await Auth.fetchConToken(`${API_URL}/queries/2-1/aeropuertos?pais=${encodeURIComponent(pais)}`);
    let html = '<h3>🛫 Top 3 Origen</h3>';
    html += tablaSimple(data.origen, ["aeropuerto","pais","total_vuelos","total_pasajeros"]);
    html += '<h3 style="margin-top:30px;">🛬 Top 3 Destino</h3>';
    html += tablaSimple(data.destino, ["aeropuerto","pais","total_vuelos","total_pasajeros"]);
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
  }
}

function tablaSimple(data, columnas) {
  if (!data || data.length === 0) return '<div class="empty">Sin resultados</div>';
  let html = '<table><thead><tr>';
  columnas.forEach(c => html += `<th>${c.replace(/_/g," ")}</th>`);
  html += '</tr></thead><tbody>';
  data.forEach(row => {
    html += '<tr>';
    columnas.forEach(c => {
      let v = row[c];
      if (typeof v === "number") v = v.toLocaleString("es-MX");
      html += `<td>${v ?? ""}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

// 2.2
async function cargar22() {
  await cargar("result22", "2-2/desempeno-mensual", [
    { key: "year", label: "Año" },
    { key: "month", label: "Mes" },
    { key: "airline", label: "Aerolínea" },
    { key: "total_vuelos", label: "Vuelos" },
    { key: "total_pasajeros", label: "Pasajeros" },
    { key: "total_ganancias", label: "Ganancias", decimals: 2 },
    { key: "promedio_load_factor", label: "Factor ocup.", decimals: 2 }
  ]);
}

// 2.3
async function cargar23() {
  await cargar("result23", "2-3/rutas-rentables", [
    { key: "origen", label: "Origen" },
    { key: "destino", label: "Destino" },
    { key: "total_vuelos", label: "Vuelos" },
    { key: "total_pasajeros", label: "Pasajeros" },
    { key: "total_ganancias", label: "Ganancias", decimals: 2 },
    { key: "promedio_ganancias_por_vuelo", label: "Prom./vuelo", decimals: 2 },
    { key: "promedio_load_factor", label: "Factor ocup.", decimals: 2 }
  ]);
}

// 2.4
async function cargar24() {
  await cargar("result24", "2-4/ranking-mensual", [
    { key: "year", label: "Año" },
    { key: "month", label: "Mes" },
    { key: "posicion", label: "#" },
    { key: "airline", label: "Aerolínea" },
    { key: "total_vuelos", label: "Vuelos" },
    { key: "total_pasajeros", label: "Pasajeros" },
    { key: "total_ganancias", label: "Ganancias", decimals: 2 }
  ]);
}

// 3.1
async function cargar31() {
  await cargar("result31", "3-1/precio-por-tipo", [
    { key: "property_type", label: "Tipo" },
    { key: "precio_promedio", label: "Precio promedio", decimals: 2 },
    { key: "total_listings", label: "Anuncios" }
  ]);
}

// 3.2
async function cargar32() {
  const amenities = document.getElementById("amenities32").value;
  const rating = document.getElementById("rating32").value;
  const container = document.getElementById("result32");
  container.innerHTML = '<div class="loading">⏳ Cargando...</div>';
  try {
    const res = await Auth.fetchConToken(`${API_URL}/queries/3-2/anuncios-filtrados?amenities=${amenities}&rating=${rating}`);
    mostrarTabla("result32", res.data, [
      { key: "name", label: "Nombre" },
      { key: "property_type", label: "Tipo" },
      { key: "num_amenities", label: "Comodidades" },
      { key: "rating", label: "Rating" }
    ]);
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
  }
}

// 3.3
async function cargar33() {
  const top = document.getElementById("top33").value;
  const container = document.getElementById("result33");
  container.innerHTML = '<div class="loading">⏳ Cargando...</div>';
  try {
    const data = await Auth.fetchConToken(`${API_URL}/queries/3-3/top-revisores?top=${top}`);
    mostrarTabla("result33", data, [
      { key: "reviewer_name", label: "Revisor" },
      { key: "total_resenas", label: "Total reseñas" }
    ]);
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
  }
}

// 3.4
async function cargar34() {
  const texto = document.getElementById("texto34").value.trim();
  const container = document.getElementById("result34");
  container.innerHTML = '<div class="loading">⏳ Cargando...</div>';
  try {
    const res = await Auth.fetchConToken(`${API_URL}/queries/3-4/buscar-en-resenas?q=${encodeURIComponent(texto)}`);
    mostrarTabla("result34", res.data, [
      { key: "propiedad", label: "Propiedad" },
      { key: "reviewer", label: "Revisor" },
      { key: "comentario", label: "Comentario" }
    ]);
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
  }
}