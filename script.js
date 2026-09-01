const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const monthNames = {"05":"May","06":"Jun","07":"Jul","08":"Aug"};

function niceDate(iso){
  const d = new Date(iso+'T00:00:00');
  return d.toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});
}

function render(month='all'){
  grid.innerHTML='';
  const data=[...LOOKS].sort((a,b)=>b.instagram_date.localeCompare(a.instagram_date))
    .filter(x=>month==='all'||x.instagram_date.slice(5,7)===month);
  data.forEach(x=>{
    const el=document.createElement('article');
    el.className='card';
    el.tabIndex=0;
    el.innerHTML=`<img class="thumb" src="${x.web_image}" alt="FitzyDayy ${x.fd_code} outfit" loading="lazy"><div class="card-meta"><div><div class="code">${x.fd_code}</div><div class="date">${niceDate(x.instagram_date)}</div></div><span class="view">view look ♡</span></div>`;
    el.addEventListener('click',()=>openLook(x.fd_code));
    el.addEventListener('keydown',e=>{if(e.key==='Enter')openLook(x.fd_code)});
    grid.appendChild(el);
  });
}

function openLook(code){
  const x=LOOKS.find(v=>v.fd_code.toUpperCase()===code.toUpperCase());
  if(!x)return;
  const hasLink=Boolean(x.shopee_link);
  document.getElementById('modalBody').innerHTML=`<div class="detail"><img class="detail-img" src="${x.web_image}" alt="${x.fd_code} outfit"><div class="detail-copy"><p class="kicker">fitzydayy lookbook</p><h2 id="modalTitle">${x.fd_code}</h2><div class="date-line">Posted ${niceDate(x.instagram_date)}</div><div class="small-rule"></div><p>Found this look on Instagram? This is the matching FitzyDayy OOTD page.</p><div class="shop">${hasLink?`<a class="shop-btn" href="${x.shopee_link}" target="_blank" rel="nofollow sponsored noopener">Shop this look on Shopee ↗</a><p class="affiliate">Affiliate link: FitzyDayy may receive a commission from qualifying purchases, at no extra cost to you.</p>`:`<span class="shop-btn pending">Shop link coming soon</span><p class="affiliate">The original image is live, but the shopping link for this early look has not been added yet.</p>`}</div></div></div>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

document.getElementById('searchForm').addEventListener('submit',e=>{
  e.preventDefault();
  let v=document.getElementById('searchInput').value.trim().toUpperCase().replace(/\s+/g,'');
  if(/^\d{1,3}$/.test(v))v='FD'+v.padStart(3,'0');
  const found=LOOKS.find(x=>x.fd_code===v);
  const msg=document.getElementById('searchMessage');
  if(found){msg.textContent=`Found ${found.fd_code} ♡`;openLook(found.fd_code)}else{msg.textContent=v?`No look found for ${v}. Try a code from FD001–FD035.`:'Type an OOTD code first.'}
});

document.querySelectorAll('.chip').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.month);
}));
render();
