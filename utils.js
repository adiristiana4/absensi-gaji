function getUser() {
  return JSON.parse(localStorage.getItem("userLogin"));
}

function logout() {
  localStorage.removeItem("userLogin");
  window.location.href = "index.html";
}

function formatRupiah(angka) {
  return angka.toLocaleString("id-ID");
}
