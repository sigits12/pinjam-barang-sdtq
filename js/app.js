// ===============================
// Konfigurasi
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycbzDcNbRszP5lQUzUwQsS4lqNkbtaeofAaG0-DUEoueG-mn7FV6EIlg61zxvvsQjjZG3/exec";

// ===============================
// Ambil parameter dari URL
// ===============================
const params = new URLSearchParams(window.location.search);
const barangId = params.get("id");

const cacheKey = "barang_" + barangId;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  try {
    const data = JSON.parse(cached);
    namaBarangEl.innerText = data.nama_barang;
    statusBarangEl.innerText = data.status;
  } catch (e) {
    localStorage.removeItem(cacheKey);
  }
}

// ===============================
// Elemen HTML
// ===============================

const controls = document.getElementById("controls");
const loading = document.getElementById("loading");

controls.classList.add("hidden");
loading.style.display = "block";

const namaBarangEl = document.getElementById("namaBarang");
const statusBarangEl = document.getElementById("statusBarang");
const formPinjam = document.getElementById("formPinjam");
const formKembali = document.getElementById("formKembali");
const namaPeminjamEl = document.getElementById("namaPeminjam");
const pesanEl = document.getElementById("pesan");

const guruSelect = document.getElementById("guru");
const btnPinjam = document.getElementById("btnPinjam");
const btnKembali = document.getElementById("btnKembali");

const btnBooking = document.getElementById("btnBooking");
const bookingMulai = document.getElementById("bookingMulai");
const bookingSelesai = document.getElementById("bookingSelesai");

function setDisabled(state) {
  guruSelect.disabled = state;
  btnPinjam.disabled = state;
  btnKembali.disabled = state;
  btnBooking.disabled = state;
}

setDisabled(true);
loading.style.display = "block";

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

    if (data.error) {
      statusBarangEl.innerText = "Data tidak ditemukan";
      return;
    }
    
    // render
    namaBarangEl.innerText = data.nama_barang;
    statusBarangEl.innerText = data.status;
    loading.style.display = "none";
    setDisabled(false);
    controls.classList.remove("hidden");
    // simpan cache
    localStorage.setItem(cacheKey, JSON.stringify(data));

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
    setDisabled(true);
    console.error(err);
    loading.innerText = "❌ Gagal memuat data barang";
    controls.classList.add("hidden");
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
    localStorage.removeItem(cacheKey);
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
    localStorage.removeItem(cacheKey);
    location.reload();
  })
  .catch(err => {
    alert("Gagal mengembalikan barang");
    console.error(err);
  });
});

btnBooking.addEventListener("click", () => {
  const namaGuru = guruSelect.value;
  const mulai = bookingMulai.value;
  const selesai = bookingSelesai.value;

  if (!namaGuru || !mulai || !selesai) {
    alert("Lengkapi nama guru dan waktu booking");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "booking",
      barang_id: barangId,
      guru: namaGuru,
      mulai: mulai,
      selesai: selesai
    })
  })
  .then(res => res.json())
  .then(res => {
    if (res.error) {
      alert(res.error);
      return;
    }

    alert("Booking berhasil");
    bookingMulai.value = "";
    bookingSelesai.value = "";
  })
  .catch(() => alert("Gagal booking"));
});

btnPinjam.addEventListener("click", () => {
  if (btnPinjam.disabled) return;
  // lanjut pinjam
});

btnKembali.addEventListener("click", () => {
  if (btnKembali.disabled) return;
  // lanjut pinjam
});

btnBooking.addEventListener("click", () => {
  if (btnBooking.disabled) return;
  // lanjut pinjam
});

