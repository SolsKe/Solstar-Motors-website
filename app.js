const ACCENTS = {
  amber:   { text:"#fbbf24", soft:"rgba(251,191,36,.12)" },
  emerald: { text:"#34d399", soft:"rgba(52,211,153,.12)" },
  rose:    { text:"#fb7185", soft:"rgba(251,113,133,.12)" },
  sky:     { text:"#38bdf8", soft:"rgba(56,189,248,.12)" },
};

const ICONS = {
  cog: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  fuel: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>',
  gauge: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M12 14 16 6"/><circle cx="12" cy="14" r="8"/></svg>',
  cal: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  car: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5"><path d="M5 17H3v-6l2-5h12l3 5v6h-2M5 17a2 2 0 1 0 4 0M5 17h10m4 0a2 2 0 1 1-4 0"/></svg>',
};

let ALL_LISTINGS = [];

function cardHTML(l, idx){
  const a = ACCENTS[l.accent] || ACCENTS.amber;
  const waText = encodeURIComponent(`Hi Solstar Motors, I'm interested in the ${l.title} (${l.year}) listed at ${l.price}.`);

  // Supports either the new "images": [...] array (multi-photo, with a mini gallery)
  // or the older single "image": "..." field, so existing listings keep working unchanged.
  const images = (l.images && l.images.length) ? l.images : (l.image ? [l.image] : []);
  const hasGallery = images.length > 1;

  let photoHTML;
  if(images.length === 0){
    photoHTML = ICONS.car;
  } else if(!hasGallery){
    photoHTML = `<img src="${images[0]}" alt="${l.title}">`;
  } else {
    photoHTML = `
      <img src="${images[0]}" alt="${l.title}" class="gal-img" data-idx="0" data-images='${JSON.stringify(images)}'>
      <button class="gal-btn gal-prev" data-card="${idx}" aria-label="Previous photo">‹</button>
      <button class="gal-btn gal-next" data-card="${idx}" aria-label="Next photo">›</button>
      <span class="gal-count">1/${images.length}</span>`;
  }

  return `
  <div class="card">
    ${l.urgencyTag ? `<div class="card-tag" style="background:${a.text}">${l.urgencyTag}</div>` : ""}
    <div class="card-photo" data-card-id="${idx}">${photoHTML}</div>
    <div class="card-body">
      <div class="card-title-row">
        <div class="card-title">${l.title}</div>
        <div class="card-year" style="background:${a.soft};color:${a.text}">${l.year}</div>
      </div>
      <div class="card-specs mono">
        <div>${ICONS.cog} Trans: ${l.transmission || "—"}</div>
        <div>${ICONS.fuel} Engine: ${l.engine || "—"}</div>
        <div>${ICONS.gauge} Mileage: ${l.mileage || "—"}</div>
        <div>${ICONS.cal} Cond: ${(l.condition||"").split(",")[0] || "—"}</div>
      </div>
      ${l.features?.length ? `<div class="card-features">${l.features.slice(0,4).map(f=>`<span>${f}</span>`).join("")}</div>` : ""}
      <div class="card-divider"></div>
      <div class="card-footer">
        <div>
          <div class="card-price" style="color:${a.text}">${l.price}</div>
          ${l.negotiable ? `<div class="card-negotiable">Negotiable</div>` : ""}
        </div>
      </div>
      <a class="btn-whatsapp" style="background:${a.text}" href="https://wa.me/254102145494?text=${waText}" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
    </div>
  </div>`;
}

function render(list){
  const grid = document.getElementById("grid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("countLabel");
  count.textContent = `${list.length} live`;
  if(list.length === 0){
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  grid.innerHTML = list.map((l,i) => cardHTML(l,i)).join("");
}

// Gallery arrow clicks (event delegation so it works for every card)
document.getElementById("grid").addEventListener("click", (e) => {
  const btn = e.target.closest(".gal-btn");
  if(!btn) return;
  const wrap = btn.closest(".card-photo");
  const img = wrap.querySelector(".gal-img");
  const images = JSON.parse(img.dataset.images);
  let idx = parseInt(img.dataset.idx, 10);
  idx = btn.classList.contains("gal-next") ? (idx + 1) % images.length : (idx - 1 + images.length) % images.length;
  img.dataset.idx = idx;
  img.src = images[idx];
  wrap.querySelector(".gal-count").textContent = `${idx+1}/${images.length}`;
});

fetch("listings.json")
  .then(r => r.json())
  .then(data => {
    ALL_LISTINGS = data;
    render(ALL_LISTINGS);
  })
  .catch(() => {
    document.getElementById("grid").innerHTML = "";
    document.getElementById("emptyState").textContent = "Couldn't load listings — check that listings.json is in the same folder as index.html.";
    document.getElementById("emptyState").style.display = "block";
  });

document.getElementById("searchBox").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  render(ALL_LISTINGS.filter(l => l.title.toLowerCase().includes(q)));
});
