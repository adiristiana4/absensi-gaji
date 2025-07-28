const user = getUser();
if (!user) location.href = "index.html";

document.getElementById("userNama").textContent = "Selamat datang, " + user.nama;
document.getElementById("riwayatKerja").textContent = new Date(user.masuk).toLocaleDateString("id-ID");

const gajiPerHari = 100000;
const hariLibur = [0]; // Minggu
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

const masukHari = JSON.parse(localStorage.getItem(user.kode + "_masukHari") || "{}");

function renderTanggal(gridId, start, end, periode) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = "";
  for (let i = start; i <= end; i++) {
    const tgl = new Date(year, month, i);
    const hari = tgl.getDay();
    const isMasuk = masukHari[periode]?.includes(i);
    const el = document.createElement("div");
    el.textContent = i;
    el.className = hariLibur.includes(hari) ? "libur" : "";
    if (isMasuk) el.classList.add("masuk");
    el.onclick = () => toggleMasuk(i, periode, gridId);
    grid.appendChild(el);
  }
  updateGaji();
}

function toggleMasuk(i, periode, gridId) {
  if (!masukHari[periode]) masukHari[periode] = [];
  const index = masukHari[periode].indexOf(i);
  if (index === -1) masukHari[periode].push(i);
  else masukHari[periode].splice(index, 1);
  localStorage.setItem(user.kode + "_masukHari", JSON.stringify(masukHari));
  renderTanggal(gridId, periode === "1" ? 1 : 16, periode === "1" ? 15 : new Date(year, month + 1, 0).getDate(), periode);
}

function updateGaji() {
  const masuk1 = masukHari["1"]?.length || 0;
  const masuk2 = masukHari["2"]?.length || 0;
  const pot1 = parseInt(document.getElementById("potongan1").value) || 0;
  const pot2 = parseInt(document.getElementById("potongan2").value) || 0;

  const gaji1 = masuk1 * gajiPerHari - pot1;
  const gaji2 = masuk2 * gajiPerHari - pot2;

  document.getElementById("masuk1").textContent = masuk1;
  document.getElementById("masuk2").textContent = masuk2;
  document.getElementById("gaji1").textContent = formatRupiah(gaji1);
  document.getElementById("gaji2").textContent = formatRupiah(gaji2);

  document.getElementById("totalMasuk").textContent = masuk1 + masuk2;
  document.getElementById("totalGaji").textContent = formatRupiah(gaji1 + gaji2);
}

function tampilTab(id) {
  document.querySelectorAll(".tab-content").forEach(t => t.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function cetakSlip(periode) {
  const canvas = document.getElementById("slipCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 400;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#25a36f";
  ctx.font = "20px sans-serif";
  ctx.fillText("Slip Gaji Periode " + periode, 20, 40);

  const masuk = masukHari[periode]?.length || 0;
  const pot = parseInt(document.getElementById("potongan" + periode).value) || 0;
  const gaji = masuk * gajiPerHari - pot;

  ctx.fillStyle = "#000";
  ctx.font = "16px sans-serif";
  ctx.fillText("Nama: " + user.nama, 20, 80);
  ctx.fillText("Total Masuk: " + masuk + " hari", 20, 110);
  ctx.fillText("Potongan: Rp " + formatRupiah(pot), 20, 140);
  ctx.fillText("Gaji Diterima: Rp " + formatRupiah(gaji), 20, 170);

  const link = document.createElement("a");
  link.download = "SlipGaji_Periode" + periode + ".png";
  link.href = canvas.toDataURL();
  link.click();
}

renderTanggal("grid1", 1, 15, "1");
renderTanggal("grid2", 16, new Date(year, month + 1, 0).getDate(), "2");

document.getElementById("potongan1").oninput = updateGaji;
document.getElementById("potongan2").oninput = updateGaji;
updateGaji();
