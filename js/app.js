document.addEventListener('DOMContentLoaded', () => {
  cleanupPreviewTags();
  initAppConfig();
  initTabNavigation();
  initLoginModeSwitcher();
  initLoginButtonWatcher();
  initSampleVoucherCodes();
  initDemoFormSimulation();
  initAudioPlayer();
  initFaqAccordion();
});

/**
 * Format Nomor WhatsApp ke Standar Internasional (62...)
 */
function formatWhatsAppNumber(phone) {
  if (!phone) return '';
  let clean = String(phone).replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  }
  return clean;
}

/**
 * Pembersih tag MikroTik mentah jika dibuka di peramban web biasa / Vercel
 */
function cleanupPreviewTags() {
  // Sembunyikan alert error jika $(error) belum diproses RouterOS
  const errorEl = document.querySelector('.alert-error');
  if (errorEl && (errorEl.textContent.includes('$(error)') || errorEl.textContent.trim() === '')) {
    errorEl.style.display = 'none';
  }

  // Bersihkan nilai input username jika masih berupa $(username) pada web preview non-RouterOS
  const inputUsername = document.getElementById('inputUsername');
  if (inputUsername && (inputUsername.value === '$(username)' || inputUsername.value.includes('$'))) {
    inputUsername.value = '';
  }

  // Bersihkan teks node $(if ...) atau $(endif) yang tersisa di body
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeValue) {
      if (node.nodeValue.includes('$(if') || node.nodeValue.includes('$(endif)')) {
        node.nodeValue = node.nodeValue.replace(/\$\(if[^\)]*\)/g, '').replace(/\$\(endif\)/g, '').trim();
      }
      if (node.nodeValue === '$(ip)') node.nodeValue = '192.168.88.10';
      if (node.nodeValue === '$(mac)') node.nodeValue = 'A4:C3:F0:88:12:34';
      if (node.nodeValue === '$(username)') node.nodeValue = '';
    }
  }

  // Fallback Navigasi Aman untuk Preview Web Non-RouterOS
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('$(')) {
      if (href.includes('$(link-login)')) a.href = 'login.html';
      else if (href.includes('$(link-status)')) a.href = 'status.html';
      else if (href.includes('$(link-logout)')) a.href = 'logout.html';
      else if (href.includes('$(link-login-only)')) a.href = '#';
    }
  });

  document.querySelectorAll('form').forEach(f => {
    const act = f.getAttribute('action');
    if (act && act.startsWith('$(')) {
      if (act.includes('$(link-logout)')) f.action = 'logout.html';
      else if (act.includes('$(link-login)')) f.action = 'status.html';
    }
  });
}

/**
 * 1. Inisialisasi Data dari config.js
 */
function initAppConfig() {
  if (typeof HOTSPOT_CONFIG === 'undefined') return;

  const cfg = HOTSPOT_CONFIG;
  const waNumber = formatWhatsAppNumber(cfg.brand.csWhatsApp);

  // Render Brand & Header Info
  const brandNameEl = document.getElementById('brandName');
  const brandTaglineEl = document.getElementById('brandTagline');
  const runningTextEl = document.getElementById('runningText');

  if (brandNameEl) brandNameEl.textContent = cfg.brand.name || 'HOTSPOT INTERNET';
  if (brandTaglineEl) brandTaglineEl.textContent = cfg.brand.tagline || 'Koneksi Cepat & Stabil';
  if (runningTextEl) runningTextEl.textContent = cfg.brand.runningText || '';

  // Render Paket Internet
  renderPackages(cfg.packages, waNumber, cfg.brand.name);

  // Render Outlet / Agen
  renderOutlets(cfg.outlets);

  // Render FAQ
  renderFaqs(cfg.faqs);

  // Set CS Links & Quick Actions
  const csWaBtn = document.getElementById('csWaBtn');
  const csTgBtn = document.getElementById('csTgBtn');
  const qaContactCs = document.getElementById('qaContactCs');

  if (waNumber) {
    const waText = encodeURIComponent(`Halo Admin ${cfg.brand.name}, saya butuh bantuan terkait koneksi Hotspot.`);
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
    if (csWaBtn) csWaBtn.href = waUrl;
    if (qaContactCs) {
      qaContactCs.href = waUrl;
      qaContactCs.target = '_blank';
    }
  } else if (qaContactCs) {
    qaContactCs.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('tab-help');
    });
  }

  if (csTgBtn && cfg.brand.csTelegram) {
    csTgBtn.href = `https://t.me/${cfg.brand.csTelegram}`;
  }

  // Setup Featured Promo WhatsApp Button
  const featuredPromoBtn = document.getElementById('featuredPromoBtn');
  if (featuredPromoBtn && cfg.packages && cfg.packages.length > 0) {
    const popularPkt = cfg.packages.find(p => p.popular) || cfg.packages[0];
    const waMsg = encodeURIComponent(`Halo Admin ${cfg.brand.name}, saya ingin pesan promo *${popularPkt.name}* (Harga: Rp ${Number(popularPkt.price).toLocaleString('id-ID')}). Mohon infonya ya.`);
    if (waNumber) {
      featuredPromoBtn.href = `https://wa.me/${waNumber}?text=${waMsg}`;
      featuredPromoBtn.target = '_blank';
    } else {
      featuredPromoBtn.href = '#';
      featuredPromoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('tab-packages');
      });
    }
  }

  // Setup Quick Action Button Click Listeners
  initQuickActions();
}

/**
 * Handler Tombol Pintas Cepat (Quick Actions) di Halaman Depan
 */
function initQuickActions() {
  const qaTarif = document.getElementById('qaCheckTarif');
  const qaOutlet = document.getElementById('qaFindOutlet');
  const qaScan = document.getElementById('qaScanQr');
  const btnScanQrInput = document.getElementById('btnScanQrInput');

  if (qaTarif) {
    qaTarif.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('tab-packages');
    });
  }

  if (qaOutlet) {
    qaOutlet.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('tab-outlets');
    });
  }

  const handleQrScan = (e) => {
    if (e) e.preventDefault();
    const inputUsername = document.getElementById('inputUsername');
    const scannedCode = prompt('📷 Scan Kamera / Masukkan Kode Barcode Voucher:');
    if (scannedCode && scannedCode.trim() !== '') {
      if (inputUsername) {
        inputUsername.value = scannedCode.trim();
        const inputPassword = document.getElementById('inputPassword');
        if (inputPassword) inputPassword.value = scannedCode.trim();
        inputUsername.focus();
        // Trigger event input agar tombol Masuk otomatis aktif
        inputUsername.dispatchEvent(new Event('input'));
      }
    }
  };

  if (qaScan) qaScan.addEventListener('click', handleQrScan);
  if (btnScanQrInput) btnScanQrInput.addEventListener('click', handleQrScan);
}

/**
 * Helper Fungsi Ganti Tab
 */
function switchTab(targetTabId) {
  if (!targetTabId) return;

  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navItems.forEach(nav => {
    if (nav.getAttribute('data-tab') === targetTabId) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });

  tabPanes.forEach(pane => {
    if (pane.id === targetTabId) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });

  const content = document.querySelector('.app-content');
  if (content) content.scrollTop = 0;
}

/**
 * 2. Render Daftar Paket Internet ke Tab Paket
 */
function renderPackages(packages, waNumber, brandName) {
  const container = document.getElementById('packageListContainer');
  if (!container || !packages) return;

  container.innerHTML = '';

  packages.forEach(pkt => {
    const card = document.createElement('div');
    card.className = `package-card ${pkt.popular ? 'popular' : ''}`;

    const formattedPrice = Number(pkt.price).toLocaleString('id-ID');
    const waMsg = encodeURIComponent(`Halo Admin ${brandName}, saya ingin pesan *${pkt.name}* (Harga: Rp ${formattedPrice}). Bagaimana cara pembayarannya?`);
    const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;

    card.innerHTML = `
      ${pkt.badge ? `<span class="package-badge">${pkt.badge}</span>` : ''}
      <div class="package-name">${pkt.name}</div>
      <div class="package-price">Rp ${formattedPrice} <span>/ ${pkt.duration}</span></div>
      <div class="package-details">
        <span class="detail-pill">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          ${pkt.speed}
        </span>
        <span class="detail-pill">
          <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
          ${pkt.quota}
        </span>
      </div>
      <a href="${waUrl}" target="_blank" class="btn-buy-wa">
        <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
        Pesan via WhatsApp
      </a>
    `;

    container.appendChild(card);
  });
}

/**
 * 3. Render Daftar Outlet / Lokasi Agen
 */
function renderOutlets(outlets) {
  const container = document.getElementById('outletListContainer');
  if (!container || !outlets) return;

  container.innerHTML = '';

  outlets.forEach(outlet => {
    const card = document.createElement('div');
    card.className = 'outlet-card';

    card.innerHTML = `
      <div class="outlet-icon">
        <svg viewBox="0 0 24 24"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>
      </div>
      <div class="outlet-body">
        <div class="outlet-title">
          ${outlet.name}
          <span class="outlet-status">${outlet.status}</span>
        </div>
        <div class="outlet-addr">${outlet.address}</div>
        <div class="outlet-time">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          ${outlet.hours}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * 4. Render Pertanyaan FAQ
 */
function renderFaqs(faqs) {
  const container = document.getElementById('faqListContainer');
  if (!container || !faqs) return;

  container.innerHTML = '';

  faqs.forEach(faq => {
    const item = document.createElement('div');
    item.className = 'faq-item';

    item.innerHTML = `
      <div class="faq-question">
        <span>${faq.q}</span>
        <svg viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
      </div>
      <div class="faq-answer">
        ${faq.a}
      </div>
    `;

    container.appendChild(item);
  });
}

/**
 * 5. Tab Navigation Handler (Bottom Bar)
 */
function initTabNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = item.getAttribute('data-tab');
      if (targetTabId) switchTab(targetTabId);
    });
  });
}

/**
 * 6. Voucher vs Member Mode Switcher
 */
function initLoginModeSwitcher() {
  const btnVoucher = document.getElementById('btnModeVoucher');
  const btnMember = document.getElementById('btnModeMember');
  const groupPassword = document.getElementById('groupPassword');
  const inputUsername = document.getElementById('inputUsername');
  const inputPassword = document.getElementById('inputPassword');
  const labelUsername = document.getElementById('labelUsername');
  const titleCardLogin = document.getElementById('titleCardLogin');
  const hintUsername = document.getElementById('hintUsername');
  const btnScanQrInput = document.getElementById('btnScanQrInput');

  if (!btnVoucher || !btnMember) return;

  btnVoucher.addEventListener('click', () => {
    btnVoucher.classList.add('active');
    btnMember.classList.remove('active');
    if (groupPassword) groupPassword.style.display = 'none';
    if (titleCardLogin) titleCardLogin.textContent = 'MASUKKAN KODE VOUCHER';
    if (labelUsername) labelUsername.innerHTML = '<span>KODE VOUCHER</span><span style="font-size: 0.68rem; color: var(--md-sys-color-primary); font-weight: 800;">* Wajib Diisi</span>';
    if (hintUsername) hintUsername.textContent = '💡 Ketik kode yang ada di struk / gesek kartu voucher Anda';
    if (btnScanQrInput) btnScanQrInput.style.display = 'flex';
    if (inputUsername) {
      inputUsername.placeholder = 'CONTOH: VCR8821';
      inputUsername.focus();
    }
  });

  btnMember.addEventListener('click', () => {
    btnMember.classList.add('active');
    btnVoucher.classList.remove('active');
    if (groupPassword) groupPassword.style.display = 'block';
    if (titleCardLogin) titleCardLogin.textContent = 'MASUKKAN AKUN MEMBER';
    if (labelUsername) labelUsername.innerHTML = '<span>USERNAME MEMBER</span><span style="font-size: 0.68rem; color: var(--md-sys-color-primary); font-weight: 800;">* Wajib Diisi</span>';
    if (hintUsername) hintUsername.textContent = '💡 Masukkan username langganan bulanan dari admin';
    if (btnScanQrInput) btnScanQrInput.style.display = 'none';
    if (inputUsername) {
      inputUsername.placeholder = 'Masukkan Username Member...';
      inputUsername.focus();
    }
  });

  // Auto copy username to password if in Voucher mode
  if (inputUsername && inputPassword) {
    inputUsername.addEventListener('input', () => {
      if (btnVoucher.classList.contains('active')) {
        inputPassword.value = inputUsername.value;
      }
    });
  }
}

/**
 * 7. FAQ Accordion Handler
 */
function initFaqAccordion() {
  const container = document.getElementById('faqListContainer');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const questionEl = e.target.closest('.faq-question');
    if (!questionEl) return;

    const item = questionEl.parentElement;
    const isActive = item.classList.contains('active');

    // Close all other items
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

    // Toggle current
    if (!isActive) {
      item.classList.add('active');
    }
  });
}

/**
 * 8. Dynamic Login Button Dimmed State Watcher
 * Redupkan tombol Masuk jika input voucher / member masih kosong
 */
function initLoginButtonWatcher() {
  const btnLogin = document.getElementById('btnLogin');
  const inputUsername = document.getElementById('inputUsername');
  const inputPassword = document.getElementById('inputPassword');
  const btnMember = document.getElementById('btnModeMember');
  const btnVoucher = document.getElementById('btnModeVoucher');

  if (!btnLogin || !inputUsername) return;

  function updateButtonState() {
    const isMember = btnMember && btnMember.classList.contains('active');
    const hasUsername = inputUsername.value.trim().length > 0;
    const hasPassword = inputPassword ? inputPassword.value.trim().length > 0 : true;

    if (isMember) {
      if (hasUsername && hasPassword) {
        btnLogin.classList.remove('btn-dimmed');
      } else {
        btnLogin.classList.add('btn-dimmed');
      }
    } else {
      if (hasUsername) {
        btnLogin.classList.remove('btn-dimmed');
      } else {
        btnLogin.classList.add('btn-dimmed');
      }
    }
  }

  inputUsername.addEventListener('input', updateButtonState);
  if (inputPassword) inputPassword.addEventListener('input', updateButtonState);

  if (btnVoucher) btnVoucher.addEventListener('click', () => setTimeout(updateButtonState, 50));
  if (btnMember) btnMember.addEventListener('click', () => setTimeout(updateButtonState, 50));

  // Initial check on page load
  updateButtonState();
}

/**
 * 9. Tombol Contoh / Pilihan Cepat Kode Voucher
 */
function initSampleVoucherCodes() {
  const sampleBtns = document.querySelectorAll('.btn-sample-code');
  const inputUsername = document.getElementById('inputUsername');
  const inputPassword = document.getElementById('inputPassword');
  const btnVoucher = document.getElementById('btnModeVoucher');

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = btn.getAttribute('data-code');
      if (code && inputUsername) {
        // Pastikan mode voucher aktif
        if (btnVoucher && !btnVoucher.classList.contains('active')) {
          btnVoucher.click();
        }
        inputUsername.value = code;
        if (inputPassword) inputPassword.value = code;
        inputUsername.focus();
        // Trigger event input agar tombol Masuk otomatis aktif
        inputUsername.dispatchEvent(new Event('input'));
      }
    });
  });
}

/**
 * 10. Form Login Simulation Handler (Demo / Web Preview)
 */
function initDemoFormSimulation() {
  const form = document.querySelector('form[name="sendin"]');
  const inputUsername = document.getElementById('inputUsername');

  if (!form || !inputUsername) return;

  form.addEventListener('submit', (e) => {
    const act = form.getAttribute('action') || '';
    // Jika berjalan di preview web non-MikroTik
    if (act.includes('$(') || act === '#' || location.hostname.includes('vercel.app') || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      e.preventDefault();
      const user = inputUsername.value.trim() || 'MALEO-GUEST';
      try {
        sessionStorage.setItem('hotspot_demo_user', user);
        sessionStorage.setItem('hotspot_login_time', Date.now().toString());
      } catch (err) {}
      window.location.href = `alogin.html?username=${encodeURIComponent(user)}`;
    }
  });
}

/**
 * 11. Audio Player Jingle Kemerdekaan (Hari Merdeka) Handler
 * Otomatis play saat klik/fokus di kolom voucher atau saat melakukan skrol halaman
 */
function initAudioPlayer() {
  const audio = document.getElementById('bgAudio');
  const btnToggle = document.getElementById('btnSoundToggle');
  if (!audio || !btnToggle) return;

  const iconOn = btnToggle.querySelector('.icon-sound-on');
  const iconOff = btnToggle.querySelector('.icon-sound-off');

  audio.loop = true;
  audio.volume = 1.0;
  let manualPaused = false; // Flag jika user sengaja menekan pause

  function updateUiState() {
    if (!audio.paused) {
      btnToggle.classList.add('playing');
      if (iconOn) iconOn.style.display = 'block';
      if (iconOff) iconOff.style.display = 'none';
    } else {
      btnToggle.classList.remove('playing');
      if (iconOn) iconOn.style.display = 'none';
      if (iconOff) iconOff.style.display = 'block';
    }
  }

  function playAudio() {
    if (manualPaused) return; // Hormati jika user memilih pause
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateUiState();
      }).catch(() => {
        // Browser membatasi autoplay sebelum ada aksi pengguna
      });
    }
  }

  function pauseAudio() {
    manualPaused = true;
    audio.pause();
    updateUiState();
  }

  // Tombol Toggle di Header (Bisa di-pause & di-play kapan saja)
  btnToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      manualPaused = false;
      audio.play().then(updateUiState).catch(() => {});
    } else {
      pauseAudio();
    }
  });

  // Sinkronisasi status audio
  audio.addEventListener('play', updateUiState);
  audio.addEventListener('pause', updateUiState);
  audio.addEventListener('playing', updateUiState);

  // Coba putar otomatis saat halaman dibuka jika diizinkan browser
  playAudio();

  // Pemicu Khusus: 1. Klik/Fokus di Kolom Voucher | 2. Skrol Halaman
  const inputUsername = document.getElementById('inputUsername');
  const inputPassword = document.getElementById('inputPassword');
  const loginCard = document.querySelector('.login-card');
  const appContent = document.querySelector('.app-content');

  const onUserActionTrigger = () => {
    if (audio.paused && !manualPaused) {
      playAudio();
    }
  };

  // 1. Pemicu saat kolom voucher diklik, disentuh, atau difokuskan
  if (inputUsername) {
    inputUsername.addEventListener('focus', onUserActionTrigger);
    inputUsername.addEventListener('click', onUserActionTrigger);
    inputUsername.addEventListener('touchstart', onUserActionTrigger, { passive: true });
    inputUsername.addEventListener('input', onUserActionTrigger);
  }
  if (inputPassword) {
    inputPassword.addEventListener('focus', onUserActionTrigger);
    inputPassword.addEventListener('click', onUserActionTrigger);
  }
  if (loginCard) {
    loginCard.addEventListener('click', onUserActionTrigger);
  }

  // 2. Pemicu saat pengguna melakukan skrol konten/halaman
  if (appContent) {
    appContent.addEventListener('scroll', onUserActionTrigger, { passive: true });
    appContent.addEventListener('touchmove', onUserActionTrigger, { passive: true });
    appContent.addEventListener('wheel', onUserActionTrigger, { passive: true });
  }
  window.addEventListener('scroll', onUserActionTrigger, { passive: true });
}
