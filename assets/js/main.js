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

// Typewriter setup
const typewriter = document.querySelector('.typewriter');
const typewriterOutput = typewriter?.querySelector('.typewriter-text');
const typewriterCaret = typewriter?.querySelector('.typewriter-caret');
let typewriterTimer;
let typewriterWords = [];
let typewriterWordIndex = 0;
let typewriterCharIndex = 0;
let typewriterTyping = true;
const TYPEWRITER_SPEED = 40;
const TYPEWRITER_HOLD = 2000;
const TYPEWRITER_ERASE = 30;

const setTypewriterCaretVisible = (visible) => {
  if (!typewriterCaret) return;
  typewriterCaret.style.visibility = visible ? 'visible' : 'hidden';
  typewriterCaret.classList.toggle('blink', visible);
};

const runTypewriter = () => {
  if (!typewriter || !typewriterOutput || !typewriterWords.length) return;
  const currentWord = typewriterWords[typewriterWordIndex % typewriterWords.length] || '';
  if (typewriterTyping) {
    typewriterOutput.textContent = currentWord.slice(0, typewriterCharIndex);
    typewriterCharIndex += 1;
    if (typewriterCharIndex > currentWord.length) {
      typewriterTyping = false;
      setTypewriterCaretVisible(false);
      typewriterTimer = setTimeout(runTypewriter, TYPEWRITER_HOLD);
      return;
    }
    typewriterTimer = setTimeout(runTypewriter, TYPEWRITER_SPEED);
  } else {
    typewriterCharIndex -= 1;
    typewriterOutput.textContent = currentWord.slice(0, Math.max(typewriterCharIndex, 0));
    if (typewriterCharIndex <= 0) {
      typewriterTyping = true;
      typewriterWordIndex += 1;
      setTypewriterCaretVisible(true);
      typewriterTimer = setTimeout(runTypewriter, 400);
    } else {
      typewriterTimer = setTimeout(runTypewriter, TYPEWRITER_ERASE);
    }
  }
};

const initTypewriter = () => {
  if (!typewriter) return;
  clearTimeout(typewriterTimer);
  const text = typewriter.dataset.text || '';
  typewriterWords = text
    .split(/(?<=\.)\s+/)
    .map((str) => str.trim())
    .filter(Boolean);
  if (!typewriterWords.length && text) typewriterWords = [text];
  typewriterWordIndex = 0;
  typewriterCharIndex = 0;
  typewriterTyping = true;
  setTypewriterCaretVisible(true);
  runTypewriter();
};

// Translations
const translations = {
  vi: {
    'nav.about': 'Giới thiệu',
    'nav.projects': 'Dự án',
    'nav.services': 'Dịch vụ',
    'nav.skills': 'Kỹ năng',
    'nav.testimonials': 'Khách hàng',
    'nav.contact': 'Liên hệ',
    'nav.themeToggle': 'Đổi chế độ sáng/tối',
    'hero.greeting': 'Xin chào, tôi là',
    'hero.subhead': 'Thiết kế đồ hoạ BĐS • Brand Identity • Social Ads',
    'hero.ctaPrimary': 'Tải CV',
    'hero.ctaSecondary': 'Xem Dự Án',
    'hero.typewriter':
      'Tôi biến insight thành thiết kế có hiệu quả kinh doanh — tập trung lĩnh vực bất động sản, từ nhận diện thương hiệu, bộ ấn phẩm đến chiến dịch social đồng bộ.',
    'hero.scroll': 'Cuộn xuống',
    'about.title': 'Kinh nghiệm',
    'about.lead':
      'Hơn 3 năm thiết kế trong lĩnh vực BĐS & thương hiệu. Kết hợp tư duy chiến lược, gu thẩm mỹ hiện đại, sang trọng và workflow tối ưu để tạo ra sản phẩm hoàn thiện, đúng hạn, đúng mục tiêu.',
    'timeline.1.title': '11/2024 – 2025 · Công ty CP Tư vấn & Đầu tư BĐS An Khang',
    'timeline.1.item1': 'Design xây dựng bộ nhận diện, KV chiến dịch cho danh mục dự án cao cấp.',
    'timeline.1.item2': 'Điều phối sản phẩm digital & POSM đồng bộ giữa team in-house và agency đối tác.',
    'timeline.2.title': '05/2024 – 10/2024 · Công ty TNHH Địa ốc Nhà Đại Phát',
    'timeline.2.item1': 'Thiết kế bộ sản phẩm truyền thông cho dự án BĐS hạng sang, chuẩn hoá guideline visual.',
    'timeline.2.item2': 'Thực hiện social media post, motion short-form và chỉnh sửa video giới thiệu dự án.',
    'timeline.3.title': '02/2024 – 05/2024 · Freelance Designer',
    'timeline.3.item1': 'Thiết kế social media post theo KPI chiến dịch.',
    'timeline.3.item2': 'Phát triển brochure, banner, poster & các ấn phẩm in ấn cho đối tác BĐS.',
    'timeline.4.title': '10/2022 – 01/2023 · Intern Designer — Toppion Coaching & Consulting Group',
    'timeline.4.item1': 'Thiết kế cover cho sách/ấn phẩm đào tạo, social post và tài liệu nội bộ.',
    'timeline.4.item2': 'Hỗ trợ sản xuất brochure, standee, vật phẩm workshop.',
    'timeline.5.title': '02/2022 – 09/2022 · Part-time Designer — Công ty TNHH Hoàng Đức Hải',
    'timeline.5.item1': 'Thực hiện social media post theo chiến dịch tuần.',
    'timeline.5.item2': 'Thiết kế hình ảnh website, banner landing, tối ưu trải nghiệm trực tuyến.',
    'metrics.projects': 'Dự án hoàn thành',
    'metrics.brands': 'Thương hiệu hợp tác',
    'metrics.industries': 'Ngành hàng',
    'metrics.solutions': 'Giải pháp dịch vụ',
    'projects.title': 'Dự án nổi bật',
    'projects.filter.all': 'Tất cả',
    'projects.filter.brand': 'Branding',
    'projects.filter.social': 'Social',
    'projects.filter.print': 'Print',
    'projects.prev': 'Dự án trước',
    'projects.next': 'Dự án tiếp theo',
    'projects.view': 'Xem full',
    'projects.modal.title': 'Case Study',
    'projects.modal.desc': 'Mô tả ngắn gọn về mục tiêu, insight, giải pháp và kết quả.',
    'projects.modal.cta': 'Xem chi tiết',
    'services.title': 'Dịch vụ',
    'services.card1.title': 'Brand Identity',
    'services.card1.desc': 'Logo, hệ màu, typography, guideline, stationery, ứng dụng nhận diện.',
    'services.card1.item1': 'Nghiên cứu & định vị',
    'services.card1.item2': 'Key visual & ứng dụng',
    'services.card1.item3': 'Brandbook (PDF)',
    'services.card2.title': 'Social & Campaign',
    'services.card2.desc': 'KV, bộ banner, video short, landing, kế hoạch nội dung & A/B test.',
    'services.card2.item1': 'Content & Visual system',
    'services.card2.item2': 'Media Kit',
    'services.card2.item3': 'Performance creative',
    'services.card3.title': 'Print & POSM',
    'services.card3.desc': 'Brochure, flyer, standee, OOH, 2D booth, in ấn và bàn giao file chuẩn.',
    'services.card3.item1': 'Kỹ thuật in & vật liệu',
    'services.card3.item2': 'Dàn trang chuyên nghiệp',
    'services.card3.item3': 'File in chuẩn',
    'skills.title': 'Kỹ năng',
    'testimonials.eyebrow': 'Lắng nghe ý kiến',
    'testimonials.title': 'Khách hàng nói về <span class=\"highlight\">Minh Thuyết</span>',
    'testimonials.lead': 'Creative partner được tin tưởng bởi đội ngũ Sales & Marketing tại các dự án BĐS cao cấp.',
    'testimonials.quote1': '“Thiết kế đẹp và đúng deadline. Chiến dịch social tăng tương tác 3×.”',
    'testimonials.meta1': 'Trưởng phòng Marketing, BĐS cao cấp',
    'testimonials.quote2': '“Brandbook chi tiết, triển khai đồng bộ rất mượt.”',
    'testimonials.meta2': 'CEO Thương hiệu nội thất',
    'testimonials.quote3': '“Tư duy hình ảnh hiện đại, phối hợp tốt với team media.”',
    'testimonials.meta3': 'Account Director, Agency',
    'testimonials.prev': 'Trước',
    'testimonials.next': 'Sau',
    'contact.title': 'Liên hệ',
    'contact.lead': 'Sẵn sàng cho dự án mới? Hãy nói về mục tiêu, ngân sách và timeline của bạn.',
    'contact.cta': 'Liên hệ',
    'contact.form.name': 'Họ tên',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Chủ đề',
    'contact.form.message': 'Tin nhắn',
    'contact.form.submit': 'Gửi',
    'contact.form.copy': 'Sao chép email',
    'contact.form.zalo': 'Chat Zalo',
    'contact.form.status.sending': 'Đang gửi...',
    'contact.form.status.success': 'Đã gửi! Mình sẽ phản hồi sớm nhất có thể.',
    'contact.form.status.error': 'Gửi không thành công. Vui lòng thử lại hoặc email contact@anhthuyet.design.',
    'contact.form.copySuccess': 'Đã sao chép: {email}',
    'contact.form.copyManual': 'Không thể sao chép tự động. Copy email thủ công:',
    'contact.info.title': 'Thông tin liên lạc',
    'contact.info.addressLabel': 'Địa chỉ',
    'contact.info.addressValue': 'Thủ Đức - Hồ Chí Minh, Việt Nam',
    'contact.info.phoneLabel': 'Điện thoại',
    'contact.info.phoneValue': '(+84) 0912.275.643',
    'contact.info.emailLabel': 'Email',
    'contact.info.emailValue': 'Thuyet.nguyenminh03@gmail.com',
    'contact.popup.title': 'Kết nối Zalo',
    'contact.popup.desc': 'Quét QR hoặc bấm nút dưới để chat nhanh qua Zalo.',
    'contact.popup.qr': 'Zalo QR',
    'contact.popup.cta': 'Mở Zalo',
    'case.breadcrumb.home': 'Trang chủ',
    'case.breadcrumb.projects': 'Dự án',
    'case.objectivesTitle': 'Mục tiêu & Thách thức',
    'case.galleryTitle': 'Hình ảnh triển khai',
    'case.resultsTitle': 'Kết quả chính',
    'case.kpi1': 'CTR chiến dịch',
    'case.kpi2': 'Thời gian sản xuất',
    'case.kpi3': 'Reach tự nhiên',
    'case.kpi4': 'Độ nhất quán brand',
    'case.back': '← Quay lại danh sách',
    'footer.copy': '© 2025 Minh Thuyết. Mọi quyền được bảo lưu.',
    'footer.backToTop': 'Lên đầu trang',
    'modal.close': 'Đóng'
  },
  en: {
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.skills': 'Skills',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Contact',
    'nav.themeToggle': 'Toggle light/dark mode',
    'hero.greeting': 'Hi, I’m',
    'hero.subhead': 'Real-estate creative • Brand Identity • Social Ads',
    'hero.ctaPrimary': 'Download CV',
    'hero.ctaSecondary': 'View Projects',
    'hero.typewriter':
      'I transform insight into business-effective design—focusing on real-estate branding, print assets, and cohesive social campaigns.',
    'hero.scroll': 'Scroll down',
    'about.title': 'Experience',
    'about.lead':
      'Over 3 years designing for real-estate and brand identity. Blending strategic thinking, modern aesthetics, and efficient workflow to deliver on-brief, on-time results.',
    'timeline.1.title': '11/2024 – 2025 · An Khang Real Estate Consulting & Investment',
    'timeline.1.item1': 'Built identity and key visuals for premium project clusters.',
    'timeline.1.item2': 'Coordinated digital/POSM assets between in-house teams and partner agencies.',
    'timeline.2.title': '05/2024 – 10/2024 · Nha Dai Phat Real Estate',
    'timeline.2.item1': 'Designed luxury project communication packs and standardized the visual guideline.',
    'timeline.2.item2': 'Produced social content, motion shorts, and edited campaign videos.',
    'timeline.3.title': '02/2024 – 05/2024 · Freelance Designer',
    'timeline.3.item1': 'Created social media posts aligned with campaign KPIs.',
    'timeline.3.item2': 'Developed brochures, banners, posters, and print assets for real-estate partners.',
    'timeline.4.title': '10/2022 – 01/2023 · Intern Designer — Toppion Coaching & Consulting Group',
    'timeline.4.item1': 'Designed covers for training materials, social posts, and internal documents.',
    'timeline.4.item2': 'Supported brochure, standee, and workshop collateral production.',
    'timeline.5.title': '02/2022 – 09/2022 · Part-time Designer — Hoang Duc Hai Co., Ltd.',
    'timeline.5.item1': 'Executed weekly social media campaigns.',
    'timeline.5.item2': 'Designed website visuals, landing banners, and optimized online experiences.',
    'metrics.projects': 'Projects delivered',
    'metrics.brands': 'Partner brands',
    'metrics.industries': 'Industries served',
    'metrics.solutions': 'Service solutions',
    'projects.title': 'Featured Projects',
    'projects.filter.all': 'All',
    'projects.filter.brand': 'Branding',
    'projects.filter.social': 'Social',
    'projects.filter.print': 'Print',
    'projects.prev': 'Previous projects',
    'projects.next': 'Next projects',
    'projects.view': 'View full case',
    'projects.modal.title': 'Case Study',
    'projects.modal.desc': 'A short summary covering objectives, insight, solution, and results.',
    'projects.modal.cta': 'View details',
    'services.title': 'Services',
    'services.card1.title': 'Brand Identity',
    'services.card1.desc': 'Logo, palette, typography, guidelines, stationery, and identity applications.',
    'services.card1.item1': 'Research & positioning',
    'services.card1.item2': 'Key visual & applications',
    'services.card1.item3': 'Brandbook (PDF)',
    'services.card2.title': 'Social & Campaign',
    'services.card2.desc': 'Key visuals, banner kits, short videos, landing pages, content & A/B testing.',
    'services.card2.item1': 'Content & visual system',
    'services.card2.item2': 'Media kit',
    'services.card2.item3': 'Performance creative',
    'services.card3.title': 'Print & POSM',
    'services.card3.desc': 'Brochures, flyers, standees, OOH, 2D booths, production-ready deliverables.',
    'services.card3.item1': 'Print technique & materials',
    'services.card3.item2': 'Professional layout',
    'services.card3.item3': 'Press-ready files',
    'skills.title': 'Skills',
    'testimonials.eyebrow': 'Clients say',
    'testimonials.title': 'Clients talk about <span class=\"highlight\">Minh Thuyết</span>',
    'testimonials.lead': 'Trusted creative partner for Sales & Marketing teams across luxury real-estate projects.',
    'testimonials.quote1': '“Designs were polished and always on deadline. Social campaigns tripled engagement.”',
    'testimonials.meta1': 'Head of Marketing, Luxury Real Estate',
    'testimonials.quote2': '“Detailed brandbook, super smooth deployment across channels.”',
    'testimonials.meta2': 'CEO, Interior Brand',
    'testimonials.quote3': '“Modern visual thinking and great collaboration with our media team.”',
    'testimonials.meta3': 'Account Director, Agency',
    'testimonials.prev': 'Previous',
    'testimonials.next': 'Next',
    'contact.title': 'Contact',
    'contact.lead': 'Ready for the next project? Let’s align on goals, budget, and timeline.',
    'contact.cta': 'Contact',
    'contact.form.name': 'Full name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send',
    'contact.form.copy': 'Copy email',
    'contact.form.zalo': 'Chat on Zalo',
    'contact.form.status.sending': 'Sending...',
    'contact.form.status.success': 'Sent! I’ll get back to you as soon as possible.',
    'contact.form.status.error': 'Submission failed. Please try again or email contact@anhthuyet.design.',
    'contact.form.copySuccess': 'Copied: {email}',
    'contact.form.copyManual': 'Auto-copy not available. Copy the email manually:',
    'contact.info.title': 'Contact info',
    'contact.info.addressLabel': 'Address',
    'contact.info.addressValue': 'Thu Duc – Ho Chi Minh City, Vietnam',
    'contact.info.phoneLabel': 'Phone',
    'contact.info.phoneValue': '(+84) 0912.275.643',
    'contact.info.emailLabel': 'Email',
    'contact.info.emailValue': 'Thuyet.nguyenminh03@gmail.com',
    'contact.popup.title': 'Connect on Zalo',
    'contact.popup.desc': 'Scan the QR or tap the button below to chat on Zalo.',
    'contact.popup.qr': 'Zalo QR',
    'contact.popup.cta': 'Open Zalo',
    'case.breadcrumb.home': 'Home',
    'case.breadcrumb.projects': 'Projects',
    'case.objectivesTitle': 'Objectives & Challenges',
    'case.galleryTitle': 'Implementation Gallery',
    'case.resultsTitle': 'Key Results',
    'case.kpi1': 'Campaign CTR',
    'case.kpi2': 'Production time',
    'case.kpi3': 'Organic reach',
    'case.kpi4': 'Brand consistency',
    'case.back': '← Back to list',
    'footer.copy': '© 2025 Minh Thuyết. All rights reserved.',
    'footer.backToTop': 'Back to top',
    'modal.close': 'Close'
  }
};

const casePages = {
  sun: {
    vi: {
      title: 'Sun Nha Trang — KV Launch',
      breadcrumbCurrent: 'Sun Nha Trang — KV Launch',
      metaRole: 'Vai trò: Art Director · Designer',
      metaTime: 'Thời gian: 2024–2025',
      metaTools: 'Công cụ: AI, PS, ID, Figma',
      summary: 'Key Visual Launch cho cụm dự án Sun Nha Trang — guideline & asset pack triển khai đa nền tảng.',
      objective: 'Mục tiêu: Tăng nhận biết thương hiệu & thúc đẩy chuyển đổi qua hệ thống visual đồng nhất đa kênh.',
      challenge: 'Thách thức: Deadline gấp, nhiều điểm chạm (POSM, social, landing), phải đảm bảo tính nhất quán và hiệu quả sản xuất.',
      strategy: 'Chiến lược: Thiết lập lưới bố cục, palette & typographic scale; chuẩn hoá template; tạo asset kit dùng lại được.',
      workflow: 'Workflow: Tư duy Design Thinking — Discover → Define → Develop → Deliver, kiểm thử A/B.'
    },
    en: {
      title: 'Sun Nha Trang — KV Launch',
      breadcrumbCurrent: 'Sun Nha Trang — KV Launch',
      metaRole: 'Role: Art Director · Designer',
      metaTime: 'Timeline: 2024–2025',
      metaTools: 'Tools: AI, PS, ID, Figma',
      summary: 'Key visual launch for the Sun Nha Trang cluster with guidelines and an asset pack for multi-channel rollout.',
      objective: 'Objective: Boost brand awareness and conversions through a cohesive visual system across every channel.',
      challenge: 'Challenge: Tight timeline with many touchpoints (POSM, social, landing) requiring consistency and efficient production.',
      strategy: 'Strategy: Build a layout grid, palette, and typographic scale; standardize templates; create a reusable asset kit.',
      workflow: 'Workflow: Design Thinking — Discover → Define → Develop → Deliver, with iterative A/B testing.'
    }
  },
  blanca: {
    vi: {
      title: 'Blanca City — B6·B7 Identity',
      breadcrumbCurrent: 'Blanca City — B6·B7 Identity',
      metaRole: 'Vai trò: Art Director · Designer',
      metaTime: 'Thời gian: 2024–2025',
      metaTools: 'Công cụ: AI, PS, ID, Figma',
      summary: 'Bộ nhận diện B6·B7: lockup, palette, grid, ứng dụng social/print và POSM.',
      objective: 'Mục tiêu: Tăng nhận biết thương hiệu & thúc đẩy chuyển đổi qua hệ thống visual đồng nhất đa kênh.',
      challenge: 'Thách thức: Deadline gấp, nhiều điểm chạm (POSM, social, landing), phải đảm bảo tính nhất quán và hiệu quả sản xuất.',
      strategy: 'Chiến lược: Thiết lập lưới bố cục, palette & typographic scale; chuẩn hoá template; tạo asset kit dùng lại được.',
      workflow: 'Workflow: Tư duy Design Thinking — Discover → Define → Develop → Deliver, kiểm thử A/B.'
    },
    en: {
      title: 'Blanca City — B6·B7 Identity',
      breadcrumbCurrent: 'Blanca City — B6·B7 Identity',
      metaRole: 'Role: Art Director · Designer',
      metaTime: 'Timeline: 2024–2025',
      metaTools: 'Tools: AI, PS, ID, Figma',
      summary: 'Complete B6·B7 identity system: lockup, palette, grid, and social/print & POSM applications.',
      objective: 'Objective: Grow brand awareness and conversion through a unified, multi-channel visual system.',
      challenge: 'Challenge: Compressed schedule with numerous touchpoints requiring strict consistency.',
      strategy: 'Strategy: Establish grid, palette, and scale; standardize templates; deliver a reusable asset kit.',
      workflow: 'Workflow: Design Thinking — Discover → Define → Develop → Deliver, plus iterative A/B testing.'
    }
  },
  latien: {
    vi: {
      title: 'La Tiên Villa — Brochure Wabi‑Sabi',
      breadcrumbCurrent: 'La Tiên Villa — Brochure Wabi‑Sabi',
      metaRole: 'Vai trò: Art Director · Designer',
      metaTime: 'Thời gian: 2024–2025',
      metaTools: 'Công cụ: AI, PS, ID, Figma',
      summary: 'Brochure La Tiên Villa phong cách Wabi‑Sabi: lưới, hierarchy, ảnh phối cảnh.',
      objective: 'Mục tiêu: Tăng nhận biết thương hiệu & thúc đẩy chuyển đổi qua hệ thống visual đồng nhất đa kênh.',
      challenge: 'Thách thức: Deadline gấp, nhiều điểm chạm (POSM, social, landing), phải đảm bảo tính nhất quán và hiệu quả sản xuất.',
      strategy: 'Chiến lược: Thiết lập lưới bố cục, palette & typographic scale; chuẩn hoá template; tạo asset kit dùng lại được.',
      workflow: 'Workflow: Tư duy Design Thinking — Discover → Define → Develop → Deliver, kiểm thử A/B.'
    },
    en: {
      title: 'La Tiên Villa — Wabi‑Sabi Brochure',
      breadcrumbCurrent: 'La Tiên Villa — Wabi‑Sabi Brochure',
      metaRole: 'Role: Art Director · Designer',
      metaTime: 'Timeline: 2024–2025',
      metaTools: 'Tools: AI, PS, ID, Figma',
      summary: 'Wabi-Sabi inspired brochure for La Tiên Villa: refined grids, hierarchy, and emotive 3D renders.',
      objective: 'Objective: Build trust and conversions via a consistent visual narrative across materials.',
      challenge: 'Challenge: Convey premium feel while balancing production constraints and multiple deliverables.',
      strategy: 'Strategy: Craft curated color/texture system, optimize typography, and modularize layouts for reuse.',
      workflow: 'Workflow: Discover → Define → Develop → Deliver with iterative client review sprints.'
    }
  },
  recruitment: {
    vi: {
      title: 'Recruitment — KOL/KOC BĐS',
      breadcrumbCurrent: 'Recruitment — KOL/KOC BĐS',
      metaRole: 'Vai trò: Art Director · Designer',
      metaTime: 'Thời gian: 2024–2025',
      metaTools: 'Công cụ: AI, PS, ID, Figma',
      summary: 'Chiến dịch tuyển KOL/KOC bất động sản: content framework + bộ ấn phẩm.',
      objective: 'Mục tiêu: Tăng nhận biết thương hiệu & thúc đẩy chuyển đổi qua hệ thống visual đồng nhất đa kênh.',
      challenge: 'Thách thức: Deadline gấp, nhiều điểm chạm (POSM, social, landing), phải đảm bảo tính nhất quán và hiệu quả sản xuất.',
      strategy: 'Chiến lược: Thiết lập lưới bố cục, palette & typographic scale; chuẩn hoá template; tạo asset kit dùng lại được.',
      workflow: 'Workflow: Tư duy Design Thinking — Discover → Define → Develop → Deliver, kiểm thử A/B.'
    },
    en: {
      title: 'Recruitment — Real Estate KOL/KOC',
      breadcrumbCurrent: 'Recruitment — Real Estate KOL/KOC',
      metaRole: 'Role: Art Director · Designer',
      metaTime: 'Timeline: 2024–2025',
      metaTools: 'Tools: AI, PS, ID, Figma',
      summary: 'Recruitment campaign for real-estate KOL/KOCs including content framework and full comms kit.',
      objective: 'Objective: Attract qualified creators and strengthen brand presence across channels.',
      challenge: 'Challenge: Align messaging for both brand and talent while meeting rapid rollout deadlines.',
      strategy: 'Strategy: Build narrative pillars, modular KV system, and ready-to-use social templates.',
      workflow: 'Workflow: Sprint-based production with QA checkpoints and iterative creative testing.'
    }
  },
  ankhang: {
    vi: {
      title: 'An Khang Media — Social Ads',
      breadcrumbCurrent: 'An Khang Media — Social Ads',
      metaRole: 'Vai trò: Art Director · Designer',
      metaTime: 'Thời gian: 2024–2025',
      metaTools: 'Công cụ: AI, PS, ID, Figma',
      summary: 'Hệ thống Social Ads cho An Khang Media: scale đa định dạng, tối ưu turn‑around.',
      objective: 'Mục tiêu: Tăng nhận biết thương hiệu & thúc đẩy chuyển đổi qua hệ thống visual đồng nhất đa kênh.',
      challenge: 'Thách thức: Deadline gấp, nhiều điểm chạm (POSM, social, landing), phải đảm bảo tính nhất quán và hiệu quả sản xuất.',
      strategy: 'Chiến lược: Thiết lập lưới bố cục, palette & typographic scale; chuẩn hoá template; tạo asset kit dùng lại được.',
      workflow: 'Workflow: Tư duy Design Thinking — Discover → Define → Develop → Deliver, kiểm thử A/B.'
    },
    en: {
      title: 'An Khang Media — Social Ads',
      breadcrumbCurrent: 'An Khang Media — Social Ads',
      metaRole: 'Role: Art Director · Designer',
      metaTime: 'Timeline: 2024–2025',
      metaTools: 'Tools: AI, PS, ID, Figma',
      summary: 'Social ads system for An Khang Media—multi-format scaling with faster turnarounds.',
      objective: 'Objective: Boost campaign efficiency and conversion across all paid channels.',
      challenge: 'Challenge: Maintain visual coherence while producing numerous formats under tight deadlines.',
      strategy: 'Strategy: Create reusable motion/static templates, dynamic color system, and automation-ready files.',
      workflow: 'Workflow: Agile production pipeline with batching, QC, and data-driven optimization.'
    }
  },
  posm: {
    vi: {
      title: 'POSM — Booth & Standee',
      breadcrumbCurrent: 'POSM — Booth & Standee',
      metaRole: 'Vai trò: Art Director · Designer',
      metaTime: 'Thời gian: 2024–2025',
      metaTools: 'Công cụ: AI, PS, ID, Figma',
      summary: 'POSM Booth & Standee cho sự kiện: booth, standee, backdrop, wayfinding.',
      objective: 'Mục tiêu: Tăng nhận biết thương hiệu & thúc đẩy chuyển đổi qua hệ thống visual đồng nhất đa kênh.',
      challenge: 'Thách thức: Deadline gấp, nhiều điểm chạm (POSM, social, landing), phải đảm bảo tính nhất quán và hiệu quả sản xuất.',
      strategy: 'Chiến lược: Thiết lập lưới bố cục, palette & typographic scale; chuẩn hoá template; tạo asset kit dùng lại được.',
      workflow: 'Workflow: Tư duy Design Thinking — Discover → Define → Develop → Deliver, kiểm thử A/B.'
    },
    en: {
      title: 'POSM — Booth & Standee',
      breadcrumbCurrent: 'POSM — Booth & Standee',
      metaRole: 'Role: Art Director · Designer',
      metaTime: 'Timeline: 2024–2025',
      metaTools: 'Tools: AI, PS, ID, Figma',
      summary: 'Event POSM system covering booth, standee, backdrop, and wayfinding for consistent experiences.',
      objective: 'Objective: Deliver a cohesive on-ground brand experience and drive visitor engagement.',
      challenge: 'Challenge: Handle large-scale fabrication assets while remaining consistent across vendors.',
      strategy: 'Strategy: Build modular POSM components, clear production specs, and adaptable visuals.',
      workflow: 'Workflow: Supplier coordination, prototyping, and on-site QA with rapid feedback loops.'
    }
  }
};

const langButtons = document.querySelectorAll('.lang-btn');
let currentLang = localStorage.getItem('lang') || 'vi';

const formatText = (text, vars = {}) => {
  if (!text) return '';
  let output = text;
  Object.entries(vars).forEach(([key, value]) => {
    output = output.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return output;
};

const getTextValue = (lang, key) => translations[lang]?.[key];

const translate = (key, vars = {}) => {
  const value = getTextValue(currentLang, key) ?? getTextValue('vi', key) ?? '';
  return formatText(value, vars);
};

const applyLanguage = (lang) => {
  if (!translations[lang]) lang = 'vi';
  currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  langButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = getTextValue(lang, el.dataset.i18n);
    if (value !== undefined) el.textContent = formatText(value);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = getTextValue(lang, el.dataset.i18nHtml);
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((mapping) => {
      const [attr, key] = mapping.split(':').map((part) => part.trim());
      if (!attr || !key) return;
      const value = getTextValue(lang, key);
      if (value !== undefined) el.setAttribute(attr, formatText(value));
    });
  });
  document.querySelectorAll('[data-i18n-typewriter]').forEach((el) => {
    const value = getTextValue(lang, el.dataset.i18nTypewriter);
    if (value !== undefined) {
      el.dataset.text = value;
      initTypewriter();
    }
  });
  applyCaseContent();
};

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang && btn.dataset.lang !== currentLang) {
      applyLanguage(btn.dataset.lang);
    }
  });
});

applyLanguage(currentLang);

function applyCaseContent() {
  const caseId = document.body.dataset.case;
  if (!caseId) return;
  const data = casePages[caseId]?.[currentLang] || casePages[caseId]?.vi;
  if (!data) return;
  if (data.title) {
    document.title = `${data.title} – Case Study`;
  }
  document.querySelectorAll('[data-case-key]').forEach((el) => {
    const key = el.dataset.caseKey;
    const value = data[key];
    if (value !== undefined) el.textContent = value;
  });
}

// Case contact modal
if (document.body.classList.contains('case-page')) {
  const contactModal = document.getElementById('projectContactModal');
  const contactForm = document.getElementById('projectContactForm');
  const contactStatus = document.getElementById('projectContactStatus');
  const openButtons = document.querySelectorAll('[data-open-contact]');
  if (contactModal && contactForm && contactStatus && openButtons.length) {
    const closeCaseModal = () => {
      contactModal.classList.remove('open');
      document.body.classList.remove('modal-open');
      contactStatus.textContent = '';
      contactStatus.classList.remove('error');
    };
    openButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        contactModal.classList.add('open');
        document.body.classList.add('modal-open');
      });
    });
    contactModal.addEventListener('click', (event) => {
      if (event.target.dataset.close === 'true') {
        closeCaseModal();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && contactModal.classList.contains('open')) {
        closeCaseModal();
      }
    });
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      contactStatus.textContent = translate('contact.form.status.sending');
      contactStatus.classList.remove('error');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn?.setAttribute('disabled', 'true');
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm)
        });
        if (!response.ok) throw new Error('submit fail');
        contactForm.reset();
        contactStatus.textContent = translate('contact.form.status.success');
      } catch (error) {
        contactStatus.textContent = translate('contact.form.status.error');
        contactStatus.classList.add('error');
      } finally {
        submitBtn?.removeAttribute('disabled');
      }
    });
  }
}
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
    rootEl.style.setProperty('--scroll-progress', (value / 100).toFixed(4));
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

// Section ambient glow on scroll
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  },
  { threshold: 0.35 }
);
document.querySelectorAll('.section').forEach((section) => sectionObserver.observe(section));

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
const heroCard = document.querySelector('.hero-art .card');
const heroCopy = document.querySelector('.hero-copy');
if (heroCard && heroCopy) {
  heroCard.style.setProperty('--hero-card-x', '0px');
  heroCard.style.setProperty('--hero-card-y', '0px');
  heroCopy.style.setProperty('--hero-copy-x', '0px');
  heroCopy.style.setProperty('--hero-copy-y', '0px');
}

// Chip glow animation
const chipRow = document.querySelector('.chip-row');
if (chipRow) {
  const chips = [...chipRow.querySelectorAll('.chip')];
  if (chips.length) {
    const updateGlow = (index) => {
      const target = chips[index % chips.length];
      const glowWidth = target.offsetWidth + 20;
      chipRow.style.setProperty('--chip-glow-width', `${glowWidth}px`);
      const offset = target.offsetLeft + (target.offsetWidth - glowWidth) / 2;
      chipRow.style.setProperty('--chip-glow-offset', `${offset}px`);
    };
    let chipIndex = 0;
    const highlight = () => {
      updateGlow(chipIndex);
      chipIndex += 1;
    };
    highlight();
    setInterval(highlight, 2200);
    window.addEventListener('resize', () => updateGlow(chipIndex));
  }
}

const projectCases = {
  sun: {
    vi: {
      title: 'Sun Nha Trang — KV Launch',
      desc: 'Key Visual launch đa nền tảng, guideline & asset pack giúp triển khai đồng bộ toàn chiến dịch.'
    },
    en: {
      title: 'Sun Nha Trang — KV Launch',
      desc: 'Multi-channel key visual launch with guidelines and asset packs for cohesive rollout.'
    }
  },
  blanca: {
    vi: {
      title: 'Blanca City — B6·B7 Identity',
      desc: 'Bộ nhận diện hoàn chỉnh gồm lockup, palette, grid và social kit giúp đảm bảo tính nhất quán.'
    },
    en: {
      title: 'Blanca City — B6·B7 Identity',
      desc: 'Complete identity system including lockup, palette, grid, and social kit for full consistency.'
    }
  },
  latien: {
    vi: {
      title: 'La Tiên Villa — Brochure Wabi‑Sabi',
      desc: 'Brochure phong cách Wabi-Sabi kết hợp chất liệu in cao cấp, layout tinh gọn và hình ảnh giàu cảm xúc.'
    },
    en: {
      title: 'La Tiên Villa — Wabi-Sabi Brochure',
      desc: 'Wabi-Sabi inspired brochure with premium finishes, minimal layout, and emotive imagery.'
    }
  },
  recruitment: {
    vi: {
      title: 'Recruitment — KOL/KOC BĐS',
      desc: 'Campaign tuyển KOL/KOC cho BĐS với content framework, key visual và bộ ấn phẩm truyền thông.'
    },
    en: {
      title: 'Recruitment — Real Estate KOL/KOC',
      desc: 'Recruitment campaign with content framework, key visuals, and a full communication kit.'
    }
  },
  ankhang: {
    vi: {
      title: 'An Khang Media — Social Ads',
      desc: 'Social Ads kit đa định dạng, tối ưu turn-around, tăng hiệu suất chuyển đổi cho kênh media.'
    },
    en: {
      title: 'An Khang Media — Social Ads',
      desc: 'Multi-format social ads kit optimizing turnaround time and conversion for media channels.'
    }
  },
  posm: {
    vi: {
      title: 'POSM — Booth & Standee',
      desc: 'POSM booth, standee, backdrop & wayfinding đồng bộ cho trải nghiệm sự kiện nhất quán.'
    },
    en: {
      title: 'POSM — Booth & Standee',
      desc: 'Unified POSM system: booth, standee, backdrop, and wayfinding for seamless events.'
    }
  },
  park: {
    vi: {
      title: 'The Park Residence — Launch Assets',
      desc: 'Bộ asset social + sales kit cho The Park Residence, bảo đảm nhận diện đồng bộ mọi điểm chạm.'
    },
    en: {
      title: 'The Park Residence — Launch Assets',
      desc: 'Social assets and sales kit ensuring consistent identity across every touchpoint.'
    }
  },
  royal: {
    vi: {
      title: 'Royal Riverside — Identity System',
      desc: 'Thiết kế lockup, palette và guideline cho Royal Riverside, tối ưu triển khai đa nền tảng.'
    },
    en: {
      title: 'Royal Riverside — Identity System',
      desc: 'Lockup, palette, and guidelines tailored for smooth multi-platform deployment.'
    }
  },
  aurora: {
    vi: {
      title: 'Aurora Garden — Brochure Luxe',
      desc: 'Brochure cao cấp với chất liệu metallic, bố cục sang trọng và hệ icon đồng bộ.'
    },
    en: {
      title: 'Aurora Garden — Luxe Brochure',
      desc: 'Premium brochure featuring metallic finishes, luxurious layout, and cohesive iconography.'
    }
  },
  metro: {
    vi: {
      title: 'Metro Skyline — Sales Kit',
      desc: 'Sales kit đa kênh cho Metro Skyline: profile, deck và key visual cho đội ngũ kinh doanh.'
    },
    en: {
      title: 'Metro Skyline — Sales Kit',
      desc: 'Omni-channel sales kit: profile, deck, and key visuals tailored for the sales team.'
    }
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
let projectAutoTimer = null;

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeProjectFilter = btn.dataset.filter || 'all';
    projectPage = 0;
    renderProjectPage();
    startProjectAuto();
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

const stopProjectAuto = () => {
  if (projectAutoTimer) {
    clearInterval(projectAutoTimer);
    projectAutoTimer = null;
  }
};

const startProjectAuto = () => {
  stopProjectAuto();
  const totalPages = Math.max(1, Math.ceil(getFilteredCards().length / cardsPerPage));
  if (totalPages <= 1) return;
  projectAutoTimer = window.setInterval(() => {
    const pages = Math.max(1, Math.ceil(getFilteredCards().length / cardsPerPage));
    if (pages <= 1) return;
    projectPage = (projectPage + 1) % pages;
    renderProjectPage();
  }, 6000);
};

projectPrev?.addEventListener('click', () => {
  if (projectPage === 0) return;
  projectPage -= 1;
  renderProjectPage();
  startProjectAuto();
});

projectNext?.addEventListener('click', () => {
  const totalPages = Math.max(1, Math.ceil(getFilteredCards().length / cardsPerPage));
  if (projectPage >= totalPages - 1) return;
  projectPage += 1;
  renderProjectPage();
  startProjectAuto();
});

renderProjectPage();
startProjectAuto();

projectGrid?.addEventListener('mouseenter', stopProjectAuto);
projectGrid?.addEventListener('mouseleave', startProjectAuto);

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
  const localizedData = projectCases[caseId]?.[currentLang] || projectCases[caseId]?.vi || {};
  const card = trigger.closest('.project-card');
  const cardTitle = card?.querySelector('h3')?.textContent?.trim();
  const cardTags = card?.querySelector('.p-tags')?.textContent?.trim();
  const coverImg = card?.querySelector('img');

  modalTitle.textContent = localizedData.title || cardTitle || translate('projects.modal.title');
  modalDesc.textContent =
    localizedData.desc || cardTags || translate('projects.modal.desc');
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
  const isControl = (el) => el?.closest?.('.slider-prev, .slider-next');

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
    if (slides.length < 2 || isControl(event.target)) return;
    pointerStart = event.clientX;
    sliderEl.setPointerCapture?.(event.pointerId);
    stopAuto();
  });

  sliderEl.addEventListener('pointerup', (event) => {
    if (isControl(event.target)) return;
    if (pointerStart === null) return;
    const delta = event.clientX - pointerStart;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prevSlide() : nextSlide();
    }
    pointerStart = null;
    sliderEl.releasePointerCapture?.(event.pointerId);
    startAuto();
  });
  sliderEl.addEventListener('pointercancel', (event) => {
    if (isControl(event.target)) return;
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
        .then(() => alert(translate('contact.form.copySuccess', { email })))
        .catch(() => window.prompt(translate('contact.form.copyManual'), email));
    } else {
      window.prompt(translate('contact.form.copyManual'), email);
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
      formStatus.textContent = translate('contact.form.status.sending');
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
      if (formStatus) formStatus.textContent = translate('contact.form.status.success');
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = translate('contact.form.status.error');
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

// Case image lightbox
const caseGrids = document.querySelectorAll('.case-page .case-grid');
if (caseGrids.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'case-lightbox';
  lightbox.innerHTML = `
    <div class="case-lightbox__backdrop" data-close="true"></div>
    <div class="case-lightbox__dialog">
      <button class="case-lightbox__nav case-lightbox__nav--prev" data-nav="prev">&#8249;</button>
      <button class="case-lightbox__nav case-lightbox__nav--next" data-nav="next">&#8250;</button>
      <button class="case-lightbox__close" data-close="true">&times;</button>
      <img alt="" />
      <p class="case-lightbox__caption"></p>
    </div>`;
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.case-lightbox__caption');
  const navPrev = lightbox.querySelector('[data-nav="prev"]');
  const navNext = lightbox.querySelector('[data-nav="next"]');
  let currentList = [];
  let currentIndex = 0;
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.classList.remove('modal-open');
  };
  lightbox.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'true') {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    } else if (event.key === 'ArrowRight' && currentList.length) {
      currentIndex = (currentIndex + 1) % currentList.length;
      updateLightbox();
    } else if (event.key === 'ArrowLeft' && currentList.length) {
      currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
      updateLightbox();
    }
  });
  const updateLightbox = () => {
    const target = currentList[currentIndex];
    if (!target) return;
    lightboxImg.src = target.src;
    lightboxImg.alt = target.alt || '';
    lightboxCaption.textContent = target.alt || 'Hình ảnh triển khai';
  };
  navPrev?.addEventListener('click', () => {
    if (!currentList.length) return;
    currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    updateLightbox();
  });
  navNext?.addEventListener('click', () => {
    if (!currentList.length) return;
    currentIndex = (currentIndex + 1) % currentList.length;
    updateLightbox();
  });
  caseGrids.forEach((grid) => {
    const imgs = [...grid.querySelectorAll('img')];
    imgs.forEach((img, idx) => {
      img.addEventListener('click', () => {
        currentList = imgs;
        currentIndex = idx;
        updateLightbox();
        lightbox.classList.add('open');
        document.body.classList.add('modal-open');
      });
    });
  });
}
