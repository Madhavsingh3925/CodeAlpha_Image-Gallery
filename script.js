(function(){
  const gallery = document.getElementById('gallery');
  const items = Array.from(gallery.querySelectorAll('.item'));
  const filters = document.querySelectorAll('.filters button');
  const searchInput = document.getElementById('searchInput');

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnClose = document.getElementById('btnClose');

  let currentIndex = -1;
  let activeList = items; // items currently visible (after filter/search)

  // Open lightbox for a given index (in activeList
  function openLightbox(index){
    if(!activeList.length) return;
    currentIndex = (index + activeList.length) % activeList.length;
    const el = activeList[currentIndex];
    const img = el.querySelector('img');
    lbImg.style.opacity = 0;
    lbImg.onload = () => { lbImg.style.opacity = 1; };
    lbImg.src = img.src.replace(/\/\d+\/\d+$/, '/1600/1200'); // request a larger image if using picsum
    lbImg.alt = img.alt || '';
    lbCaption.textContent = el.dataset.caption || img.alt || '';
    lbCounter.textContent = `${currentIndex + 1} / ${activeList.length}`;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    currentIndex = -1;
  }

  function next(){ if(activeList.length)  openLightbox(currentIndex + 1); }
  function prev(){ if(activeList.length)  openLightbox(currentIndex - 1); }

 // Click to open
  items.forEach((el) => {
    el.addEventListener('click', () => {
      // determine index within current activeList
      const visible = activeList.filter(it => !it.classList.contains('hidden'));
      activeList = visible.length ? visible : activeList;
      const startIndex = activeList.indexOf(el);
      openLightbox(startIndex < 0 ? 0 : startIndex);
    });
  });

  // Lightbox controls
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  btnClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    // close when clicking dark backdrop (but not when clicking inside stage
    if(e.target === lightbox) closeLightbox();
 });

  window.addEventListener('keydown', (e) => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

  // Filtering
  function applyFilters(){
    const activeBtn = document.querySelector('.filters button.active');
    const filter = activeBtn ? activeBtn.dataset.filter : 'all';
    const term = searchInput.value.trim().toLowerCase();

    activeList = [];
    items.forEach(el => {
      const matchCategory = filter === 'all' || el.dataset.category === filter;
      const matchTerm = !term || (el.dataset.caption || '').toLowerCase().includes(term);
      const visible = matchCategory && matchTerm;
      el.classList.toggle('hidden', !visible);
      if(visible) activeList.push(el);
    });
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  // Initialize
  applyFilters();
})();