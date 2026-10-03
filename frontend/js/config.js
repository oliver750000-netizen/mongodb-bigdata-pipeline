// Configuración global del frontend
const API_URL = "http://localhost:3000/api";

// Guardar/obtener token
const Auth = {
  saveToken(token, username) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  },
  getToken() {
    return localStorage.getItem("token");
  },
  getUsername() {
    return localStorage.getItem("username");
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "index.html";
  },
  isLoggedIn() {
    return !!localStorage.getItem("token");
  },
  // Wrapper para fetch con token
  async fetchConToken(url) {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.getToken()}`
      }
    });
    if (res.status === 401 || res.status === 403) {
      this.logout();
      throw new Error("Sesión expirada");
    }
    return res.json();
  }
};