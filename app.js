const KEY = "baza_aut_v1";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
function norm(v) { return (v || "").trim().toUpperCase(); }
function normVin(v) { return norm(v).replace(/\s+/g, ""); }

function add() {
  const vin = normVin(document.getElementById("vin").value);
  const marka = norm(document.getElementById("marka").value);
  const rocznik = document.getElementById("rocznik").value.trim();
  const kolor = norm(document.getElementById("kolor").value);

  if (!vin || !marka || !rocznik || !kolor) {
    alert("Uzupełnij wszystkie pola");
    return;
  }

  const data = load();

  // blokada duplikatu VIN
  if (data.some(x => x.vin === vin)) {
    alert("Taki VIN już istnieje!");
    return;
  }

  data.unshift({ vin, marka, rocznik, kolor, dodano: new Date().toISOString().slice(0,19).replace("T"," ") });
  save(data);

  document.getElementById("vin").value = "";
  document.getElementById("marka").value = "";
  document.getElementById("rocznik").value = "";
  document.getElementById("kolor").value = "";

  render();
}

function del(vin) {
  if (!confirm("Usunąć wpis?")) return;
  const data = load().filter(x => x.vin !== vin);
  save(data);
  render();
}

function edit(vin) {
  const data = load();
  const item = data.find(x => x.vin === vin);
  if (!item) return;

  const nVin = prompt("VIN:", item.vin);
  if (nVin === null) return;
  const nMarka = prompt("Marka:", item.marka);
  if (nMarka === null) return;
  const nRocznik = prompt("Rocznik:", item.rocznik);
  if (nRocznik === null) return;
  const nKolor = prompt("Kod koloru:", item.kolor);
  if (nKolor === null) return;

  const vv = normVin(nVin);
  const mm = norm(nMarka);
  const rr = nRocznik.trim();
  const kk = norm(nKolor);

  if (!vv || !mm || !rr || !kk) {
    alert("Błędne dane – nie zapisano");
    return;
  }

  // jeśli zmieniasz VIN, sprawdź duplikat
  if (vv !== vin && data.some(x => x.vin === vv)) {
    alert("Taki VIN już istnieje!");
    return;
  }

  item.vin = vv;
  item.marka = mm;
  item.rocznik = rr;
  item.kolor = kk;

  save(data);
  render();
}

function render() {
  const q = norm(document.getElementById("search").value);
  const list = document.getElementById("list");
  const data = load().filter(x => {
    if (!q) return true;
    const hay = `${x.vin} ${x.marka} ${x.rocznik} ${x.kolor}`.toUpperCase();
    return hay.includes(q);
  });

  list.innerHTML = "";
  for (const x of data) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${x.vin}</td>
      <td>${x.marka}</td>
      <td>${x.rocznik}</td>
      <td>${x.kolor}</td>
      <td>
        <button onclick="edit('${x.vin}')" style="width:auto;padding:6px 10px;">Edytuj</button>
        <button class="danger" onclick="del('${x.vin}')" style="width:auto;padding:6px 10px;">Usuń</button>
      </td>
    `;
    list.appendChild(tr);
  }
}

render();
