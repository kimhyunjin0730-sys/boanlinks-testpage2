// State management
const state = {
  currentPath: window.location.pathname || '/',
  headerScrolled: false,
  mobileMenuOpen: false,
  familySitesOpen: false,
  contactForm: {
    company: '',
    department: '',
    scale: '',
    businessType: '',
    name: '',
    position: '',
    phone: '',
    email: '',
    message: '',
    privacyConsent: false
  },
  contactErrors: {},
  isSubmitting: false,
  isSubmitted: false,
  activeSolutionTab: 0
};

// Solutions data
const solutions = [
  {
    id: 'boanlinks',
    title: 'Boanlinks',
    subtitle: '기업 보안 점검 및 보안 제품 매칭 서비스',
    image: 'src/assets/sol-boanlinks.jpg',
    image2: 'src/assets/sol-boanlinks-2.jpg',
    overview: 'Boanlinks는 중소기업의 보안 점검부터 보안 제품 매칭까지 원스톱으로 제공하는 서비스입니다. 웹사이트, 웹어플리케이션, 시스템, 네트워크의 취약점을 종합적으로 점검하고 기업 환경에 맞는 최적의 보안 제품을 매칭해 드립니다.',
    features: [
      '웹사이트내의 악성코드 존재여부를 최신 점검코드 기반으로 점검해 드립니다.',
      '웹어플리케이션의 취약점을 OWASP TOP 10 기반으로 점검해 드립니다.',
      '시스템(PC)들의 취약점을 주요정보통신기반시설 가이드기반으로 점검해 드립니다.',
      '유무선 네트워크의 취약점을 주요정보통신기반시설 가이드기반으로 점검해 드립니다.',
      '기업 환경에 맞는 보안 제품을 매칭해 드립니다.'
    ]
  },
  {
    id: 'd-go',
    title: 'D-GO',
    subtitle: '데이터 종합 정리 · 디지털 금고',
    image: 'src/assets/sol-dgo.jpg',
    image2: 'src/assets/sol-dgo-2.jpg',
    overview: 'D-GO는 조직 내의 주요 파일을 한곳에 취합하여 안전하게 관리하는 디지털 금고 서비스입니다. 컴퓨터 활용 능력이 미숙한 대표자를 위해 시각적으로 보여주며, 랜섬웨어 및 해킹에 대한 방어를 제공합니다.',
    features: [
      '조직내의 주요 파일을 한곳에 취합하여 안전하게 관리합니다.',
      '컴퓨터 활용 능력이 미숙한 대표자를 위해 시각적으로 보여줍니다.',
      '주요 파일을 외부에 제출 시 관리자의 승인을 받을 수 있습니다.',
      '랜섬웨어 및 해킹에 대한 방어를 할 수 있습니다.',
      '기업정보 유출 방지 및 개인정보 유출을 방지 합니다.'
    ]
  },
  {
    id: 'ese',
    title: 'ESE',
    subtitle: '전사적 보안사고 예·측평가 시스템',
    image: 'src/assets/sol-ese.jpg',
    image2: 'src/assets/sol-ese-2.jpg',
    overview: 'ESE는 전사적 보안 위협을 사전에 \'예측\'하고 그 \'영향도\'를 정량적으로 평가하는 시스템입니다. 방화벽이나 백신이 아닌, 기업의 \'보안 건강 지수\'를 진단하고 처방합니다.',
    features: [
      '전사적 보안 위협을 사전에 \'예측\'하고 그 \'영향도\'를 정량적으로 평가합니다.',
      '방화벽이나 백신이 아닌, 기업의 \'보안 건강 지수\'를 진단하고 처방합니다.',
      '보고서 기반의 객관적인 보안 의사결정 지원 및 능동적 방어 체계 구축합니다.',
      '지능형 보안사고 프로파일링을 수행하여 보안사고를 예측합니다.'
    ]
  },
  {
    id: 'secuwifi',
    title: 'SECU WI-FI',
    subtitle: '동적인증기술기반 Wi-Fi 보안/ 마케팅솔루션',
    image: 'src/assets/sol-secuwifi.jpg',
    image2: 'src/assets/sol-secuwifi-2.jpg',
    overview: 'SECU WI-FI는 동적 인증 기술 기반의 Wi-Fi 보안 및 마케팅 솔루션입니다. 강력한 보안과 동적 인증을 수행하며, 접속 이력 분석 및 마케팅 채널로 활용할 수 있습니다.',
    features: [
      '강력한 보안 및 동적 인증을 수행합니다.',
      '접속 이력 분석 및 통계 관리를 수행합니다.',
      '마케팅 및 홍보 채널에 활용할 수 있습니다.',
      '사용자 편의성 및 타 기기 연결이 가능합니다.'
    ]
  },
  {
    id: 'secumom',
    title: 'SECUMOM',
    subtitle: '보안리스크관리플랫폼',
    image: 'src/assets/sol-secumom.jpg',
    image2: 'src/assets/sol-secumom-2.jpg',
    overview: 'SECUMOM은 기업의 보안 리스크를 종합적으로 관리하는 플랫폼입니다. 컴플라이언스 관리부터 취약점 통합 관리, 보안성 심의, 개인정보보호 관리까지 원스톱으로 제공합니다.',
    features: [
      '컴플라이언스 관리: ISMS-P 등 규제 항목 점검 및 증적 파일 통합 관리합니다.',
      '취약점 통합 관리: 인프라·웹·소스 취약점 점검 및 조치 현황 실시간 관리합니다.',
      '보안성 심의 지원: 단계별 가이드 제공으로 보안 위험 사전 검토 및 예방합니다.',
      '개인정보보호 관리: 개인정보 라이프사이클 관리 및 위수탁 업체 교육·감독합니다.',
      '보안정책 신청/승인: 정책 신청·결재 프로세스 일원화 및 정책 주입 자동화합니다.'
    ]
  }
];

// Navigation
function navigate(path) {
  state.currentPath = path;
  window.history.pushState({}, '', path);
  render();
  window.scrollTo(0, 0);
  if (state.mobileMenuOpen) {
    toggleMobileMenu();
  }
}

// Header scroll handler
function handleScroll() {
  const scrolled = window.scrollY > 20;
  if (scrolled !== state.headerScrolled) {
    state.headerScrolled = scrolled;
    updateHeader();
  }
}

function updateHeader() {
  const header = document.getElementById('header');
  const logo = document.getElementById('header-logo');
  const isHome = state.currentPath === '/';
  const showDark = state.headerScrolled || !isHome;

  if (showDark) {
    header.className = 'fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-2';
    logo.src = 'src/assets/logo-light.png';
    logo.classList.remove('brightness-200');
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('text-white/70', 'hover:text-white');
      link.classList.add('text-gray-600', 'hover:text-primary');
    });
    document.getElementById('mobile-menu-btn').classList.remove('text-white');
    document.getElementById('mobile-menu-btn').classList.add('text-gray-900');
  } else {
    header.className = 'fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-transparent py-4';
    logo.src = 'src/assets/logo.png';
    logo.classList.add('brightness-200');
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.add('text-white/70', 'hover:text-white');
      link.classList.remove('text-gray-600', 'hover:text-primary');
    });
    document.getElementById('mobile-menu-btn').classList.add('text-white');
    document.getElementById('mobile-menu-btn').classList.remove('text-gray-900');
  }
  updateActiveNav();
}

function updateActiveNav() {
  document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
    const path = link.getAttribute('data-path');
    if (path === state.currentPath) {
      link.classList.add('active', 'text-primary', 'font-semibold');
    } else {
      link.classList.remove('active', 'text-primary', 'font-semibold');
    }
  });
}

function toggleMobileMenu() {
  state.mobileMenuOpen = !state.mobileMenuOpen;
  const menu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  if (state.mobileMenuOpen) {
    menu.classList.add('show');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  } else {
    menu.classList.remove('show');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  }
}

function toggleFamilySites() {
  state.familySitesOpen = !state.familySitesOpen;
  const menu = document.getElementById('family-sites-menu');
  const btn = document.getElementById('family-sites-btn');
  const svg = btn.querySelector('svg');
  
  if (state.familySitesOpen) {
    menu.classList.remove('hidden');
    svg.classList.add('rotate-180');
  } else {
    menu.classList.add('hidden');
    svg.classList.remove('rotate-180');
  }
}

// Toast notification
function showToast(title, description) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="font-semibold text-foreground">${title}</div>
    <div class="text-sm text-muted-foreground mt-1">${description}</div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Contact form validation
function validateContactForm() {
  const errors = {};
  const form = state.contactForm;

  if (!form.company.trim()) errors.company = '업체명을 입력해주세요.';
  if (!form.name.trim()) errors.name = '이름을 입력해주세요.';
  if (!form.phone.trim()) errors.phone = '연락처를 입력해주세요.';
  if (!form.email.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = '유효한 이메일을 입력해주세요.';
  }
  if (!form.message.trim()) {
    errors.message = '문의내용을 입력해주세요.';
  } else if (form.message.trim().length > 1000) {
    errors.message = '1000자 이내로 입력해주세요.';
  }
  if (!form.privacyConsent) errors.privacyConsent = '개인정보 수집에 동의해주세요.';

  state.contactErrors = errors;
  return Object.keys(errors).length === 0;
}

async function handleContactSubmit() {
  if (!validateContactForm()) {
    renderContactForm();
    return;
  }

  state.isSubmitting = true;
  renderContactForm();
  
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  state.isSubmitting = false;
  state.isSubmitted = true;
  renderContactForm();
  
  showToast('문의가 접수되었습니다', '빠른 시일 내에 답변 드리겠습니다.');
  
  setTimeout(() => {
    state.isSubmitted = false;
    renderContactForm();
  }, 5000);
}

// Render functions
function render() {
  const app = document.getElementById('app');
  updateHeader();
  
  if (state.currentPath === '/') {
    app.innerHTML = renderHome();
  } else if (state.currentPath === '/solution') {
    app.innerHTML = renderSolution();
  } else if (state.currentPath === '/contact') {
    app.innerHTML = renderContact();
  } else {
    app.innerHTML = renderNotFound();
  }
  
  // Initialize animations and event listeners after render
  setTimeout(() => {
    initAnimations();
    initEventListeners();
  }, 0);
}

function renderHome() {
  return `
    <div class="min-h-screen bg-background">
      ${renderHeroSection()}
      ${renderIntroSection()}
      ${renderSolutionsSection()}
      ${renderCTASection()}
      ${renderContactSection()}
    </div>
  `;
}

function renderHeroSection() {
  return `
    <section id="hero" class="relative min-h-[90vh] flex items-center justify-center overflow-hidden section-dark">
      <div class="absolute inset-0">
        <img src="src/assets/hero-bg.jpg" alt="" class="w-full h-full object-cover opacity-25">
        <div class="absolute inset-0 bg-gradient-to-b from-[hsl(218,30%,14%)]/60 via-[hsl(218,30%,14%)]/40 to-[hsl(218,30%,14%)]"></div>
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(hsl(210 70% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 70% 50%) 1px, transparent 1px); background-size: 60px 60px;"></div>
      </div>
      <div class="relative z-10 container mx-auto px-4 text-center">
        <div class="flex flex-col items-center gap-8 fade-in-up">
          <div class="w-24 h-24 rounded-3xl bg-white/5 border border-white/15 flex items-center justify-center fade-in">
            <svg class="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div class="space-y-4">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              <span class="text-white">중소기업의 보안,</span><br>
              <span class="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Boanlinks</span>
              <span class="text-white">가</span><br class="sm:hidden">
              <span class="text-white"> 함께 합니다</span>
            </h1>
            <p class="text-blue-100/70 text-base md:text-xl max-w-lg mx-auto fade-in">
              최저의 비용으로 최고의 서비스를 약속드립니다.
            </p>
          </div>
          <button onclick="navigate('/contact')" class="flex items-center gap-2.5 px-10 py-4 rounded-xl bg-white text-[hsl(218,30%,14%)] font-bold text-sm transition-all hover:shadow-lg hover:shadow-white/10 hover:scale-105">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            제품 소개 받아보기
          </button>
        </div>
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 fade-in">
          <div class="bounce-animation">
            <svg class="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderIntroSection() {
  return `
    <section class="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-background to-secondary/30">
      <div class="relative container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center mb-16 fade-in-up">
          <div class="flex flex-col items-center gap-5">
            <div class="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/12 flex items-center justify-center">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h2 class="text-3xl md:text-4xl font-black text-foreground leading-snug">AI 보안링스의 솔루션</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              우리 회사는 중소기업의 보안 파트너로서, 컨설팅부터 솔루션까지 원스톱으로 제공합니다.<br class="hidden md:block">
              전문성과 신뢰를 기반으로, 기업의 소중한 데이터를 안전하게 보호합니다.
            </p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          <div class="text-center fade-in-up">
            <svg class="w-6 h-6 text-primary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-2xl md:text-3xl font-black text-foreground">500+</p>
            <p class="text-muted-foreground text-xs md:text-sm mt-1">보안 점검 수행</p>
          </div>
          <div class="text-center fade-in-up" style="animation-delay: 0.1s">
            <svg class="w-6 h-6 text-primary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-2xl md:text-3xl font-black text-foreground">99.7%</p>
            <p class="text-muted-foreground text-xs md:text-sm mt-1">취약점 탐지율</p>
          </div>
          <div class="text-center fade-in-up" style="animation-delay: 0.2s">
            <svg class="w-6 h-6 text-primary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <p class="text-2xl md:text-3xl font-black text-foreground">24/7</p>
            <p class="text-muted-foreground text-xs md:text-sm mt-1">실시간 모니터링</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSolutionsSection() {
  const solutionCards = solutions.map((sol, i) => {
    const isEven = i % 2 === 0;
    return `
      <div id="solution-${i}" class="glass-card glass-card-hover rounded-2xl overflow-hidden transition-all duration-500 group solution-card">
        <div class="flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} min-h-[360px]">
          <div class="lg:w-[45%] relative overflow-hidden">
            <img src="${sol.image}" alt="${sol.title}" class="w-full h-64 lg:h-full object-cover image-hover">
            <div class="absolute top-5 left-5 px-3 py-1.5 rounded-lg bg-primary/90 backdrop-blur-sm">
              <span class="text-primary-foreground font-bold text-xs tracking-wider">${sol.title}</span>
            </div>
          </div>
          <div class="flex-1 p-8 lg:p-10 flex flex-col justify-center">
            <h3 class="text-primary font-bold text-2xl mb-1">${sol.title}</h3>
            <h4 class="text-foreground font-bold text-lg md:text-xl mb-6">${sol.subtitle}</h4>
            <ul class="space-y-3 mb-6">
              ${sol.features.map(feature => `
                <li class="text-muted-foreground text-sm leading-relaxed flex items-start gap-3">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span>${feature}</span>
                </li>
              `).join('')}
            </ul>
            <button onclick="navigate('/solution#${sol.id}')" class="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-4 transition-all duration-300 w-fit">
              자세히보기
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section id="solutions" class="py-24 md:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 fade-in-up">
          <span class="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">Solutions</span>
          <h2 class="text-3xl md:text-4xl font-black text-foreground mb-4">중소기업을 위한 종합 보안 진단 및 맞춤형 서비스</h2>
          <p class="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Boanlinks는 중소기업이 필요로하는 보안에 대한 점검, 조치 및 향후 대응을 위한 보안제품 구매에 이르기까지 최소한의 비용으로 최적의 서비스를 제공합니다.
          </p>
        </div>
        <div class="glass-card rounded-2xl p-2 mb-12 flex flex-wrap justify-center gap-2 fade-in-up">
          ${solutions.map((sol, i) => `
            <button onclick="scrollToSolution(${i})" class="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
              ${sol.title}
            </button>
          `).join('')}
        </div>
        <div class="space-y-10">
          ${solutionCards}
        </div>
      </div>
    </section>
  `;
}

function scrollToSolution(index) {
  const el = document.getElementById(`solution-${index}`);
  if (el) {
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function renderCTASection() {
  return `
    <section class="py-24 md:py-32 bg-gradient-to-b from-background to-secondary/20">
      <div class="container mx-auto px-4">
        <div class="relative rounded-3xl overflow-hidden mb-20 section-dark fade-in-up">
          <div class="rounded-3xl p-12 md:p-20 text-center relative">
            <h2 class="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              우리회사의 보안상태<br>
              <span class="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">궁금하시나요?</span>
            </h2>
            <p class="text-blue-100/60 mb-10 text-base md:text-lg">
              복잡하고 어려운 보안, 이제 Boanlinks가 귀사와 함께 하겠습니다.
            </p>
            <button onclick="navigate('/contact')" class="px-12 py-5 rounded-xl bg-white text-[hsl(218,30%,14%)] font-black text-lg transition-all hover:shadow-lg hover:shadow-white/20 hover:scale-105">
              무료 점검 받기!
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-card glass-card-hover rounded-2xl p-7 text-center transition-all duration-500 group fade-in-up">
            <div class="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/12 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/12 transition-colors duration-300">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-foreground font-bold text-base mb-2">기업 보안 상태 검진</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">홈페이지내의 악성코드, 취약점 점검 및 시스템 점검</p>
          </div>
          <div class="glass-card glass-card-hover rounded-2xl p-7 text-center transition-all duration-500 group fade-in-up" style="animation-delay: 0.1s">
            <div class="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/12 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/12 transition-colors duration-300">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-foreground font-bold text-base mb-2">검진 결과 보고서 제공</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">KISA의 보안 점검 기준에 기반한 보고서 제공</p>
          </div>
          <div class="glass-card glass-card-hover rounded-2xl p-7 text-center transition-all duration-500 group fade-in-up" style="animation-delay: 0.2s">
            <div class="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/12 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/12 transition-colors duration-300">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
            <h3 class="text-foreground font-bold text-base mb-2">맞춤형 보안제품 매칭</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">보안 검진 결과에 따른 맞춤형 보안 제품 매칭</p>
          </div>
          <div class="glass-card glass-card-hover rounded-2xl p-7 text-center transition-all duration-500 group fade-in-up" style="animation-delay: 0.3s">
            <div class="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/12 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/12 transition-colors duration-300">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-foreground font-bold text-base mb-2">자가 조치</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">보안 취약점에 대한 조치 가이드 제공</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderContactSection() {
  return `
    <section id="contact" class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-black text-foreground mb-4">문의하기</h2>
          <p class="text-muted-foreground mb-8">제품 문의 및 견적이 필요하신가요? 언제든지 문의주세요!</p>
          <button onclick="navigate('/contact')" class="btn-primary inline-flex items-center gap-2">
            문의하기
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderSolution() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const idx = solutions.findIndex(s => s.id === hash);
    if (idx >= 0) state.activeSolutionTab = idx;
  }
  
  const sol = solutions[state.activeSolutionTab];
  
  return `
    <div class="min-h-screen bg-background">
      <section class="pt-28 pb-12 md:pt-36 md:pb-16 section-dark">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-3xl md:text-4xl font-black text-white mb-3 fade-in-up">AI 보안링스 솔루션</h1>
          <p class="text-blue-100/60 text-sm md:text-base fade-in-up">비즈니스의 안전을 위한 최첨단 보안 기술을 만나보세요.</p>
        </div>
      </section>
      <div class="bg-white border-b border-border sticky top-[52px] z-40">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center gap-1">
            ${solutions.map((s, i) => `
              <button onclick="setSolutionTab(${i})" class="px-6 py-3.5 text-sm font-semibold transition-all duration-300 border-b-2 ${
                state.activeSolutionTab === i
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }">
                ${s.title}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
      <div>
        <section class="py-20 md:py-28">
          <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto fade-in-up">
              <div class="flex-1 space-y-5">
                <span class="text-primary text-sm font-semibold tracking-widest uppercase">개요</span>
                <h3 class="text-foreground font-black text-2xl md:text-3xl leading-tight">${sol.title} · ${sol.subtitle}</h3>
                <p class="text-muted-foreground text-sm md:text-base leading-relaxed">${sol.overview}</p>
              </div>
              <div class="lg:w-[45%]">
                <div class="rounded-2xl overflow-hidden border border-border shadow-lg">
                  <img src="${sol.image}" alt="${sol.title}" class="w-full h-64 lg:h-80 object-cover">
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="py-20 md:py-28 section-alt">
          <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row-reverse items-center gap-12 max-w-6xl mx-auto fade-in-up">
              <div class="flex-1 space-y-6">
                <h2 class="text-foreground font-black text-2xl text-center lg:text-left">주요 기능</h2>
                <ul class="space-y-4">
                  ${sol.features.map(f => `
                    <li class="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                      <svg class="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
              <div class="lg:w-[45%]">
                <div class="rounded-2xl overflow-hidden border border-border shadow-lg">
                  <img src="${sol.image2}" alt="${sol.title} features" class="w-full h-64 lg:h-80 object-cover">
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="py-20 md:py-28">
          <div class="container mx-auto px-4">
            <div class="section-dark rounded-3xl p-10 md:p-16 text-center max-w-3xl mx-auto fade-in-up">
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="http://boanlinks.com" target="_blank" rel="noopener noreferrer" class="px-8 py-3.5 rounded-xl bg-white text-foreground font-bold text-sm hover:bg-white/90 transition-all inline-flex items-center gap-2">
                  서비스로 바로가기
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
                <a href="/contact" onclick="event.preventDefault(); navigate('/contact')" class="px-8 py-3.5 rounded-xl border border-white/20 text-white font-bold text-sm hover:border-white/40 transition-all inline-flex items-center gap-2">
                  도입문의 & 다운로드
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function setSolutionTab(index) {
  state.activeSolutionTab = index;
  render();
  window.scrollTo(0, 0);
}

function renderContact() {
  return renderContactForm();
}

function renderContactForm() {
  if (state.isSubmitted) {
    return `
      <div class="min-h-screen bg-background">
        <div class="section-dark pt-28 pb-16 md:pt-36 md:pb-20">
          <div class="container mx-auto px-4">
            <div class="max-w-3xl fade-in-up">
              <h1 class="text-3xl md:text-5xl font-black text-white mb-4">문의</h1>
              <p class="text-blue-100/60 text-sm md:text-base leading-relaxed">제품 문의 및 견적이 필요하신가요? 언제든지 문의주세요!</p>
            </div>
          </div>
        </div>
        <div class="py-16 md:py-24">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
              <div class="glass-card rounded-2xl p-16 text-center fade-in-up">
                <svg class="w-20 h-20 text-primary mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-foreground font-black text-2xl mb-2">감사합니다!</h3>
                <p class="text-muted-foreground">문의가 성공적으로 접수되었습니다.<br>빠른 시일 내에 답변 드리겠습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const form = state.contactForm;
  const errors = state.contactErrors;

  return `
    <div class="min-h-screen bg-background">
      <div class="section-dark pt-28 pb-16 md:pt-36 md:pb-20">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl fade-in-up">
            <h1 class="text-3xl md:text-5xl font-black text-white mb-4">문의</h1>
            <p class="text-blue-100/60 text-sm md:text-base leading-relaxed">제품 문의 및 견적이 필요하신가요? 언제든지 문의주세요!</p>
          </div>
        </div>
      </div>
      <div class="py-16 md:py-24">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="glass-card rounded-2xl p-8 md:p-12 fade-in-up">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="text-sm font-medium text-foreground mb-1.5 block">
                    업체명 (Company name) <span class="text-destructive">*</span>
                  </label>
                  <input type="text" id="company" value="${form.company}" placeholder="진엔현시큐리티" class="${errors.company ? 'error' : ''}">
                  ${errors.company ? `<p class="text-destructive text-xs mt-1 flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${errors.company}</p>` : ''}
                </div>
                <div>
                  <label class="text-sm font-medium text-foreground mb-1.5 block">소속/부서명 (Department name)</label>
                  <input type="text" id="department" value="${form.department}" placeholder="보안전략팀">
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="text-sm font-medium text-foreground mb-1.5 block">규모 (Scale)</label>
                  <select id="scale" class="${!form.scale ? 'text-muted-foreground/50' : ''}">
                    <option value="">선택 -</option>
                    <option value="1-10" ${form.scale === '1-10' ? 'selected' : ''}>1~10명</option>
                    <option value="11-50" ${form.scale === '11-50' ? 'selected' : ''}>11~50명</option>
                    <option value="51-100" ${form.scale === '51-100' ? 'selected' : ''}>51~100명</option>
                    <option value="101-500" ${form.scale === '101-500' ? 'selected' : ''}>101~500명</option>
                    <option value="500+" ${form.scale === '500+' ? 'selected' : ''}>500명 이상</option>
                  </select>
                </div>
                <div>
                  <label class="text-sm font-medium text-foreground mb-1.5 block">업종 (Type of business)</label>
                  <select id="businessType" class="${!form.businessType ? 'text-muted-foreground/50' : ''}">
                    <option value="">선택 -</option>
                    <option value="IT" ${form.businessType === 'IT' ? 'selected' : ''}>IT / 소프트웨어</option>
                    <option value="제조" ${form.businessType === '제조' ? 'selected' : ''}>제조업</option>
                    <option value="금융" ${form.businessType === '금융' ? 'selected' : ''}>금융 / 보험</option>
                    <option value="유통" ${form.businessType === '유통' ? 'selected' : ''}>유통 / 물류</option>
                    <option value="의료" ${form.businessType === '의료' ? 'selected' : ''}>의료 / 바이오</option>
                    <option value="교육" ${form.businessType === '교육' ? 'selected' : ''}>교육</option>
                    <option value="공공" ${form.businessType === '공공' ? 'selected' : ''}>공공 / 기관</option>
                    <option value="기타" ${form.businessType === '기타' ? 'selected' : ''}>기타</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="text-sm font-medium text-foreground mb-1.5 block">
                    담당자 성명 (Name) <span class="text-destructive">*</span>
                  </label>
                  <input type="text" id="name" value="${form.name}" placeholder="홍길동" class="${errors.name ? 'error' : ''}">
                  ${errors.name ? `<p class="text-destructive text-xs mt-1 flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${errors.name}</p>` : ''}
                </div>
                <div>
                  <label class="text-sm font-medium text-foreground mb-1.5 block">직위/직책 (Position)</label>
                  <input type="text" id="position" value="${form.position}" placeholder="과장">
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="text-sm font-medium text-foreground mb-1.5 block">
                    연락처 (Phone number) <span class="text-destructive">*</span>
                  </label>
                  <input type="tel" id="phone" value="${form.phone}" placeholder="010-1234-5678" class="${errors.phone ? 'error' : ''}">
                  ${errors.phone ? `<p class="text-destructive text-xs mt-1 flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${errors.phone}</p>` : ''}
                </div>
                <div>
                  <label class="text-sm font-medium text-foreground mb-1.5 block">
                    Email <span class="text-destructive">*</span>
                  </label>
                  <input type="email" id="email" value="${form.email}" placeholder="customer@company.com" class="${errors.email ? 'error' : ''}">
                  ${errors.email ? `<p class="text-destructive text-xs mt-1 flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${errors.email}</p>` : ''}
                </div>
              </div>
              <div class="mb-6">
                <label class="text-sm font-medium text-foreground mb-1.5 block">
                  문의내용 (Please enter your inquiry) <span class="text-destructive">*</span>
                </label>
                <textarea id="message" rows="5" placeholder="1000자 이내" class="${errors.message ? 'error' : ''} resize-none">${form.message}</textarea>
                <div class="flex justify-between mt-1">
                  ${errors.message ? `<p class="text-destructive text-xs flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${errors.message}</p>` : '<span></span>'}
                  <span class="text-muted-foreground text-xs">${form.message.length}/1000</span>
                </div>
              </div>
              <div class="mb-8 p-5 bg-background rounded-xl border border-border">
                <h4 class="text-sm font-semibold text-foreground mb-3">개인정보 수집 및 이용 동의 (Consent to Collect and Use Personal Information)</h4>
                <div class="text-xs text-muted-foreground leading-relaxed mb-4 max-h-24 overflow-y-auto p-3 bg-white rounded-lg border border-border">
                  '진엔현시큐리티'(이하 '회사')은 원시에 관한 이 이용자의 개인정보를 중요시하며, '정보통신망 이용촉진 및 정보보호'에 관한 법률을 준수하고 있습니다.
                  회사는 개인정보처리방침을 통하여 이용자의 개인정보를 어떠한 목적으로 수집·이용·보유하고, 어떤 방법으로 관리하는지 알려드립니다.
                </div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="privacyConsent" ${form.privacyConsent ? 'checked' : ''} class="w-4 h-4 rounded border-border text-primary focus:ring-primary">
                  <span class="text-sm text-foreground font-medium">■ 개인정보 수집 및 이용에 동의합니다.</span>
                </label>
                ${errors.privacyConsent ? `<p class="text-destructive text-xs mt-1 flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${errors.privacyConsent}</p>` : ''}
              </div>
              <div class="flex justify-end">
                <button onclick="handleContactSubmit()" ${state.isSubmitting ? 'disabled' : ''} class="btn-primary inline-flex items-center gap-2">
                  ${state.isSubmitting ? '<span class="spinner"></span>' : `
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    작성 완료
                  `}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section-dark py-16 md:py-24">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div class="space-y-6 fade-in-up">
              <h2 class="text-white font-black text-2xl mb-6">AI 보안링스</h2>
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-300 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div>
                    <span class="text-white/90 text-sm font-medium block">주 소</span>
                    <span class="text-blue-100/50 text-sm">경기 하남시 미사대로 540 현대지식산업센터 한강미사2차 비동 614호</span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-blue-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <div>
                    <span class="text-white/90 text-sm font-medium">TEL : </span>
                    <span class="text-blue-100/50 text-sm">1800-0705</span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-blue-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  <div>
                    <span class="text-white/90 text-sm font-medium">FAX : </span>
                    <span class="text-blue-100/50 text-sm">0504-185-0427</span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-blue-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <span class="text-white/90 text-sm font-medium">Email : </span>
                    <span class="text-blue-100/50 text-sm">biz@boanlinks.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="rounded-2xl overflow-hidden border border-white/10 h-[400px] lg:h-full min-h-[400px] fade-in-up">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3166.45!2d127.1986!3d37.5606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cb9a7b1!2z7ZiE64yA7KeA7Iud7IKw7JeF7IS87YSw!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr" width="100%" height="100%" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="오시는 길"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderNotFound() {
  return `
    <div class="flex flex-col min-h-screen bg-background">
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center fade-in-up">
          <h1 class="mb-4 text-4xl font-bold text-foreground">404</h1>
          <p class="mb-4 text-xl text-muted-foreground">페이지를 찾을 수 없습니다</p>
          <a href="/" onclick="event.preventDefault(); navigate('/')" class="text-primary underline hover:text-primary/90">홈으로 돌아가기</a>
        </div>
      </div>
    </div>
  `;
}

// Event listeners initialization
function initEventListeners() {
  // Contact form inputs
  if (state.currentPath === '/contact') {
    const inputs = ['company', 'department', 'scale', 'businessType', 'name', 'position', 'phone', 'email', 'message', 'privacyConsent'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          if (id === 'privacyConsent') {
            state.contactForm[id] = e.target.checked;
          } else {
            state.contactForm[id] = e.target.value;
          }
          if (state.contactErrors[id]) {
            delete state.contactErrors[id];
            renderContactForm();
          }
        });
      }
    });
  }
}

function initAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// Initialize
window.addEventListener('load', () => {
  state.currentPath = window.location.pathname || '/';
  render();
  updateHeader();
});

window.addEventListener('scroll', handleScroll);
window.addEventListener('popstate', () => {
  state.currentPath = window.location.pathname || '/';
  render();
});

// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);

// Family sites toggle
document.getElementById('family-sites-btn').addEventListener('click', toggleFamilySites);

// Close family sites menu when clicking outside
document.addEventListener('click', (e) => {
  const container = document.getElementById('family-sites-container');
  if (container && !container.contains(e.target) && state.familySitesOpen) {
    toggleFamilySites();
  }
});

// Make functions global
window.navigate = navigate;
window.scrollToSolution = scrollToSolution;
window.setSolutionTab = setSolutionTab;
window.handleContactSubmit = handleContactSubmit;