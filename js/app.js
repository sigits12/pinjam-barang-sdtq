// ===============================
// Konfigurasi
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycbzDcNbRszP5lQUzUwQsS4lqNkbtaeofAaG0-DUEoueG-mn7FV6EIlg61zxvvsQjjZG3/exec";

// ===============================
// Ambil parameter dari URL
// ===============================
const params = new URLSearchParams(window.location.search);
const barangId = params.get("id");

// ===============================
// Elemen HTML
// ===============================
const namaBarangEl = document.getElementById("namaBarang");
const statusBarangEl = document.getElementById("statusBarang");
const formPinjam = document.getElementById("formPinjam");
const formKembali = document.getElementById("formKembali");
const namaPeminjamEl = document.getElementById("namaPeminjam");
const pesanEl = document.getElementById("pesan");

const guruSelect = document.getElementById("guru");
const btnPinjam = document.getElementById("btnPinjam");
const btnKembali = document.getElementById("btnKembali");

// ===============================
// Validasi awal
// ===============================
if (!barangId) {
  alert("ID barang tidak ditemukan");
}

// ===============================
// Ambil data barang
// ===============================
fetch(`${API_URL}?action=getBarang&id=${barangId}`)
  .then(res => res.json())
  .then(data => {
    namaBarangEl.innerText = data.nama_barang;
    statusBarangEl.innerText = data.status;

    if (data.status === "tersedia") {
      formPinjam.style.display = "block";
      formKembali.style.display = "none";
    } else {
      formPinjam.style.display = "none";
      formKembali.style.display = "block";
      namaPeminjamEl.innerText = data.peminjam;
    }
  })
  .catch(err => {
    pesanEl.innerText = "Gagal memuat data barang";
    console.error(err);
  });

// ===============================
// Aksi Pinjam
// ===============================
btnPinjam.addEventListener("click", () => {
  const namaGuru = guruSelect.value;

  if (!namaGuru) {
    alert("Silakan pilih nama guru");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "pinjam",
      barang_id: barangId,
      guru: namaGuru
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Barang berhasil dipinjam");
    location.reload();
  })
  .catch(err => {
    alert("Gagal meminjam barang");
    console.error(err);
  });
});

// ===============================
// Aksi Kembalikan
// ===============================
btnKembali.addEventListener("click", () => {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "kembali",
      barang_id: barangId
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Barang berhasil dikembalikan");
    location.reload();
  })
  .catch(err => {
    alert("Gagal mengembalikan barang");
    console.error(err);
  });
});
