/**
 * NAMELENS AI - SPATIAL UI APPLICATION ENGINE 2026
 * Multi-language localization, SVG charting, Batch CSV processor, LocalStorage history & API client
 */

// Application State
const state = {
  currentView: 'home-view',
  currentLang: 'en',
  theme: 'dark',
  currentAnalysis: null,
  history: JSON.parse(localStorage.getItem('namelens_history') || '[]'),
  batchResults: [],
  explorerCatalog: []
};

// Multi-Language Localization Dictionary (UI Labels)
const translations = {
  en: {
    heroTitle: "Understand Every Name with AI.",
    heroSubtitle: "AI-powered name intelligence for predictions, meanings, origins, popularity and deeper name analytics.",
    btnAnalyze: "Analyze a Name",
    btnExplore: "Explore Features",
    navAnalyze: "Analyze",
    navBatch: "Batch Analysis",
    navExplorer: "Name Explorer",
    navCompare: "Compare",
    navAnalytics: "Analytics",
    navHistory: "History",
    navApi: "API",
    assocLabel: "Commonly associated with",
    disclaimer: "Predictions are statistical associations based on name data and should not be interpreted as a person's actual gender identity.",
    enterNamePlaceholder: "Enter a name (e.g. Adithya, Priya, Alex...)",
    btnPredict: "Analyze with AI",
    regionalTitle: "Regional Name Analysis",
    originTitle: "Name Origin",
    meaningTitle: "Meaning & History",
    popularityTitle: "Popularity Trends (2020 - 2026)",
    similarTitle: "You May Also Like",
    nicknamesTitle: "Nickname Generator",
    batchTitle: "Batch Name Analyzer",
    apiTitle: "Name Intelligence API",
    dashboardTitle: "Platform Dashboard & Analytics",
    historyTitle: "Your Analysis History"
  },
  ka: {
    heroTitle: "AI ಮೂಲಕ ಪ್ರತಿಯೊಂದು ಹೆಸರನ್ನೂ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    heroSubtitle: "ಮುನ್ಸೂಚನೆಗಳು, ಅರ್ಥಗಳು, ಮೂಲಗಳು ಮತ್ತು ಸವಿಸ್ತಾರ ಹೆಸರಿನ ವಿಶ್ಲೇಷಣೆಗಾಗಿ AI ಚಾಲಿತ ವೇದಿಕೆ.",
    btnAnalyze: "ಹೆಸರನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    btnExplore: "ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    navAnalyze: "ವಿಶ್ಲೇಷಿಸಿ",
    navBatch: "ಬ್ಯಾಚ್ ವಿಶ್ಲೇಷಣೆ",
    navExplorer: "ಹೆಸರಿನ ಅನ್ವೇಷಕ",
    navCompare: "ಹೋಲಿಕೆ",
    navAnalytics: "ವಿಶ್ಲೇಷಣೆ",
    navHistory: "ಇತಿಹಾಸ",
    navApi: "API",
    assocLabel: "ಸಾಮಾನ್ಯವಾಗಿ ಸಂಯೋಜಿತವಾಗಿದೆ",
    disclaimer: "ಮುನ್ಸೂಚನೆಗಳು ಸಾಂಖ್ಯಿಕ ಸಂಯೋಜನೆಗಳಾಗಿದ್ದು, ವ್ಯಕ್ತಿಯ ನೈಜ ಲಿಂಗ ಗುರುತಾಗಿ ವ್ಯಾಖ್ಯಾನಿಸಬಾರದು.",
    enterNamePlaceholder: "ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಉದಾ: Adithya, Priya, Alex...)",
    btnPredict: "AI ನೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿ",
    regionalTitle: "ಪ್ರಾದೇಶಿಕ ಹೆಸರಿನ ವಿಶ್ಲೇಷಣೆ",
    originTitle: "ಹೆಸರಿನ ಮೂಲ",
    meaningTitle: "ಅರ್ಥ ಮತ್ತು ಇತಿಹಾಸ",
    popularityTitle: "ಜನಪ್ರಿಯತೆಯ ಟ್ರೆಂಡ್‌ಗಳು (2020 - 2026)",
    similarTitle: "ನೀವು ಸಹ ಇಷ್ಟಪಡಬಹುದು",
    nicknamesTitle: "ಅಡ್ಡಹೆಸರು ಜನರೇಟರ್",
    batchTitle: "ಬ್ಯಾಚ್ ಹೆಸರು ವಿಶ್ಲೇಷಕ",
    apiTitle: "ಹೆಸರಿನ ಬುದ್ಧಿವಂತಿಕೆ API",
    dashboardTitle: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    historyTitle: "ನಿಮ್ಮ ವಿಶ್ಲೇಷಣೆಯ ಇತಿಹಾಸ"
  },
  hi: {
    heroTitle: "AI के साथ हर नाम को समझें।",
    heroSubtitle: "भविष्यवाणियों, अर्थों, उत्पत्ति और गहराई से नाम विश्लेषण के लिए AI संचालित प्लेटफ़ॉर्म।",
    btnAnalyze: "एक नाम का विश्लेषण करें",
    btnExplore: "सुविधाएं देखें",
    navAnalyze: "विश्लेषण करें",
    navBatch: "बैच विश्लेषण",
    navExplorer: "नाम एक्सप्लोरर",
    navCompare: "तुलना करें",
    navAnalytics: "एनालिटिक्स",
    navHistory: "इतिहास",
    navApi: "API",
    assocLabel: "सामान्य रूप से संबद्ध",
    disclaimer: "भविष्यवाणियां सांख्यिकीय जुड़ाव हैं और इन्हें किसी व्यक्ति की वास्तविक लैंगिक पहचान नहीं माना जाना चाहिए।",
    enterNamePlaceholder: "नाम दर्ज करें (जैसे Adithya, Priya, Alex...)",
    btnPredict: "AI से विश्लेषण करें",
    regionalTitle: "क्षेत्रीय नाम विश्लेषण",
    originTitle: "नाम की उत्पत्ति",
    meaningTitle: "अर्थ और इतिहास",
    popularityTitle: "लोकप्रियता रुझान (2020 - 2026)",
    similarTitle: "आपको यह भी पसंद आ सकता है",
    nicknamesTitle: "उपनाम जनरेटर",
    batchTitle: "बैच नाम विश्लेषक",
    apiTitle: "नेम इंटेलिजेंस API",
    dashboardTitle: "प्लेटफ़ॉर्म डैशबोर्ड",
    historyTitle: "आपका विश्लेषण इतिहास"
  },
  ta: {
    heroTitle: "AI மூலம் ஒவ்வொரு பெயரையும் புரிந்து கொள்ளுங்கள்.",
    heroSubtitle: "கணிப்புகள், அர்த்தங்கள், தோற்றம் மற்றும் ஆழமான பெயர் பகுப்பாய்வுக்கான AI தளம்.",
    btnAnalyze: "பெயரை பகுப்பாய்வு செய்",
    btnExplore: "அம்சங்களை ஆராய்க",
    navAnalyze: "பகுப்பாய்வு",
    navBatch: "தொகுதி பகுப்பாய்வு",
    navExplorer: "பெயர் உலாவி",
    navCompare: "ஒப்பிடு",
    navAnalytics: "பகுப்பாய்வு",
    navHistory: "வரலாறு",
    navApi: "API",
    assocLabel: "பொதுவாக தொடர்புடையது",
    disclaimer: "கணிப்புகள் புள்ளிவிவரத் தொடர்புகளே தவிர, ஒருவரின் உண்மையான பாலின அடையாளமாக எடுத்துக்கொள்ளக்கூடாது.",
    enterNamePlaceholder: "பெயரை உள்ளிடவும் (எ.கா. Adithya, Priya, Alex...)",
    btnPredict: "AI மூலம் பகுப்பாய்வு செய்",
    regionalTitle: "பிராந்திய பெயர் பகுப்பாய்வு",
    originTitle: "பெயர் தோற்றம்",
    meaningTitle: "பொருள் & வரலாறு",
    popularityTitle: "பிரபலமான போக்குகள் (2020 - 2026)",
    similarTitle: "நீங்களும் விரும்பலாம்",
    nicknamesTitle: "பட்டப்பெயர் உருவாக்கி",
    batchTitle: "தொகுதி பெயர் பகுப்பாய்வி",
    apiTitle: "பெயர் நுண்ணறிவு API",
    dashboardTitle: "தள டாஷ்போர்டு",
    historyTitle: "உங்கள் பகுப்பாய்வு வரலாறு"
  },
  te: {
    heroTitle: "AI తో ప్రతీ పేరునూ అర్థం చేసుకోండి.",
    heroSubtitle: "అంచనాలు, అర్థాలు, మూలాలు మరియు లోతైన పేరు విశ్లేషణ కోసం AI ఆధారిత ప్లాట్‌ఫారమ్.",
    btnAnalyze: "పేరును విశ్లేషించండి",
    btnExplore: "ఫీచర్లను అన్వేషించండి",
    navAnalyze: "విశ్లేషించండి",
    navBatch: "బ్యాచ్ విశ్లేషణ",
    navExplorer: "పేర్ల ఎక్స్‌ప్లోరర్",
    navCompare: "పోల్చండి",
    navAnalytics: "అనలిటిక్స్",
    navHistory: "చరిత్ర",
    navApi: "API",
    assocLabel: "సాధారణంగా అనుబంధించబడింది",
    disclaimer: "అంచనాలు రికార్డుల ఆధారంగా చేసిన గణాంక విశ్లేషణ మాత్రమే, నిజమైన లింగ గుర్తింపు కాదు.",
    enterNamePlaceholder: "పేరును నమోదు చేయండి (ఉదా: Adithya, Priya, Alex...)",
    btnPredict: "AI తో విశ్లేషించండి",
    regionalTitle: "ప్రాంతీయ పేరు విశ్లేషణ",
    originTitle: "పేరు మూలం",
    meaningTitle: "అర్థం & చరిత్ర",
    popularityTitle: "జనాదరణ ట్రెండ్‌లు (2020 - 2026)",
    similarTitle: "మీరు వీటిని కూడా ఇష్టపడవచ్చు",
    nicknamesTitle: "అమ్మోరు పేర్ల జనరేటర్",
    batchTitle: "బ్యాచ్ నేమ్ అనలైజర్",
    apiTitle: "నేమ్ ఇంటెలిజెన్స్ API",
    dashboardTitle: "ప్లాట్‌ఫారమ్ డాష్‌బోర్డ్",
    historyTitle: "మీ విశ్లేషణ చరిత్ర"
  },
  ml: {
    heroTitle: "AI ഉപയോഗിച്ച് ഓരോ പേരും മനസ്സിലാക്കൂ.",
    heroSubtitle: "പ്രവചനങ്ങൾ, അർത്ഥങ്ങൾ, ഉത്ഭവം, ആഴത്തിലുള്ള വിശകലനം എന്നിവയ്ക്കുള്ള AI പ്ലാറ്റ്ഫോം.",
    btnAnalyze: "പേര് വിശകലനം ചെയ്യുക",
    btnExplore: "ഫീച്ചറുകൾ കാണുക",
    navAnalyze: "വിശകലനം",
    navBatch: "ബാച്ച് വിശകലനം",
    navExplorer: "നെയിം എക്സ്പ്ലോറർ",
    navCompare: "താരതമ്യം ചെയ്യുക",
    navAnalytics: "അനലിറ്റിക്സ്",
    navHistory: "ചരിത്രം",
    navApi: "API",
    assocLabel: "സാധാരണയായി ബന്ധപ്പെട്ടിരിക്കുന്നത്",
    disclaimer: "പ്രവചനങ്ങൾ സ്ഥിതിവിവരക്കണക്കുകൾ മാത്രമാണ്, വ്യക്തിയുടെ യഥാർത്ഥ ലിംഗ വ്യക്തിത്വമല്ല.",
    enterNamePlaceholder: "പേര് നൽകുക (ഉദാ: Adithya, Priya, Alex...)",
    btnPredict: "AI ഉപയോഗിച്ച് വിശകലനം ചെയ്യുക",
    regionalTitle: "മേഖലാടിസ്ഥാനത്തിലുള്ള വിശകലനം",
    originTitle: "പേരിന്റെ ഉത്ഭവം",
    meaningTitle: "അർത്ഥവും ചരിത്രവും",
    popularityTitle: "ജനപ്രിയത ട്രെൻഡുകൾ (2020 - 2026)",
    similarTitle: "ഇതും നിങ്ങൾക്ക് ഇഷ്ടപ്പെടാം",
    nicknamesTitle: "വിളിച്ചുപേര് ജനറേറ്റർ",
    batchTitle: "ബാച്ച് നെയിം അനലൈസർ",
    apiTitle: "നെയിം ഇന്റലിജൻസ് API",
    dashboardTitle: "പ്ലാറ്റ്‌ഫോം ഡാഷ്‌ബോർഡ്",
    historyTitle: "നിങ്ങളുടെ വിശകലന ചരിത്രം"
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setup3DTilt();
  setupCanvasParticles();
  setupLanguageSelector();
  setupThemeToggle();
  setupInputValidation();
  setupBatchUploader();
  setupCompatibilityTool();
  setupApiConsole();
  setupExportSystem();

  // Load initial explorer dataset
  fetchExplorerCatalog();
  fetchDashboardStats();
});

// View Navigation & Router
function setupNavigation() {
  const navBtns = document.querySelectorAll('[data-view-target]');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view-target');
      switchView(targetView);
    });
  });
}

function switchView(viewId) {
  state.currentView = viewId;
  
  // Hide all views
  document.querySelectorAll('.spatial-view').forEach(v => v.classList.remove('active'));
  
  // Show target view
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
  }

  // Update active state in nav bars
  document.querySelectorAll('[data-view-target]').forEach(btn => {
    if (btn.getAttribute('data-view-target') === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Special triggers per view
  if (viewId === 'history-view') {
    renderHistoryTable();
  } else if (viewId === 'analytics-view') {
    fetchDashboardStats();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3D Spatial Tilt Hover Interaction
function setup3DTilt() {
  const cards = document.querySelectorAll('.tilt-enabled');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// Ambient Mesh Background Canvas
function setupCanvasParticles() {
  const canvas = document.getElementById('spatial-canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// Multi-language Selection
function setupLanguageSelector() {
  const select = document.getElementById('language-select');
  if (!select) return;

  select.addEventListener('change', (e) => {
    state.currentLang = e.target.value;
    applyLocalization();
  });
}

function applyLocalization() {
  const dict = translations[state.currentLang] || translations.en;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
        el.setAttribute('placeholder', dict[key]);
      } else {
        el.innerText = dict[key];
      }
    }
  });
}

// Theme Toggle (Dark Spatial / Light Spatial)
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', state.theme);
    toggleBtn.innerHTML = state.theme === 'dark' ? '🌙' : '☀️';
  });
}

// Input Validation & Single Name Prediction
function setupInputValidation() {
  const analyzeBtn = document.getElementById('btn-run-analysis');
  const nameInput = document.getElementById('analyzer-name-input');
  const countrySelect = document.getElementById('analyzer-country-select');
  const errorMsg = document.getElementById('analyzer-error-msg');
  const warningMsg = document.getElementById('analyzer-warning-msg');

  if (!analyzeBtn || !nameInput) return;

  const performAnalysis = () => {
    const rawName = nameInput.value.trim();
    const country = countrySelect ? countrySelect.value : 'Global';

    errorMsg.style.display = 'none';
    warningMsg.style.display = 'none';

    // Client validation
    if (!rawName) {
      errorMsg.innerText = "Please enter a valid name.";
      errorMsg.style.display = "flex";
      return;
    }

    if (/^\d+$/.test(rawName)) {
      errorMsg.innerText = "Please enter a valid name without numeric values.";
      errorMsg.style.display = "flex";
      return;
    }

    if (/^[!@#$%^&*()_+\-=\[\]{};:\'",.<>/?\\|]+$/.test(rawName)) {
      errorMsg.innerText = "Please enter a valid name containing letters.";
      errorMsg.style.display = "flex";
      return;
    }

    // Show loading
    document.getElementById('analyzer-loading').style.display = 'flex';
    document.getElementById('results-dashboard').style.display = 'none';

    fetch('/api/v1/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: rawName, country: country })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('analyzer-loading').style.display = 'none';
      if (!data.success) {
        errorMsg.innerText = data.error || "Analysis failed.";
        errorMsg.style.display = "flex";
        return;
      }

      state.currentAnalysis = data;
      renderPredictionResult(data);
      saveToHistory(data);

      if (data.warning) {
        warningMsg.innerText = data.warning;
        warningMsg.style.display = "flex";
      }

      // Smooth scroll to results
      document.getElementById('results-dashboard').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => {
      document.getElementById('analyzer-loading').style.display = 'none';
      errorMsg.innerText = "Network error. Please try again.";
      errorMsg.style.display = "flex";
    });
  };

  analyzeBtn.addEventListener('click', performAnalysis);
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performAnalysis();
  });
}

// Render Prediction Result Dashboard
function renderPredictionResult(data) {
  const dashboard = document.getElementById('results-dashboard');
  if (!dashboard) return;
  dashboard.style.display = 'block';

  const pred = data.prediction;
  const intel = data.intelligence;

  // Name & Gender Tag
  document.getElementById('res-name-title').innerText = data.query.name.toUpperCase();
  const pGender = pred.associated_gender.toLowerCase();
  const tagClass = pGender.includes('female') ? 'female' : pGender.includes('male') ? 'male' : 'neutral';
  genderTag.className = `result-gender-tag ${tagClass}`;
  genderTag.innerText = pred.associated_gender;

  // Confidence Score Circular Ring
  const confScoreEl = document.getElementById('res-confidence-score');
  const ringProgress = document.getElementById('res-ring-progress');
  confScoreEl.innerText = `${pred.confidence_score}%`;
  
  const circumference = 377;
  const offset = circumference - (pred.confidence_score / 100) * circumference;
  ringProgress.style.strokeDashoffset = offset;

  // Probability Bars
  const maleProb = pred.probability_distribution.Male || 0;
  const femaleProb = pred.probability_distribution.Female || 0;
  const unknownProb = pred.probability_distribution.Unknown || 0;

  document.getElementById('bar-fill-male').style.width = `${maleProb}%`;
  document.getElementById('val-male').innerText = `${maleProb}%`;

  document.getElementById('bar-fill-female').style.width = `${femaleProb}%`;
  document.getElementById('val-female').innerText = `${femaleProb}%`;

  document.getElementById('bar-fill-unknown').style.width = `${unknownProb}%`;
  document.getElementById('val-unknown').innerText = `${unknownProb}%`;

  // Disclaimer text
  document.getElementById('res-disclaimer-text').innerText = pred.disclaimer;

  // Regional Analysis List
  const countryList = document.getElementById('res-regional-list');
  countryList.innerHTML = '';
  const flags = { "India": "🇮🇳", "United States": "🇺🇸", "United Kingdom": "🇬🇧", "Canada": "🇨🇦", "Australia": "🇦🇺", "Global": "🌍" };
  
  Object.entries(intel.regional || {}).forEach(([cName, percentage]) => {
    const item = document.createElement('div');
    item.className = 'country-item';
    item.innerHTML = `
      <div class="country-info">
        <span class="country-flag">${flags[cName] || '🌐'}</span>
        <span>${cName}</span>
      </div>
      <div style="font-weight: 700; color: var(--accent-cyan); font-family: var(--font-mono);">${pred.associated_gender} — ${percentage}%</div>
    `;
    countryList.appendChild(item);
  });

  // Name Origin & Meaning Cards
  document.getElementById('res-origin-val').innerText = intel.origin;
  document.getElementById('res-region-val').innerText = intel.region;
  document.getElementById('res-language-val').innerText = intel.language;
  document.getElementById('res-meaning-text').innerText = intel.meaning;
  document.getElementById('res-history-text').innerText = intel.historical_context;

  // Render SVG Popularity Line Chart
  renderPopularityChart(intel.popularity);

  // Similar Names Carousel
  const similarContainer = document.getElementById('res-similar-carousel');
  similarContainer.innerHTML = '';
  (intel.similar || []).forEach(sim => {
    const card = document.createElement('div');
    card.className = 'similar-card';
    card.innerHTML = `
      <h5>${sim.name}</h5>
      <div class="similar-match">${sim.similarity}% match</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${sim.prediction} • ${sim.origin}</div>
    `;
    card.addEventListener('click', () => {
      document.getElementById('analyzer-name-input').value = sim.name;
      document.getElementById('btn-run-analysis').click();
    });
    similarContainer.appendChild(card);
  });

  // Nickname Chips
  const nicksContainer = document.getElementById('res-nicknames-list');
  nicksContainer.innerHTML = '';
  (intel.nicknames || []).forEach(nick => {
    const chip = document.createElement('span');
    chip.className = 'chip-nick';
    chip.innerHTML = `✨ ${nick} <span style="font-size:0.75rem; opacity:0.7;">📋</span>`;
    chip.title = "Click to copy";
    chip.addEventListener('click', () => {
      navigator.clipboard.writeText(nick);
      alert(`Copied "${nick}" to clipboard!`);
    });
    nicksContainer.appendChild(chip);
  });
}

// Render Interactive Popularity SVG Line Graph
function renderPopularityChart(dataPoints = [85, 88, 90, 92, 94, 96, 95]) {
  const container = document.getElementById('popularity-chart-box');
  if (!container) return;

  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const width = 600;
  const height = 200;
  const margin = 30;

  const maxVal = 100;
  const minVal = 0;

  const points = dataPoints.map((val, idx) => {
    const x = margin + (idx / (years.length - 1)) * (width - margin * 2);
    const y = height - margin - ((val - minVal) / (maxVal - minVal)) * (height - margin * 2);
    return { x, y, val, year: years[idx] };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }

  let svgHtml = `
    <svg class="popularity-svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--accent-cyan)"/>
          <stop offset="100%" stop-color="var(--accent-purple)"/>
        </linearGradient>
      </defs>
      <!-- Grid lines -->
      <line x1="${margin}" y1="${margin}" x2="${width - margin}" y2="${margin}" stroke="rgba(255,255,255,0.06)" />
      <line x1="${margin}" y1="${height/2}" x2="${width - margin}" y2="${height/2}" stroke="rgba(255,255,255,0.06)" />
      <line x1="${margin}" y1="${height - margin}" x2="${width - margin}" y2="${height - margin}" stroke="rgba(255,255,255,0.06)" />

      <!-- Polyline -->
      <path d="${pathD}" fill="none" stroke="url(#line-grad)" stroke-width="4.5" stroke-linecap="round"/>

      <!-- Points -->
      ${points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="6" fill="var(--bg-dark)" stroke="var(--accent-cyan)" stroke-width="3">
          <title>${p.year}: Rank Index ${p.val}</title>
        </circle>
        <text x="${p.x}" y="${height - 8}" font-size="10" fill="var(--text-muted)" text-anchor="middle">${p.year}</text>
      `).join('')}
    </svg>
  `;

  container.innerHTML = svgHtml;
}

// LocalStorage Search History Manager
function saveToHistory(item) {
  const record = {
    id: Date.now(),
    name: item.query.name,
    prediction: item.prediction.associated_gender,
    confidence: item.prediction.confidence_score,
    country: item.query.country,
    date: new Date().toLocaleDateString()
  };

  state.history.unshift(record);
  if (state.history.length > 50) state.history.pop();
  localStorage.setItem('namelens_history', JSON.stringify(state.history));
}

function renderHistoryTable() {
  const tbody = document.getElementById('history-tbody');
  if (!tbody) return;

  if (state.history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No search history recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.history.map(row => {
    const pGen = row.prediction.toLowerCase();
    const tagClass = pGen.includes('female') ? 'female' : 'male';
    return `
    <tr>
      <td style="font-weight: 700; color: var(--text-primary);">${row.name}</td>
      <td><span class="result-gender-tag ${tagClass}" style="padding: 0.15rem 0.6rem; font-size: 0.75rem;">${row.prediction}</span></td>
      <td style="font-family: var(--font-mono);">${row.confidence}%</td>
      <td>${row.country}</td>
      <td style="color: var(--text-muted); font-size: 0.8rem;">${row.date}</td>
      <td>
        <button class="icon-btn" onclick="reAnalyzeFromHistory('${row.name}')" title="Re-analyze">🔍</button>
      </td>
    </tr>
  `;
  }).join('');
}

window.reAnalyzeFromHistory = function(name) {
  switchView('analyze-view');
  document.getElementById('analyzer-name-input').value = name;
  document.getElementById('btn-run-analysis').click();
};

// Batch File Uploader & Parser
function setupBatchUploader() {
  const dropzone = document.getElementById('batch-dropzone');
  const fileInput = document.getElementById('batch-file-input');
  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleBatchFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleBatchFile(e.target.files[0]);
    }
  });

  // Sample CSV Download Trigger
  const sampleBtn = document.getElementById('btn-download-sample-csv');
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const sampleContent = "name,country\nAdithya,India\nRahul,India\nPriya,India\nAlex,United States\nJordan,United Kingdom\nSophia,Canada\n12345,Global";
      const blob = new Blob([sampleContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "namelens_sample_batch.csv";
      a.click();
    });
  }
}

function handleBatchFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const names = [];

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('name')) return; // Skip header
      const parts = line.split(',');
      if (parts[0]) {
        names.push({ name: parts[0].trim().replace(/"/g, ''), country: parts[1] ? parts[1].trim() : 'Global' });
      }
    });

    if (names.length === 0) {
      alert("No valid names found in CSV.");
      return;
    }

    // Call Batch API
    fetch('/api/v1/batch-predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names: names })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        state.batchResults = data.results;
        renderBatchResults(data);
      } else {
        alert(data.error || "Batch processing failed.");
      }
    });
  };

  reader.readAsText(file);
}

function renderBatchResults(data) {
  const summaryBox = document.getElementById('batch-summary-cards');
  const tbody = document.getElementById('batch-results-tbody');
  summaryBox.style.display = 'grid';

  document.getElementById('b-total').innerText = data.summary.total;
  document.getElementById('b-valid').innerText = data.summary.valid;
  document.getElementById('b-invalid').innerText = data.summary.invalid;
  document.getElementById('b-highconf').innerText = data.summary.high_confidence;

  tbody.innerHTML = data.results.map(r => {
    const pGen = r.prediction.toLowerCase();
    const tagClass = pGen.includes('female') ? 'female' : 'male';
    return `
    <tr>
      <td style="font-weight:700;">${r.name}</td>
      <td><span class="result-gender-tag ${tagClass}" style="padding: 0.15rem 0.5rem; font-size: 0.75rem;">${r.prediction}</span></td>
      <td style="font-family: var(--font-mono);">${r.confidence}%</td>
      <td>${r.country}</td>
      <td>${r.origin}</td>
      <td><span style="color: ${r.status === 'Valid' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; font-weight: 600;">${r.status}</span></td>
    </tr>
  `;
  }).join('');
}

// Name Compatibility Comparison Tool
function setupCompatibilityTool() {
  const btn = document.getElementById('btn-compare-names');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name1 = document.getElementById('compare-name-1').value.trim();
    const name2 = document.getElementById('compare-name-2').value.trim();

    if (!name1 || !name2) {
      alert("Please enter two names to compare.");
      return;
    }

    const simScore = Math.min(99, Math.max(60, 100 - Math.abs(name1.length - name2.length) * 8));
    const pronScore = Math.min(98, Math.max(55, 85 + (hashString(name1 + name2) % 15)));
    const styleScore = Math.min(99, Math.max(65, 80 + (hashString(name2) % 18)));

    document.getElementById('comp-results-box').style.display = 'block';
    document.getElementById('comp-val-sim').innerText = `${simScore}%`;
    document.getElementById('comp-val-pron').innerText = `${pronScore}%`;
    document.getElementById('comp-val-style').innerText = `${styleScore}%`;
  });
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// API Developer Portal Live Console
function setupApiConsole() {
  const testBtn = document.getElementById('btn-api-test-run');
  if (!testBtn) return;

  testBtn.addEventListener('click', () => {
    const inputName = document.getElementById('api-test-input').value.trim() || 'Adithya';
    const jsonOutput = document.getElementById('api-response-json');

    fetch('/api/v1/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inputName, country: 'India' })
    })
    .then(res => res.json())
    .then(data => {
      jsonOutput.innerText = JSON.stringify(data, null, 2);
    });
  });

  const copyBtn = document.getElementById('btn-copy-api-code');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = document.getElementById('api-response-json').innerText;
      navigator.clipboard.writeText(code);
      alert("API JSON response copied to clipboard!");
    });
  }
}

// Export System & PDF Report Preview Modal
function setupExportSystem() {
  const exportBtn = document.getElementById('btn-trigger-export');
  const modal = document.getElementById('export-modal');
  const closeBtn = document.getElementById('btn-close-export-modal');

  if (exportBtn && modal) {
    exportBtn.addEventListener('click', () => {
      if (!state.currentAnalysis) {
        alert("Please analyze a name first before exporting a report.");
        return;
      }
      populateExportPreview(state.currentAnalysis);
      modal.classList.add('active');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  const printBtn = document.getElementById('btn-print-report');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function populateExportPreview(data) {
  document.getElementById('exp-name').innerText = data.query.name.toUpperCase();
  document.getElementById('exp-prediction').innerText = data.prediction.associated_gender;
  document.getElementById('exp-confidence').innerText = `${data.prediction.confidence_score}%`;
  document.getElementById('exp-origin').innerText = data.intelligence.origin;
  document.getElementById('exp-meaning').innerText = data.intelligence.meaning;
  document.getElementById('exp-date').innerText = new Date().toLocaleDateString();
}

// Name Explorer Discovery Grid
function fetchExplorerCatalog() {
  fetch('/api/v1/explorer')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        state.explorerCatalog = data.catalog;
        renderExplorerGrid(data.catalog);
      }
    });
}

function renderExplorerGrid(items) {
  const grid = document.getElementById('explorer-grid');
  if (!grid) return;

  grid.innerHTML = items.map(item => `
    <div class="spatial-card" style="cursor: pointer;" onclick="reAnalyzeFromHistory('${item.name}')">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h4 style="font-size: 1.2rem; font-weight: 700;">${item.name}</h4>
        <span class="brand-badge">${item.category}</span>
      </div>
      <div style="font-size: 0.82rem; color: var(--accent-cyan); margin-top: 0.4rem; font-weight: 600;">
        ${item.prediction} (${item.confidence}%)
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">${item.meaning}</p>
    </div>
  `).join('');
}

// Executive Dashboard Analytics
function fetchDashboardStats() {
  fetch('/api/v1/stats')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const s = data.stats;
        if (document.getElementById('dash-searches')) document.getElementById('dash-searches').innerText = s.total_searches.toLocaleString();
        if (document.getElementById('dash-analyzed')) document.getElementById('dash-analyzed').innerText = s.names_analyzed.toLocaleString();
        if (document.getElementById('dash-confidence')) document.getElementById('dash-confidence').innerText = `${s.average_confidence}%`;
        if (document.getElementById('dash-countries')) document.getElementById('dash-countries').innerText = s.countries_covered;
      }
    });
}
