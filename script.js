const users = {
  "Ops264479": { password: "123456", nama: "Adi Ristiana" },
  "Ops999888": { password: "admin", nama: "Karyawan 2" }
};

function login() {
  const kode = document.getElementById("kodeOps").value.trim();
  const password = document.getElementById("password").value.trim();

  if (users[kode] && users[kode].password === password) {
    const user = { kode, nama: users[kode].nama, masuk: new Date().toISOString() };
    localStorage.setItem("userLogin", JSON.stringify(user));
    window.location.href = "absensi.html";
  } else {
    alert("Kode atau password salah.");
  }
}
