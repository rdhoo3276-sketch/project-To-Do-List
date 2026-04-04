//DATA
let tugas = []
let filterAktif = "semua"; //filter yang aktif sekarang
let dragIndex = null;      //index tugas yang sedang di drag
let terpilih = [];   //menyimpan tugas yang disimpan

//DARK MODE
const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    const btn = document.getElementById("btnTheme");

    if (document.body.classList.contains("dark")) {
        btn.innerText = "☀️ Light Mode";
    } else {
        btn.innerText = "🌙 Dark Mode";
    }
};

//SIMPAN KE LOCALSTORAGE
const simpanData = () => {
    localStorage.setItem("tugas", JSON.stringify(tugas));
}

//MUAT DARI LOCALSTORAGE
const muatData = () => {
    const data = localStorage.getItem("tugas");
    if (data !== null) {
        tugas = JSON.parse(data).filter((item) => item !== null);
    }
      terpilih = [];
};

//TAMBAH TUGAS
const tambahTugas = () => {
    if (dragIndex !== null) return;
    const input = document.getElementById("inputTugas");
    const teks = input.value;
    const deadline = document.getElementById("inputDeadline").value;

    if (teks === "") {
        tamppilToast("Tugas tidak boleh kosong!");
        return;
    }

    tugas.push({ id:Date.now(), teks: teks, selesai: false, deadline: deadline});
    simpanData();
    input.value = "";
    document.getElementById("inputDeadline").value = "";
    tampilTugas();

};

    //TEKAN ENTER UNTUK TAMBAH TUGAS
    document.getElementById("inputTugas").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            tambahTugas();
        }
    });

//SELESAIKAN TUGAS
const selesaikanTugas = (id) => {
    tugas = tugas.map((item) => {
        if (item.id === id) {
            item.selesai = !item.selesai;
        }
        return item;
    });
    simpanData();
    tampilTugas();
};

//HAPUS TUGAS
let hapusId = null;
    
    const hapusTugas = (id) => {
    hapusId = id;
    const modal = document.getElementById("modalHapus");
    modal.style.display = "flex";
}; 

const konfirmasiHapus = () => {
    tugas = tugas.filter((item) => item.id !== hapusId);
    hapusId = null;
    document.getElementById("modalHapus").style.display ="none";
    simpanData();
    tampilTugas();
};

const batalHapus = () => {
    hapusId = null;
    document.getElementById("modalHapus").style.display = "none";
}

//EDIT TUGAS
let editId = null;

const editTugas = (id) => {
    editId = id;
    const item = tugas.find((t) => t.id === id);
    document.getElementById("inputEdit").value = item.teks;
    document.getElementById("modalEdit").style.display ="flex";
};

const konfirmasiEdit = () => {
    const teksBar = document.getElementById("inputEdit").value;
    if (teksBar === "") {
        alert("Tugas tidak boleh kosong!")
        return;
    }
    const item = tugas.find((t) => t.id === editId);
    item.teks = teksBar;
    editId = null;
    document.getElementById("modalEdit").style.display ="none";
    simpanData();
    tampilTugas();
};

const batalEdit = () => {
    editId = null;
    document.getElementById("modalEdit").style.display = "none";
}

//FILTER TUGAS
 const filterTugas = (tipe) => {
     filterAktif = tipe;

    //highlight tombol aktif
    document.querySelectorAll("#btn-semua, #btn-belum, #btn-selesai-filter").forEach((btn) =>{
        btn.classList.remove("btn-filter-aktif");
    });
    document.getElementById(`btn-${tipe === "selesai" ? "selesai-filter" : tipe}`).classList.add("btn-filter-aktif");

     tampilTugas();
 };

 //TAMPIL ALERT
 const tamppilToast = (pesan) => {
     const toast = document.getElementById("toast");
     toast.innerText = pesan;
     toast.style.display = "block";
     toast.style.animation = "none";
     setTimeout(() =>{
         toast.style.animation = "toastIn 0.3s ease";
     }, 10);
     setTimeout(() => {
         toast.style.display = "none";
     }, 2500);
 };

 // TOGGLE PILIH TUGAS
    const togglePilih = (id) => {
        if (terpilih.includes(id)) {
            terpilih = terpilih.filter((t) => t !== id);
        } else {
            terpilih.push(id);
        }
        updateBulkAction();
        tampilTugas();
    };

    //UPDATE TAMPILAN BULK ACTION
    const updateBulkAction = () => {
        const bulk = document.getElementById("bulkAction");
        bulk.style.display = terpilih.length> 0 ? "flex" : "none";
    };

    //SELECT ALL
    const selectAll = () => {
        if (terpilih.length === tugas.length) {
            terpilih = [];
        } else {
            terpilih = tugas.map((t) => t.id);
        }
        updateBulkAction();
        tampilTugas();
    };

    //HAPUS TERPILIH
    const hapusTerpilih = () => {
        tugas = tugas.filter((t) => !terpilih.includes(t.id));
        terpilih = [];
        updateBulkAction();
        simpanData();
        tampilTugas();
    };

    //SELESAIKAN TERPILIH
    const selesaikanTerpilih = () => {
        tugas = tugas.map((t) => {
            if (terpilih.includes(t.id)) t.selesai = true;
            return t;
        });
        terpilih = [];
        updateBulkAction();
        simpanData();
        tampilTugas();
    };

//TAMPIL TUGAS 
const tampilTugas = () => {
    updateBulkAction();
    const listTugas = document.getElementById("listTugas");
    const info = document.getElementById("info");
    const progress = document.getElementById("progress");

    //HITUNG PROGRESS
    const selesai = tugas.filter((item) => item.selesai).length;
    const total = tugas.length;
    progress.innerText = total > 0 ? `✅  ${selesai} dari ${total} tugas selesai` : "";

    //FILTER DATA
    let tugasTampil = tugas;
    if (filterAktif === "selesai") {
        tugasTampil = tugas.filter((item) => item.selesai);
    } else if (filterAktif === "belum") {
        tugasTampil = tugas.filter((item) => !item.selesai);
    };

    if (tugasTampil.length === 0) {
        info.style.display = "block";
        listTugas.innerHTML = "";
        return;

    };

        info.style.display = "none";
        listTugas.innerHTML = "";
        tugasTampil.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = `tugas-item ${item.selesai ? "selesai" : ""}`;
            div.draggable = true;
            div.dataset.index = index;

                div.addEventListener("dragstart", (e) => {
                    dragIndex = tugas.indexOf(item);
                    e.dataTransfer.effectAllowed = "move";
                });

                div.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                });

                div.addEventListener("drop", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (dragIndex === null) return;
                    const targetIndex = tugas.indexOf(item);
                    if (dragIndex === targetIndex) return;
                    const dragItem = tugas.splice(dragIndex,  1) [0];
                    tugas.splice(targetIndex, 0, dragItem);
                    dragIndex = null;
                    simpanData();
                    tampilTugas();
                });

            const sekarang = new Date().toISOString().split("T")[0];
            const terlambat = item.deadline && item.deadline <sekarang && !item.selesai;

            const hari = item.deadline 
                ? `<small class="${terlambat ? "deadline-terlambat" : ""}">📆 ${item.deadline}</small>`
                : "";

            if (terlambat) {
                div.className += " terlambat";
            }

            div.innerHTML = `
            <div style="display:flex; align-items:center; gap:5px; width:100%;">
                 <input type="checkbox" 
                    ${terpilih.includes(item.id) ? "checked" : ""} 
                     onclick="togglePilih(${item.id})">
                 <div>
                     <span>${item.teks}</span><br>${hari}
            </div>
        </div>
        <div>
            <button class="btn-edit" onclick="editTugas(${item.id})">Edit</button>
            <button class="btn-selesai" onclick="selesaikanTugas(${item.id})">
            ${item.selesai ? "Batal" : "Selesai"}
         </button>
        <button class="btn-hapus" onclick="hapusTugas(${item.id})">
            Hapus
          </button>
        </div>
        `;
            listTugas.appendChild(div);
        });
};
muatData();
tampilTugas();
