const grid = document.getElementById("ootdGrid");

function renderLooks(filter="all"){
  grid.innerHTML = "";
  const visible = filter === "all" ? LOOKS : LOOKS.filter(l => l.category.includes(filter));
  visible.forEach(look => {
    const card = document.createElement("article");
    card.className = "ootd-card";
    card.onclick = () => openLook(look.code);
    const bg = `linear-gradient(145deg, ${look.colors[0]}, ${look.colors[1]} 58%, ${look.colors[2]})`;
    card.innerHTML = `
      <div class="card-image" style="background:${bg}">
        <span class="card-chip">${look.mood}</span>
      </div>
      <div class="card-info">
        <small>OOTD ${look.code.replace("FD","")}</small>
        <h3>${look.title}</h3>
        <p>View outfit →</p>
      </div>`;
    grid.appendChild(card);
  });
}

function openLook(code){
  const look = LOOKS.find(l => l.code.toUpperCase() === code.toUpperCase());
  if(!look) return;
  const modal = document.getElementById("lookModal");
  const visual = `linear-gradient(145deg, ${look.colors[0]}, ${look.colors[1]} 58%, ${look.colors[2]})`;
  const items = look.items.map(item => `
    <div class="shop-item">
      <div><strong>${item.name}</strong><span>${item.price}</span></div>
      <a class="shop-btn" href="${item.url}" target="_blank" rel="noopener">SHOP</a>
    </div>`).join("");
  document.getElementById("modalContent").innerHTML = `
    <div class="look-detail">
      <div class="detail-visual" style="background:${visual}">${look.code}</div>
      <div>
        <span class="eyebrow">OOTD ${look.code.replace("FD","")}</span>
        <h2>${look.title}</h2>
        <div class="tags">${look.category.map(c=>`<span class="tag">#${c}</span>`).join("")}</div>
        <p>${look.description}</p>
        <h3>SHOP THE LOOK</h3>
        <div class="shop-list">${items}</div>
      </div>
    </div>`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}

function closeModal(){
  const modal = document.getElementById("lookModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}

function searchLook(){
  const input = document.getElementById("searchInput");
  const message = document.getElementById("searchMessage");
  let value = input.value.trim().toUpperCase().replace(/\s+/g,"");
  if(value && !value.startsWith("FD") && /^\d+$/.test(value)) value = "FD" + value.padStart(3,"0");
  const match = LOOKS.find(l => l.code === value);
  if(match){
    message.textContent = `Found ${match.code} — ${match.title} ♡`;
    openLook(match.code);
  }else{
    message.textContent = value ? `No look found for ${value} yet.` : "Please enter an OOTD code.";
  }
}

document.getElementById("searchInput").addEventListener("keydown", e => {
  if(e.key === "Enter") searchLook();
});

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderLooks(btn.dataset.filter);
  });
});

function toggleMenu(){
  document.querySelector(".nav").classList.toggle("open");
}

document.addEventListener("keydown", e => {
  if(e.key === "Escape") closeModal();
});

renderLooks();
