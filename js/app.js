document.addEventListener('DOMContentLoaded', () => {
  cleanupPreviewTags();
  initAppConfig();
  initTabNavigation();
  initLoginModeSwitcher();
  initFaqAccordion();
});

/**
 * Pembersih tag MikroTik mentah jika dibuka di peramban web biasa / Vercel
 */
function cleanupPreviewTags() {
  // Sembunyikan alert error jika $(error) belum diproses RouterOS
  const errorEl = document.querySelector('.alert-error');
  if (errorEl && (errorEl.textContent.includes('$(error)') || errorEl.textContent.trim() === '')) {
    errorEl.style.display = 'none';
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
    }
  }
}

/**
 * 1. Inisialisasi Data dari config.js
 */
function initAppConfig() {
  if (typeof HOTSPOT_CONFIG === 'undefined') return;

  const cfg = HOTSPOT_CONFIG;

  // Render Brand & Header Info
  const brandNameEl = document.getElementById('brandName');
  const brandTaglineEl = document.getElementById('brandTagline');
  const runningTextEl = document.getElementById('runningText');

  if (brandNameEl) brandNameEl.textContent = cfg.brand.name || 'HOTSPOT INTERNET';
  if (brandTaglineEl) brandTaglineEl.textContent = cfg.brand.tagline || 'Koneksi Cepat & Stabil';
  if (runningTextEl) runningTextEl.textContent = cfg.brand.runningText || '';

  // Render Paket Internet
  renderPackages(cfg.packages, cfg.brand.csWhatsApp, cfg.brand.name);

  // Render Outlet / Agen
  renderOutlets(cfg.outlets);

  // Render FAQ
  renderFaqs(cfg.faqs);

  // Set CS Links
  const csWaBtn = document.getElementById('csWaBtn');
  const csTgBtn = document.getElementById('csTgBtn');

  if (csWaBtn && cfg.brand.csWhatsApp) {
    const waText = encodeURIComponent(`Halo Admin ${cfg.brand.name}, saya butuh bantuan terkait koneksi Hotspot.`);
    csWaBtn.href = `https://wa.me/${cfg.brand.csWhatsApp}?text=${waText}`;
  }

  if (csTgBtn && cfg.brand.csTelegram) {
    csTgBtn.href = `https://t.me/${cfg.brand.csTelegram}`;
  }
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
  const tabPanes = document.querySelectorAll('.tab-pane');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = item.getAttribute('data-tab');

      // Update Nav Items
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update Tab Panes
      tabPanes.forEach(pane => {
        if (pane.id === targetTabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Scroll top
      const content = document.querySelector('.app-content');
      if (content) content.scrollTop = 0;
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

  if (!btnVoucher || !btnMember) return;

  btnVoucher.addEventListener('click', () => {
    btnVoucher.classList.add('active');
    btnMember.classList.remove('active');
    if (groupPassword) groupPassword.style.display = 'none';
    if (labelUsername) labelUsername.textContent = 'Kode Voucher';
    if (inputUsername) {
      inputUsername.placeholder = 'Masukkan Kode Voucher...';
      inputUsername.focus();
    }
  });

  btnMember.addEventListener('click', () => {
    btnMember.classList.add('active');
    btnVoucher.classList.remove('active');
    if (groupPassword) groupPassword.style.display = 'block';
    if (labelUsername) labelUsername.textContent = 'Username';
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
