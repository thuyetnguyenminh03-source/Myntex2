const rootEl = document.documentElement;
const prefersDarkMq = window.matchMedia('(prefers-color-scheme: dark)');
const prefersReducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

const motionBehavior = () => (prefersReducedMotionMq.matches ? 'auto' : 'smooth');
const addMqListener = (mq, cb) => {
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', cb);
  else if (typeof mq.addListener === 'function') mq.addListener(cb);
};

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });
  navMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Theme toggle
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  rootEl.setAttribute('data-theme', savedTheme);
} else if (!prefersDarkMq.matches) {
  rootEl.setAttribute('data-theme', 'light');
}
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const current = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  rootEl.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
});

// Accent palette
const accentSaved = localStorage.getItem('accent') || 'violet';
rootEl.setAttribute('data-accent', accentSaved);
document.querySelectorAll('.swatch').forEach((btn) => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.accent;
    rootEl.setAttribute('data-accent', value);
    localStorage.setItem('accent', value);
  });
});

// Scroll progress
const ensureScrollProgress = () => {
  let bar = document.querySelector('.scroll-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
  }
  const update = () => {
    const doc = document.documentElement;
    const height = doc.scrollHeight - doc.clientHeight;
    const value = height > 0 ? (doc.scrollTop / height) * 100 : 0;
    bar.style.setProperty('--progress', `${value}%`);
  };
  let ticking = false;
  document.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true }
  );
  update();
};
ensureScrollProgress();

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal-up').forEach((el) => revealObserver.observe(el));

// Counters
const counters = document.querySelectorAll('.m-num');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count) || 0;
      const start = performance.now();
      const duration = 1200;
      const step = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        el.textContent = Math.round(target * progress).toLocaleString('vi-VN');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((el) => counterObserver.observe(el));

// Hero parallax
const heroSection = document.getElementById('hero');
const heroCard = document.querySelector('.hero-art .card');
const heroCopy = document.querySelector('.hero-copy');
const heroParallaxEnabled = window.matchMedia('(pointer: fine)').matches;
if (heroSection && heroCard && heroCopy && heroParallaxEnabled) {
  const parallax = (event) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.setProperty('--hero-card-x', `${x * 16}px`);
    heroCard.style.setProperty('--hero-card-y', `${y * 12}px`);
    heroCopy.style.setProperty('--hero-copy-x', `${x * -10}px`);
    heroCopy.style.setProperty('--hero-copy-y', `${y * -6}px`);
  };
  const reset = () => {
    heroCard.style.setProperty('--hero-card-x', '0px');
    heroCard.style.setProperty('--hero-card-y', '0px');
    heroCopy.style.setProperty('--hero-copy-x', '0px');
    heroCopy.style.setProperty('--hero-copy-y', '0px');
  };
  heroSection.addEventListener('pointermove', parallax);
  heroSection.addEventListener('pointerleave', reset);
}

const projectCases = {
  sun: {
    title: 'Sun Nha Trang — KV Launch',
    desc: 'Key Visual launch đa nền tảng, guideline & asset pack giúp triển khai đồng bộ toàn chiến dịch.'
  },
  blanca: {
    title: 'Blanca City — B6·B7 Identity',
    desc: 'Bộ nhận diện hoàn chỉnh gồm lockup, palette, grid và social kit giúp đảm bảo tính nhất quán.'
  },
  latien: {
    title: 'La Tiên Villa — Brochure Wabi‑Sabi',
    desc: 'Brochure phong cách Wabi-Sabi kết hợp chất liệu in cao cấp, layout tinh gọn và hình ảnh giàu cảm xúc.'
  },
  recruitment: {
    title: 'Recruitment — KOL/KOC BĐS',
    desc: 'Campaign tuyển KOL/KOC cho BĐS với content framework, key visual và bộ ấn phẩm truyền thông.'
  },
  ankhang: {
    title: 'An Khang Media — Social Ads',
    desc: 'Social Ads kit đa định dạng, tối ưu turn-around, tăng hiệu suất chuyển đổi cho kênh media.'
  },
  posm: {
    title: 'POSM — Booth & Standee',
    desc: 'POSM booth, standee, backdrop & wayfinding đồng bộ cho trải nghiệm sự kiện nhất quán.'
  },
  park: {
    title: 'The Park Residence — Launch Assets',
    desc: 'Bộ asset social + sales kit cho The Park Residence, bảo đảm nhận diện đồng bộ mọi điểm chạm.'
  },
  royal: {
    title: 'Royal Riverside — Identity System',
    desc: 'Thiết kế lockup, palette và guideline cho Royal Riverside, tối ưu triển khai đa nền tảng.'
  },
  aurora: {
    title: 'Aurora Garden — Brochure Luxe',
    desc: 'Brochure cao cấp với chất liệu metallic, bố cục sang trọng và hệ icon đồng bộ.'
  },
  metro: {
    title: 'Metro Skyline — Sales Kit',
    desc: 'Sales kit đa kênh cho Metro Skyline: profile, deck và key visual cho đội ngũ kinh doanh.'
  }
};

const filterButtons = document.querySelectorAll('.filters .chip');
const pointerFine = window.matchMedia('(pointer: fine)').matches;
const projectGrid = document.querySelector('.project-grid');
const projectPrev = document.getElementById('projectPrev');
const projectNext = document.getElementById('projectNext');
const projectCards = projectGrid ? [...projectGrid.querySelectorAll('.project-card')] : [];
const cardsPerPage = 6;
let activeProjectFilter = 'all';
let projectPage = 0;

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeProjectFilter = btn.dataset.filter || 'all';
    projectPage = 0;
    renderProjectPage();
  });
});

const getFilteredCards = () =>
  projectCards.filter((card) => activeProjectFilter === 'all' || card.dataset.cat === activeProjectFilter);

const renderProjectPage = () => {
  if (!projectGrid || !projectCards.length) return;
  const filtered = getFilteredCards();
  const totalPages = Math.max(1, Math.ceil(filtered.length / cardsPerPage));
  projectPage = Math.min(projectPage, totalPages - 1);
  projectGrid.classList.add('transitioning');
  projectCards.forEach((card) => {
    card.hidden = true;
  });
  const start = projectPage * cardsPerPage;
  filtered.slice(start, start + cardsPerPage).forEach((card) => {
    card.hidden = false;
  });
  const showNav = totalPages > 1;
  [projectPrev, projectNext].forEach((btn) => btn?.classList.toggle('hidden', !showNav));
  projectPrev?.toggleAttribute('disabled', projectPage === 0);
  projectNext?.toggleAttribute('disabled', projectPage >= totalPages - 1);
  setTimeout(() => projectGrid.classList.remove('transitioning'), 180);
};

projectPrev?.addEventListener('click', () => {
  if (projectPage === 0) return;
  projectPage -= 1;
  renderProjectPage();
});

projectNext?.addEventListener('click', () => {
  const totalPages = Math.max(1, Math.ceil(getFilteredCards().length / cardsPerPage));
  if (projectPage >= totalPages - 1) return;
  projectPage += 1;
  renderProjectPage();
});

renderProjectPage();

if (window.matchMedia('(pointer: fine)').matches) {
  projectCards.forEach((card) => {
    const resetTilt = () => {
      card.style.setProperty('--tiltX', '0deg');
      card.style.setProperty('--tiltY', '0deg');
    };
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.setProperty('--tiltX', `${x.toFixed(2)}deg`);
      card.style.setProperty('--tiltY', `${y.toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', resetTilt);
    card.addEventListener('pointerup', resetTilt);
  });
}

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalImg = document.getElementById('modalImg');
const modalBtn = document.getElementById('modalBtn');
const modalCloseBtn = modal?.querySelector('.modal-close');
let modalFocusableItems = [];
let lastFocusedElement = null;

const focusableSelectors = 'a[href], button:not([disabled])';

const openModal = (caseId, trigger) => {
  if (!modal || !modalTitle || !modalDesc || !modalImg || !modalBtn) return;
  const data = projectCases[caseId] || {};
  const card = trigger.closest('.project-card');
  const cardTitle = card?.querySelector('h3')?.textContent?.trim();
  const cardTags = card?.querySelector('.p-tags')?.textContent?.trim();
  const coverImg = card?.querySelector('img');

  modalTitle.textContent = data.title || cardTitle || 'Case Study';
  modalDesc.textContent = data.desc || cardTags || 'Chi tiết dự án sẽ được cập nhật.';
  if (coverImg) {
    modalImg.src = coverImg.src;
    modalImg.alt = coverImg.alt || modalTitle.textContent;
  }
  modalBtn.href = trigger.href;

  lastFocusedElement = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  modalFocusableItems = [...modal.querySelectorAll(focusableSelectors)];
  (modalFocusableItems[0] || modal).focus();
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalFocusableItems = [];
  lastFocusedElement?.focus();
};

document.addEventListener('click', (event) => {
  const btn = event.target.closest('.p-view');
  if (!btn) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (!modal) return;
  const id = btn.dataset.case;
  if (!id) return;
  event.preventDefault();
  openModal(id, btn);
});

modal?.addEventListener('click', (event) => {
  if (event.target.dataset.close === 'true') {
    closeModal();
  }
});

modalCloseBtn?.addEventListener('click', closeModal);

modal?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab' || modalFocusableItems.length < 2) return;
  const first = modalFocusableItems[0];
  const last = modalFocusableItems[modalFocusableItems.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('open')) {
    closeModal();
  }
});

// Slider / testimonials
const sliderEl = document.getElementById('slider');
if (sliderEl) {
  const slides = [...sliderEl.querySelectorAll('.slide')];
  const nextBtn = sliderEl.querySelector('.slider-next');
  const prevBtn = sliderEl.querySelector('.slider-prev');
  const progressSpan = sliderEl.querySelector('.slider-progress span');
  const sliderThemes = ['violet', 'teal', 'rose'];
  let sliderIndex = slides.findIndex((slide) => slide.classList.contains('active'));
  if (sliderIndex < 0) sliderIndex = 0;
  let autoTimer = null;
  let pointerStart = null;

  const setSlide = (index) => {
    if (!slides.length) return;
    sliderIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      const active = idx === sliderIndex;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (progressSpan) {
      const progress = slides.length ? ((sliderIndex + 1) / slides.length) * 100 : 0;
      progressSpan.style.width = `${progress}%`;
    }
    sliderEl.dataset.theme = sliderThemes[sliderIndex % sliderThemes.length];
  };

  const nextSlide = () => {
    if (slides.length < 2) return;
    setSlide(sliderIndex + 1);
  };
  const prevSlide = () => {
    if (slides.length < 2) return;
    setSlide(sliderIndex - 1);
  };

  const stopAuto = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const startAuto = () => {
    if (slides.length < 2) return;
    stopAuto();
    autoTimer = window.setInterval(nextSlide, 4800);
  };

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    startAuto();
  });
  prevBtn?.addEventListener('click', () => {
    prevSlide();
    startAuto();
  });

  sliderEl.addEventListener('pointerdown', (event) => {
    if (slides.length < 2) return;
    pointerStart = event.clientX;
    sliderEl.setPointerCapture?.(event.pointerId);
    stopAuto();
  });

  sliderEl.addEventListener('pointerup', (event) => {
    if (pointerStart === null) return;
    const delta = event.clientX - pointerStart;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prevSlide() : nextSlide();
    }
    pointerStart = null;
    sliderEl.releasePointerCapture?.(event.pointerId);
    startAuto();
  });
  sliderEl.addEventListener('pointercancel', () => {
    pointerStart = null;
    startAuto();
  });

  sliderEl.addEventListener('mouseenter', stopAuto);
  sliderEl.addEventListener('mouseleave', startAuto);
  sliderEl.addEventListener('focusin', stopAuto);
  sliderEl.addEventListener('focusout', () => {
    if (!sliderEl.contains(document.activeElement)) startAuto();
  });

  slides.forEach((slide, idx) => {
    slide.setAttribute('aria-hidden', String(idx !== sliderIndex));
  });
  setSlide(sliderIndex);
  startAuto();
}

// Smooth anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  const href = anchor.getAttribute('href');
  if (!href || href.length <= 1) return;
  const targetId = href.slice(1);
  anchor.addEventListener('click', (event) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: motionBehavior(), block: 'start' });
    if (navMenu && navToggle) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Download CV (print resume section)
document.getElementById('downloadCV')?.addEventListener('click', (event) => {
  event.preventDefault();
  window.print();
});

// Copy email
const copyEmailBtn = document.getElementById('copyEmail');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    const email = 'Thuyet.nguyenminh03@gmail.com';
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(email)
        .then(() => alert(`Đã sao chép: ${email}`))
        .catch(() => window.prompt('Không thể sao chép tự động. Copy email thủ công:', email));
    } else {
      window.prompt('Copy email thủ công:', email);
    }
  });
}

// Contact form -> Formspree submit
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (formStatus) {
      formStatus.textContent = 'Đang gửi...';
      formStatus.classList.remove('error');
    }
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn?.setAttribute('disabled', 'true');
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm)
      });
      if (!response.ok) throw new Error('Form submit failed');
      contactForm.reset();
      if (formStatus) formStatus.textContent = 'Đã gửi! Mình sẽ phản hồi sớm nhất có thể.';
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'Gửi không thành công. Vui lòng thử lại hoặc email contact@anhthuyet.design.';
        formStatus.classList.add('error');
      }
    } finally {
      submitBtn?.removeAttribute('disabled');
    }
  });
}

// Back to top buttons
document.querySelectorAll('.back-to-top').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: motionBehavior() });
  });
});

// Zalo popup
const zaloBtn = document.getElementById('zaloContact');
const zaloPopup = document.getElementById('zaloPopup');
if (zaloBtn && zaloPopup) {
  const zaloLink = zaloBtn.dataset.link || 'https://zalo.me/0912275643';
  const closeZalo = () => {
    zaloPopup.classList.remove('open');
    zaloPopup.setAttribute('aria-hidden', 'true');
  };
  zaloBtn.addEventListener('click', () => {
    window.open(zaloLink, '_blank', 'noopener');
  });
  zaloPopup.querySelector('.btn')?.setAttribute('href', zaloLink);
  zaloPopup.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'true') {
      closeZalo();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && zaloPopup.classList.contains('open')) {
      closeZalo();
    }
  });
}

// Typewriter effect for lede
const typewriter = document.querySelector('.typewriter');
if (typewriter) {
  const output = typewriter.querySelector('.typewriter-text');
  const caret = typewriter.querySelector('.typewriter-caret');
  const text = typewriter.dataset.text || '';
  let index = 0;
  const speed = 40;
  const restartDelay = 2000;
  const startTyping = () => {
    index = 0;
    if (caret) {
      caret.style.visibility = 'visible';
      caret.classList.add('blink');
    }
    output.textContent = '';
    const write = () => {
      if (!output) return;
      if (index <= text.length) {
        output.textContent = text.slice(0, index);
        index += 1;
        setTimeout(write, speed);
      } else if (caret) {
        caret.style.visibility = 'hidden';
        setTimeout(startTyping, restartDelay);
      }
    };
    write();
  };
  startTyping();
}
