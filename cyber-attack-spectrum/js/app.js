/**
 * Main Application Orchestrator
 * Controls UI interactions, simulator events, spectrum rendering,
 * chart updates, modal dialogues, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.CYBER_SPECTRUM_DATA;
  const engine = new window.SoftComputingEngine();
  const charts = new window.CyberChartsDashboard();
  const particleNet = new window.CyberParticleNetwork('threatCanvas');

  // Initialize Modules
  initNavigation();
  initSpectrumCards(data.attackCategories);
  initSoftComputingTabs(data.softComputingParadigms);
  initSimulator(engine, data.presetScenarios);
  initBenchmarkControls(charts);
  initDatasetsSection(data.benchmarkDatasets);
  initFaqAccordion(data.faqList);
  initExportAndCitation();

  charts.init();

  // -------------------------------------------------------------
  // Navigation & Scroll Spy
  // -------------------------------------------------------------
  function initNavigation() {
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Scroll Spy
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset + 120;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });

    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
      });

      mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => mobileNav.classList.remove('open'));
      });
    }
  }

  // -------------------------------------------------------------
  // Attack Spectrum Grid & Filter
  // -------------------------------------------------------------
  function initSpectrumCards(categories) {
    const grid = document.getElementById('spectrumGrid');
    const filterBtns = document.querySelectorAll('.filter-pill');
    const searchInput = document.getElementById('spectrumSearch');

    function renderCards(filter = 'all', searchQuery = '') {
      grid.innerHTML = '';
      const filtered = categories.filter(item => {
        const matchesFilter = (filter === 'all') || 
          (filter === 'critical' && item.severity === 'CRITICAL') ||
          (filter === 'high' && item.severity === 'HIGH') ||
          (filter === 'l3l4' && item.layer.includes('L3') || item.layer.includes('L4')) ||
          (filter === 'l7' && item.layer.includes('L7') || item.layer.includes('Host'));

        const matchesSearch = !searchQuery || 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtypes.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>No attack categories match your search criteria.</p>
        </div>`;
        return;
      }

      filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'spectrum-card glass-panel';
        card.style.setProperty('--card-glow', item.severityColor);

        card.innerHTML = `
          <div class="card-header">
            <div class="icon-wrap" style="color: ${item.severityColor}">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <span class="severity-badge" style="background: ${item.severityColor}22; color: ${item.severityColor}; border-color: ${item.severityColor}">
              ${item.severity}
            </span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${item.name}</h3>
            <div class="band-tag">${item.band}</div>
            <p class="card-summary">${item.summary}</p>
            
            <div class="meta-row">
              <span><i class="fa-solid fa-layer-group"></i> ${item.layer}</span>
              <span><i class="fa-solid fa-eye-slash"></i> ${item.stealth}</span>
            </div>

            <div class="subtypes-list">
              ${item.subtypes.slice(0, 3).map(st => `<span class="subtype-chip">${st}</span>`).join('')}
              ${item.subtypes.length > 3 ? `<span class="subtype-chip chip-more">+${item.subtypes.length - 3} more</span>` : ''}
            </div>
          </div>
          <div class="card-footer">
            <div class="model-recommendation">
              <span class="rec-label">Optimal Soft Computing:</span>
              <span class="rec-model">${item.recommendedModel}</span>
            </div>
            <button class="btn-inspect" data-id="${item.id}">
              Inspect Anatomy <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        `;

        card.querySelector('.btn-inspect').addEventListener('click', () => {
          openAttackModal(item);
        });

        grid.appendChild(card);
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards(btn.dataset.filter, searchInput ? searchInput.value : '');
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-pill.active')?.dataset.filter || 'all';
        renderCards(activeFilter, e.target.value);
      });
    }

    renderCards();
  }

  // Attack Detail Modal
  function openAttackModal(item) {
    const modal = document.getElementById('attackModal');
    const modalBody = document.getElementById('attackModalBody');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-header-section">
        <div class="modal-title-wrap">
          <div class="modal-icon" style="color: ${item.severityColor}">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div>
            <h2>${item.name}</h2>
            <p class="modal-subtitle">${item.band} &bull; ${item.layer}</p>
          </div>
        </div>
        <span class="severity-badge" style="background: ${item.severityColor}22; color: ${item.severityColor}; border-color: ${item.severityColor}">
          ${item.severity} SEVERITY
        </span>
      </div>

      <div class="modal-content-grid">
        <div class="modal-col">
          <h4 class="modal-section-title"><i class="fa-solid fa-circle-info"></i> Threat Profile & Anatomy</h4>
          <p class="modal-text">${item.summary}</p>
          
          <h5 class="sub-heading">Attack Vectors & Subtypes</h5>
          <div class="modal-chips">
            ${item.subtypes.map(s => `<span class="subtype-chip">${s}</span>`).join('')}
          </div>

          <h5 class="sub-heading">Key Discriminative Telemetry Features</h5>
          <ul class="features-list">
            ${item.keyFeatures.map(f => `
              <li>
                <strong>${f.name}:</strong> 
                <span class="feat-val">${f.typical}</span> 
                <span class="feat-badge feat-${f.impact.toLowerCase()}">${f.impact} Impact</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="modal-col">
          <div class="soft-computing-box glass-panel">
            <h4 class="modal-section-title"><i class="fa-solid fa-microchip"></i> Soft Computing Strategy</h4>
            <p class="modal-text">${item.softComputingStrategy}</p>

            <div class="stat-highlight">
              <div>
                <span class="stat-num">${item.detectionConfidence}</span>
                <span class="stat-desc">Benchmark Detection Rate</span>
              </div>
              <div>
                <span class="stat-num" style="color: #00f0ff;">${item.recommendedModel}</span>
                <span class="stat-desc">Primary Classifier Model</span>
              </div>
            </div>

            <button class="btn-primary full-width" id="btnLoadToSimulator" data-id="${item.id}">
              <i class="fa-solid fa-play"></i> Simulate in Live Classifier
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    // Close button
    modal.querySelector('.modal-close-btn').onclick = () => modal.classList.remove('active');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

    // Simulator quick-load trigger
    const simBtn = modal.querySelector('#btnLoadToSimulator');
    if (simBtn) {
      simBtn.onclick = () => {
        modal.classList.remove('active');
        const scenario = data.presetScenarios.find(s => s.category === item.id) || data.presetScenarios[0];
        loadScenarioIntoSimulator(scenario);
        document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
      };
    }
  }

  // -------------------------------------------------------------
  // Soft Computing Paradigms Tabs
  // -------------------------------------------------------------
  function initSoftComputingTabs(paradigms) {
    const tabNav = document.getElementById('paradigmTabNav');
    const tabContent = document.getElementById('paradigmTabContent');
    if (!tabNav || !tabContent) return;

    tabNav.innerHTML = '';
    paradigms.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = `tab-btn ${idx === 0 ? 'active' : ''}`;
      btn.dataset.id = p.id;
      btn.innerHTML = `<i class="fa-solid ${p.icon}"></i> <span>${p.name.split('&')[0]}</span>`;
      btn.addEventListener('click', () => {
        tabNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderParadigmDetails(p);
      });
      tabNav.appendChild(btn);
    });

    function renderParadigmDetails(p) {
      tabContent.innerHTML = `
        <div class="paradigm-detail glass-panel animate-fade">
          <div class="paradigm-header">
            <div class="title-wrap">
              <span class="paradigm-badge">${p.badge}</span>
              <h3>${p.name}</h3>
            </div>
            <div class="paradigm-icon-large">
              <i class="fa-solid ${p.icon}"></i>
            </div>
          </div>

          <div class="formula-card">
            <div class="formula-tag">Mathematical Formulation</div>
            <div class="formula-latex"><code>${p.formula}</code></div>
          </div>

          <p class="paradigm-desc">${p.description}</p>

          <div class="paradigm-grid">
            <div class="paradigm-col">
              <h4><i class="fa-solid fa-circle-check text-green"></i> Key Research Advantages</h4>
              <ul class="custom-check-list">
                ${p.advantages.map(adv => `<li>${adv}</li>`).join('')}
              </ul>
            </div>
            <div class="paradigm-col">
              <h4><i class="fa-solid fa-bullseye text-cyan"></i> Role in Attack Spectrum Classification</h4>
              <div class="role-highlight-box">
                <p>${p.roleInSpectrum}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    renderParadigmDetails(paradigms[0]);
  }

  // -------------------------------------------------------------
  // Live Classifier Simulator Lab
  // -------------------------------------------------------------
  let currentParams = {
    packetRate: 94200,
    flowDuration: 0.02,
    synCount: 98,
    entropy: 1.2,
    failedLogins: 0,
    portRatio: 0.05
  };

  function initSimulator(engine, presets) {
    const presetContainer = document.getElementById('presetButtons');
    const pRateInput = document.getElementById('inputPacketRate');
    const durationInput = document.getElementById('inputFlowDuration');
    const synInput = document.getElementById('inputSynCount');
    const entropyInput = document.getElementById('inputEntropy');
    const loginsInput = document.getElementById('inputFailedLogins');
    const portInput = document.getElementById('inputPortRatio');

    // Populate preset buttons
    if (presetContainer) {
      presetContainer.innerHTML = '';
      presets.forEach((scenario, idx) => {
        const btn = document.createElement('button');
        btn.className = `preset-pill ${idx === 0 ? 'active' : ''}`;
        btn.innerHTML = `<i class="fa-solid fa-crosshairs"></i> ${scenario.title}`;
        btn.addEventListener('click', () => {
          presetContainer.querySelectorAll('.preset-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          loadScenarioIntoSimulator(scenario);
        });
        presetContainer.appendChild(btn);
      });
    }

    // Attach slider listeners
    const inputs = [
      { el: pRateInput, key: 'packetRate', label: 'valPacketRate', format: v => `${Number(v).toLocaleString()} pps` },
      { el: durationInput, key: 'flowDuration', label: 'valFlowDuration', format: v => `${v}s` },
      { el: synInput, key: 'synCount', label: 'valSynCount', format: v => `${v}%` },
      { el: entropyInput, key: 'entropy', label: 'valEntropy', format: v => `${v} bits` },
      { el: loginsInput, key: 'failedLogins', label: 'valFailedLogins', format: v => `${v} fails` },
      { el: portInput, key: 'portRatio', label: 'valPortRatio', format: v => `${v} ratio` }
    ];

    inputs.forEach(item => {
      if (item.el) {
        item.el.addEventListener('input', (e) => {
          currentParams[item.key] = parseFloat(e.target.value);
          const lbl = document.getElementById(item.label);
          if (lbl) lbl.textContent = item.format(e.target.value);
          runInference();
        });
      }
    });

    window.loadScenarioIntoSimulator = function(scenario) {
      currentParams = { ...scenario.params };
      if (pRateInput) pRateInput.value = currentParams.packetRate;
      if (durationInput) durationInput.value = currentParams.flowDuration;
      if (synInput) synInput.value = currentParams.synCount;
      if (entropyInput) entropyInput.value = currentParams.entropy;
      if (loginsInput) loginsInput.value = currentParams.failedLogins;
      if (portInput) portInput.value = currentParams.portRatio;

      inputs.forEach(item => {
        const lbl = document.getElementById(item.label);
        if (lbl) lbl.textContent = item.format(currentParams[item.key]);
      });

      const scenarioDesc = document.getElementById('scenarioDescBox');
      if (scenarioDesc) {
        scenarioDesc.innerHTML = `<i class="fa-solid fa-info-circle"></i> <strong>${scenario.title}:</strong> ${scenario.description}`;
      }

      runInference();
    };

    function runInference() {
      const result = engine.predict(currentParams);

      // Threat Score Meter
      const meterScore = document.getElementById('meterThreatScore');
      const meterFill = document.getElementById('meterFillBar');
      const meterBadge = document.getElementById('meterSeverityBadge');
      const verdictTitle = document.getElementById('verdictAttackName');
      const verdictConfidence = document.getElementById('verdictConfidence');
      const mitigationList = document.getElementById('mitigationStepsList');

      if (meterScore) meterScore.textContent = result.fuzzyThreatScore;
      if (meterFill) {
        meterFill.style.width = `${result.fuzzyThreatScore}%`;
        meterFill.style.backgroundColor = result.badgeColor;
      }
      if (meterBadge) {
        meterBadge.textContent = `${result.severityLevel} THREAT`;
        meterBadge.style.color = result.badgeColor;
        meterBadge.style.borderColor = result.badgeColor;
        meterBadge.style.backgroundColor = `${result.badgeColor}22`;
      }

      if (verdictTitle) verdictTitle.textContent = result.topClass.name;
      if (verdictConfidence) {
        verdictConfidence.textContent = `${result.topClass.probability}% Probability (${result.modelConfidence})`;
      }

      // Softmax Distribution Bars
      const probContainer = document.getElementById('neuralProbList');
      if (probContainer) {
        probContainer.innerHTML = result.neuralProbabilities.map(prob => `
          <div class="prob-row">
            <div class="prob-labels">
              <span>${prob.name}</span>
              <span class="font-mono">${prob.probability}%</span>
            </div>
            <div class="prob-bar-track">
              <div class="prob-bar-fill" style="width: ${prob.probability}%; background: ${prob.id === result.topClass.id ? result.badgeColor : '#3b82f6'};"></div>
            </div>
          </div>
        `).join('');
      }

      // Fired Fuzzy Rules
      const rulesContainer = document.getElementById('fuzzyFiredRulesList');
      if (rulesContainer) {
        rulesContainer.innerHTML = result.firedRules.map(r => `
          <div class="rule-chip ${r.strength > 0.3 ? 'rule-active' : ''}">
            <span class="rule-name">${r.name}</span>
            <span class="rule-strength font-mono">μ=${r.strength.toFixed(2)}</span>
          </div>
        `).join('');
      }

      // Mitigation steps
      if (mitigationList) {
        mitigationList.innerHTML = result.recommendations.map(step => `
          <li><i class="fa-solid fa-shield-check text-cyan"></i> ${step}</li>
        `).join('');
      }

      // Update Live Fuzzy Curve active needle
      charts.renderFuzzyMembershipCurves(currentParams.packetRate);
    }

    // Run initial inference
    loadScenarioIntoSimulator(presets[0]);
  }

  // -------------------------------------------------------------
  // Benchmark Controls
  // -------------------------------------------------------------
  function initBenchmarkControls(charts) {
    const metricBtns = document.querySelectorAll('.metric-toggle-btn');
    metricBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        metricBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        charts.renderModelBenchmark(btn.dataset.metric);
      });
    });
  }

  // -------------------------------------------------------------
  // Datasets Section
  // -------------------------------------------------------------
  function initDatasetsSection(datasets) {
    const container = document.getElementById('datasetCardsContainer');
    if (!container) return;

    container.innerHTML = datasets.map(d => `
      <div class="dataset-card glass-panel">
        <div class="dataset-header">
          <h4>${d.name}</h4>
          <span class="dataset-year">${d.year}</span>
        </div>
        <div class="dataset-metrics">
          <div class="ds-metric-item">
            <span class="ds-val">${d.records}</span>
            <span class="ds-lbl">Dataset Size</span>
          </div>
          <div class="ds-metric-item">
            <span class="ds-val text-cyan">${d.features}</span>
            <span class="ds-lbl">Feature Dimensions</span>
          </div>
          <div class="ds-metric-item">
            <span class="ds-val text-green">${d.ourModelAccuracy}</span>
            <span class="ds-lbl">ANFIS-GA Accuracy</span>
          </div>
        </div>
        <p class="ds-desc">${d.significance}</p>
        <div class="ds-classes">
          <strong>Classes Covered:</strong> <span>${d.classes}</span>
        </div>
      </div>
    `).join('');
  }

  // -------------------------------------------------------------
  // FAQ Accordion
  // -------------------------------------------------------------
  function initFaqAccordion(faqs) {
    const container = document.getElementById('faqAccordion');
    if (!container) return;

    container.innerHTML = faqs.map((faq, idx) => `
      <div class="faq-item glass-panel ${idx === 0 ? 'active' : ''}">
        <button class="faq-question">
          <span>${faq.q}</span>
          <i class="fa-solid fa-chevron-down faq-arrow"></i>
        </button>
        <div class="faq-answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        item.classList.toggle('active');
      });
    });
  }

  // -------------------------------------------------------------
  // Export & Citation
  // -------------------------------------------------------------
  function initExportAndCitation() {
    const copyBibBtn = document.getElementById('btnCopyBibtex');
    const downloadPdfBtn = document.getElementById('btnDownloadSummary');

    if (copyBibBtn) {
      copyBibBtn.addEventListener('click', () => {
        const bibtex = `@article{CyberAttackSpectrumSoftComputing2026,
  title={Classifying Cyber Attack Spectrum Using Soft Computing Paradigms},
  author={Research & Engineering Project Group},
  journal={IEEE Transactions on Dependable and Secure Computing},
  year={2026},
  volume={23},
  pages={1120--1135},
  publisher={IEEE}
}`;
        navigator.clipboard.writeText(bibtex).then(() => {
          showToast('BibTeX citation copied to clipboard!');
        });
      });
    }

    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  function showToast(msg) {
    let toast = document.getElementById('cyberToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cyberToast';
      toast.className = 'cyber-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
  }
});
