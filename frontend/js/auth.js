// Si ya está logueado, redirige al dashboard
if (Auth.isLoggedIn()) {
  window.location.href = "dashboard.html";
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("btnLogin");
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    btn.disabled = true;
    btn.textContent = "Ingresando...";

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      Auth.saveToken(data.token, data.username);
      window.location.href = "dashboard.html";
    } catch (err) {
      errorMsg.textContent = err.message;
      btn.disabled = false;
      btn.textContent = "Iniciar sesión";
    }
  });
}

// Formulario de registro
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("btnRegister");
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    if (password !== password2) {
      errorMsg.textContent = "Las contraseñas no coinciden";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Registrando...";

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar");
      }

      alert("Usuario registrado. Ahora puedes iniciar sesión.");
      window.location.href = "index.html";
    } catch (err) {
      errorMsg.textContent = err.message;
      btn.disabled = false;
      btn.textContent = "Registrarme";
    }
  });
}