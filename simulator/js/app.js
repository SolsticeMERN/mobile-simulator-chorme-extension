/**
 * Mobile Responsive Simulator - Main Studio Application Controller
 */

class SimulatorApp {
  constructor() {
    this.currentMode = 'single'; // 'single' | 'multi'
    this.deviceModalMode = 'select'; // 'select' | 'multi-add'
    this.selectedCategory = 'all';
    this.selectedBrand = 'all';
    this.searchQuery = '';
    this.theme = 'light';
    this.recentUrls = [];
    this.studioBackground = 'transparent';
    this.studioShadow = 'subtle';
  }

  async init() {
    // 1. Parse URL Query Parameters
    const params = new URLSearchParams(window.location.search);
    const initialUrl = params.get('url') || 'https://example.com';
    const initialDeviceId = params.get('device') || 'iphone-16-pro';
    const initialMode = params.get('mode') || 'single';

    // 2. Initialize Core Modules
    const workspaceEl = document.getElementById('workspace');
    const singleContainerEl = document.getElementById('single-container');
    const multiContainerEl = document.getElementById('multi-container');

    window.simulatorCore.init({
      workspaceEl,
      singleContainerEl,
      multiContainerEl,
      initialUrl,
      initialDeviceId
    });

    window.multiDeviceManager.init(multiContainerEl, window.simulatorCore);
    window.customDeviceUI.init(
      document.getElementById('custom-device-modal'),
      document.getElementById('custom-device-form')
    );

    if (window.webcamManager) {
      window.webcamManager.init();
    }

    // 3. Populate URL Bar
    const urlInput = document.getElementById('url-input');
    urlInput.value = window.simulatorCore.currentUrl;

    // 4. Initialize Global Hover Tooltips FIRST
    this.initTooltips();

    // 5. Initialize Recent URLs
    this.initRecentUrls();

    // 6. Bind UI Controls
    this.bindTopBarEvents();
    this.bindDevToolsEvents();
    this.bindStudioExportEvents();
    this.bindShortcutsEvents();
    this.bindModalEvents();
    this.bindKeyboardShortcuts();

    // 7. Restore Theme Preference (Default Light Mode)
    this.initTheme();

    // 7. Render Initial View
    if (initialMode === 'multi') {
      this.switchMode('multi');
    } else {
      this.switchMode('single');
    }

    this.updateDevicePickerLabel();
  }

  initTheme() {
    chrome.storage?.local?.get(['theme'], (res) => {
      if (res && res.theme) {
        this.setTheme(res.theme);
      } else {
        this.setTheme('light');
      }
    });
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      if (theme === 'dark') {
        // Sun SVG
        themeBtn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
        themeBtn.setAttribute('data-tooltip-title', 'Switch to Light Mode');
      } else {
        // Moon SVG
        themeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        themeBtn.setAttribute('data-tooltip-title', 'Switch to Dark Mode');
      }
    }
    chrome.storage?.local?.set({ theme });
  }

  bindTopBarEvents() {
    const urlInput = document.getElementById('url-input');
    const btnGo = document.getElementById('btn-go');
    const btnReload = document.getElementById('btn-reload');
    const btnOpenExternal = document.getElementById('btn-open-external-tab');
    const btnDevicePicker = document.getElementById('btn-device-picker');
    const btnRotate = document.getElementById('btn-rotate-all');
    const btnMockup = document.getElementById('btn-toggle-mockup');
    const zoomSelect = document.getElementById('zoom-select');
    const btnModeSingle = document.getElementById('btn-mode-single');
    const btnModeMulti = document.getElementById('btn-mode-multi');
    const btnScreenshot = document.getElementById('btn-export-screenshot');
    const btnRecord = document.getElementById('btn-record-video');
    const btnQrCode = document.getElementById('btn-qr-code');
    const btnCustomDevice = document.getElementById('btn-add-custom-device');
    const btnTheme = document.getElementById('btn-toggle-theme');
    const btnReturnDesktop = document.getElementById('btn-return-desktop');

    if (btnReturnDesktop) {
      btnReturnDesktop.addEventListener('click', () => {
        window.location.href = window.simulatorCore.currentUrl;
      });
    }

    // URL Navigation
    const handleNavigate = () => {
      const url = urlInput.value.trim();
      if (url) {
        window.simulatorCore.setUrl(url);
        urlInput.value = window.simulatorCore.currentUrl;
        this.saveRecentUrl(window.simulatorCore.currentUrl);
      }
    };

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleNavigate();
    });
    btnGo.addEventListener('click', handleNavigate);

    // Localhost Dev Presets Dropdown
    const btnLocalhost = document.getElementById('btn-localhost-presets');
    const menuLocalhost = document.getElementById('localhost-presets-menu');
    if (btnLocalhost && menuLocalhost) {
      btnLocalhost.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menuLocalhost.style.display !== 'none';
        this.closeAllPopovers();
        if (!isOpen) menuLocalhost.style.display = 'flex';
      });

      menuLocalhost.querySelectorAll('.url-popover-item').forEach(item => {
        item.addEventListener('click', () => {
          const port = item.dataset.port;
          const targetUrl = `http://localhost:${port}`;
          urlInput.value = targetUrl;
          handleNavigate();
          menuLocalhost.style.display = 'none';
        });
      });
    }

    // Recent URL History Dropdown
    const btnUrlHistory = document.getElementById('btn-url-history');
    const menuUrlHistory = document.getElementById('url-history-menu');
    const btnClearHistory = document.getElementById('btn-clear-url-history');
    if (btnUrlHistory && menuUrlHistory) {
      btnUrlHistory.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menuUrlHistory.style.display !== 'none';
        this.closeAllPopovers();
        if (!isOpen) {
          this.renderRecentUrls();
          menuUrlHistory.style.display = 'flex';
        }
      });
    }

    if (btnClearHistory) {
      btnClearHistory.addEventListener('click', (e) => {
        e.stopPropagation();
        this.recentUrls = [];
        chrome.storage?.local?.set({ recentUrls: [] });
        this.renderRecentUrls();
        this.showToast('URL history cleared');
      });
    }

    // DevTools Dropdown Trigger
    const btnDevtools = document.getElementById('btn-devtools-menu');
    const menuDevtools = document.getElementById('devtools-menu-dropdown');
    if (btnDevtools && menuDevtools) {
      btnDevtools.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.hideTooltip) this.hideTooltip();
        const isOpen = menuDevtools.style.display !== 'none';
        this.closeAllPopovers();
        if (!isOpen) menuDevtools.style.display = 'flex';
      });
    }

    // Shortcuts Trigger
    const btnShortcuts = document.getElementById('btn-open-shortcuts');
    if (btnShortcuts) {
      btnShortcuts.addEventListener('click', () => {
        this.openShortcutsModal();
      });
    }

    // Close popovers on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.url-dropdown-wrapper') && !e.target.closest('.devtools-dropdown-wrapper')) {
        this.closeAllPopovers();
      }
    });

    btnReload.addEventListener('click', () => {
      window.simulatorCore.reload();
      this.showToast('Page reloaded');
    });

    btnOpenExternal.addEventListener('click', () => {
      window.open(window.simulatorCore.currentUrl, '_blank');
    });

    // Device Picker Modal
    btnDevicePicker.addEventListener('click', () => {
      this.openDeviceCatalogModal(false);
    });

    // Orientation Rotate
    btnRotate.addEventListener('click', () => {
      const orientation = window.simulatorCore.setOrientation();
      btnRotate.classList.toggle('active', orientation === 'landscape');
      this.showToast(`Switched to ${orientation} mode`);
    });

    // Mockup Frame Toggle
    btnMockup.addEventListener('click', () => {
      const show = window.simulatorCore.toggleMockup();
      btnMockup.classList.toggle('active', show);
      this.showToast(show ? 'Hardware mockups enabled' : 'Clean frameless mode enabled');
    });

    // Touch Emulation Toggle
    const btnTouch = document.getElementById('btn-toggle-touch');
    if (btnTouch) {
      btnTouch.addEventListener('click', () => {
        window.simulatorCore.toggleTouchEmulation();
      });
    }

    // Zoom
    zoomSelect.addEventListener('change', (e) => {
      window.simulatorCore.setZoom(e.target.value);
    });

    // Single vs Multi View
    btnModeSingle.addEventListener('click', () => this.switchMode('single'));
    btnModeMulti.addEventListener('click', () => this.switchMode('multi'));

    // Multi-Device Layout Switcher (Grid, Row, Showcase Trio)
    const btnLayoutGrid = document.getElementById('btn-layout-grid');
    const btnLayoutRow = document.getElementById('btn-layout-row');
    const btnLayoutShowcase = document.getElementById('btn-layout-showcase');
    const btnSyncScroll = document.getElementById('btn-toggle-sync-scroll');

    if (btnLayoutGrid) {
      btnLayoutGrid.addEventListener('click', () => {
        window.multiDeviceManager.setLayout('grid');
        this.updateLayoutButtons('grid');
        this.showToast('Switched to Responsive Grid');
      });
    }
    if (btnLayoutRow) {
      btnLayoutRow.addEventListener('click', () => {
        window.multiDeviceManager.setLayout('row');
        this.updateLayoutButtons('row');
        this.showToast('Switched to Side-by-Side Row');
      });
    }
    if (btnLayoutShowcase) {
      btnLayoutShowcase.addEventListener('click', () => {
        window.multiDeviceManager.setLayout('showcase');
        this.updateLayoutButtons('showcase');
        this.showToast('Switched to Showcase Trio (Laptop + Tablet + Mobile)');
      });
    }
    if (btnSyncScroll) {
      btnSyncScroll.addEventListener('click', () => {
        window.multiDeviceManager.toggleSyncScroll();
      });
    }

    // Screenshot Export -> Open Studio Dialog
    btnScreenshot.addEventListener('click', () => {
      this.openStudioExportModal();
    });

    // Video Recording
    const recIndicator = document.getElementById('recording-indicator');
    const recTimer = document.getElementById('rec-timer');

    btnRecord.addEventListener('click', () => {
      if (window.mediaExportManager.isRecording) {
        window.mediaExportManager.stopRecording();
        btnRecord.classList.remove('active');
        btnRecord.title = 'Start Video Recording';
        recIndicator.classList.remove('active');
        this.showToast('Saving demo video...');
      } else {
        window.mediaExportManager.startRecording(
          (timeStr) => {
            recTimer.textContent = timeStr;
          },
          () => {
            btnRecord.classList.remove('active');
            recIndicator.classList.remove('active');
            this.showToast('Video recording saved!');
          },
          (err) => {
            btnRecord.classList.remove('active');
            recIndicator.classList.remove('active');
            this.showToast('Recording cancelled or not supported');
          }
        ).then(started => {
          if (started) {
            btnRecord.classList.add('active');
            btnRecord.title = 'Stop Recording';
            recIndicator.classList.add('active');
            this.showToast('Recording started! Interact with the simulator...');
          }
        });
      }
    });

    // Presenter Webcam (Loom-style bubble)
    const btnWebcam = document.getElementById('btn-toggle-webcam');
    if (btnWebcam) {
      btnWebcam.addEventListener('click', () => {
        if (window.webcamManager) {
          window.webcamManager.toggleWebcam();
        }
      });
    }

    // QR Code Modal
    btnQrCode.addEventListener('click', () => {
      this.openQrModal();
    });

    // Custom Device Modal
    btnCustomDevice.addEventListener('click', () => {
      window.customDeviceUI.open();
    });

    // Theme Toggle
    btnTheme.addEventListener('click', () => {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    });
  }

  closeAllPopovers() {
    if (this.hideTooltip) this.hideTooltip();
    const p1 = document.getElementById('localhost-presets-menu');
    const p2 = document.getElementById('url-history-menu');
    const p3 = document.getElementById('devtools-menu-dropdown');
    if (p1) p1.style.display = 'none';
    if (p2) p2.style.display = 'none';
    if (p3) p3.style.display = 'none';
  }

  initRecentUrls() {
    chrome.storage?.local?.get(['recentUrls'], (res) => {
      if (res && Array.isArray(res.recentUrls)) {
        this.recentUrls = res.recentUrls;
      }
    });
  }

  saveRecentUrl(url) {
    if (!url || url.startsWith('chrome://')) return;
    this.recentUrls = [url, ...this.recentUrls.filter(u => u !== url)].slice(0, 8);
    chrome.storage?.local?.set({ recentUrls: this.recentUrls });
  }

  renderRecentUrls() {
    const listEl = document.getElementById('url-history-list');
    if (!listEl) return;
    if (!this.recentUrls || this.recentUrls.length === 0) {
      listEl.innerHTML = '<div class="url-history-empty">No recent URLs yet</div>';
      return;
    }
    listEl.innerHTML = '';
    this.recentUrls.forEach(url => {
      const btn = document.createElement('button');
      btn.className = 'url-history-item';
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${url}</span>
      `;
      btn.addEventListener('click', () => {
        const urlInput = document.getElementById('url-input');
        if (urlInput) {
          urlInput.value = url;
          window.simulatorCore.setUrl(url);
          this.saveRecentUrl(url);
        }
        this.closeAllPopovers();
      });
      listEl.appendChild(btn);
    });
  }

  bindDevToolsEvents() {
    // 1. Breakpoint Rulers Toggle
    const btnRulers = document.getElementById('toggle-rulers-btn');
    if (btnRulers) {
      btnRulers.addEventListener('click', () => {
        const active = window.simulatorCore.toggleRulers();
        btnRulers.classList.toggle('active', active);
        const label = btnRulers.querySelector('.state-label');
        if (label) label.textContent = active ? 'On' : 'Off';
      });
    }

    // 2. 12-Column Grid Toggle
    const btnGrid = document.getElementById('toggle-grid-btn');
    if (btnGrid) {
      btnGrid.addEventListener('click', () => {
        const active = window.simulatorCore.toggleGrid();
        btnGrid.classList.toggle('active', active);
        const label = btnGrid.querySelector('.state-label');
        if (label) label.textContent = active ? 'On' : 'Off';
      });
    }

    // 3. A11y Filter Pills
    const a11yPills = document.querySelectorAll('#a11y-filter-pills .a11y-pill');
    a11yPills.forEach(pill => {
      pill.addEventListener('click', () => {
        a11yPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.dataset.filter;
        window.simulatorCore.setA11yFilter(filter);
      });
    });

    // 4. Network Speed Pills
    const netPills = document.querySelectorAll('#network-speed-pills .net-pill');
    netPills.forEach(pill => {
      pill.addEventListener('click', () => {
        netPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const speed = pill.dataset.speed;
        window.simulatorCore.setNetworkSpeed(speed);
      });
    });

    // 5. Comparison Bundles
    const bundleBtns = document.querySelectorAll('.bundle-preset-btn');
    bundleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const bundleKey = btn.dataset.bundle;
        if (this.currentMode !== 'multi') {
          this.switchMode('multi');
        }
        window.multiDeviceManager.applyComparisonBundle(bundleKey);
        this.closeAllPopovers();
      });
    });
  }

  bindStudioExportEvents() {
    const modal = document.getElementById('export-studio-modal');
    if (!modal) return;

    // Background Swatches
    const bgCards = modal.querySelectorAll('.studio-bg-card');
    bgCards.forEach(card => {
      card.addEventListener('click', () => {
        bgCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.studioBackground = card.dataset.bg || 'transparent';
      });
    });

    // Shadow Options
    const shadowBtns = modal.querySelectorAll('.studio-shadow-btn');
    shadowBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        shadowBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.studioShadow = btn.dataset.shadow || 'subtle';
      });
    });

    // Download Button
    const btnDownload = document.getElementById('btn-download-studio-shot');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        modal.classList.remove('open');
        this.executeScreenshotExport({
          background: this.studioBackground,
          shadow: this.studioShadow
        });
      });
    }

    // Cancel Button
    const btnCancel = document.getElementById('btn-cancel-studio');
    if (btnCancel) {
      btnCancel.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    modal.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => modal.classList.remove('open'));
    });
  }

  openStudioExportModal() {
    const modal = document.getElementById('export-studio-modal');
    if (modal) {
      modal.classList.add('open');
    }
  }

  executeScreenshotExport(studioOptions = {}) {
    const opts = {
      background: studioOptions.background || this.studioBackground || 'transparent',
      shadow: studioOptions.shadow || this.studioShadow || 'subtle'
    };

    if (this.currentMode === 'single') {
      const container = document.querySelector('#single-container .device-container');
      if (container) {
        window.mediaExportManager.exportScreenshot(container, !window.simulatorCore.showMockup, opts);
        this.showToast('Generating presentation mockup PNG...');
      }
    } else {
      const showcaseStage = document.querySelector('#multi-container .showcase-stage');
      if (showcaseStage && window.multiDeviceManager.layoutMode === 'showcase') {
        window.mediaExportManager.exportScreenshot(showcaseStage, false, opts);
        this.showToast('Generating Showcase Trio hero mockup PNG...');
      } else {
        const container = document.querySelector('#multi-container .device-container');
        if (container) {
          window.mediaExportManager.exportScreenshot(container, !window.simulatorCore.showMockup, opts);
          this.showToast('Generating multi-device screenshot...');
        }
      }
    }
  }

  bindShortcutsEvents() {
    const modal = document.getElementById('shortcuts-modal');
    if (!modal) return;
    modal.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    });
  }

  openShortcutsModal() {
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
      modal.classList.add('open');
    }
  }

  updateLayoutButtons(activeMode) {
    const btnLayoutGrid = document.getElementById('btn-layout-grid');
    const btnLayoutRow = document.getElementById('btn-layout-row');
    const btnLayoutShowcase = document.getElementById('btn-layout-showcase');
    if (btnLayoutGrid) btnLayoutGrid.classList.toggle('active', activeMode === 'grid');
    if (btnLayoutRow) btnLayoutRow.classList.toggle('active', activeMode === 'row');
    if (btnLayoutShowcase) btnLayoutShowcase.classList.toggle('active', activeMode === 'showcase');
    if (window.multiDeviceManager) window.multiDeviceManager.updateRowNavArrows();
  }

  switchMode(mode) {
    this.currentMode = mode;
    const btnSingle = document.getElementById('btn-mode-single');
    const btnMulti = document.getElementById('btn-mode-multi');
    const multiLayoutControls = document.getElementById('multi-layout-controls');

    if (mode === 'single') {
      document.body.classList.remove('mode-multi');
      document.body.classList.add('mode-single');
      btnSingle.classList.add('active');
      btnMulti.classList.remove('active');
      if (multiLayoutControls) multiLayoutControls.style.display = 'none';
      window.multiDeviceManager.hideJumpDock();
      window.simulatorCore.renderSingleDevice();
    } else {
      document.body.classList.remove('mode-single');
      document.body.classList.add('mode-multi');
      btnMulti.classList.add('active');
      btnSingle.classList.remove('active');
      if (multiLayoutControls) multiLayoutControls.style.display = 'inline-flex';
      this.updateLayoutButtons(window.multiDeviceManager.layoutMode);
      window.multiDeviceManager.renderMultiView();
    }
  }

  // ==================== GLOBAL FLOATING TOOLTIPS ====================
  initTooltips() {
    const tooltip = document.getElementById('simulator-tooltip');
    const titleEl = document.getElementById('tooltip-title-text');
    const descEl = document.getElementById('tooltip-desc-text');
    const shortcutEl = document.getElementById('tooltip-shortcut');
    if (!tooltip || !titleEl || !descEl) return;

    let activeTarget = null;

    const showTooltip = (target) => {
      activeTarget = target;
      const title = target.getAttribute('data-tooltip-title') || target.getAttribute('title');
      const desc = target.getAttribute('data-tooltip-desc') || '';
      const shortcut = target.getAttribute('data-tooltip-shortcut') || '';

      if (!title) return;

      titleEl.textContent = title;
      descEl.textContent = desc;
      descEl.style.display = desc ? 'block' : 'none';

      if (shortcut) {
        shortcutEl.textContent = shortcut;
        shortcutEl.style.display = 'inline-block';
      } else {
        shortcutEl.style.display = 'none';
      }

      const rect = target.getBoundingClientRect();
      const tooltipW = 230;
      let left = rect.left + rect.width / 2 - tooltipW / 2;
      let top = rect.bottom + 10;

      // Keep within screen horizontally
      if (left < 10) left = 10;
      if (left + tooltipW > window.innerWidth - 10) {
        left = window.innerWidth - tooltipW - 10;
      }

      // If near bottom of screen, show above button
      if (top + 80 > window.innerHeight) {
        top = Math.max(10, rect.top - 65);
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.classList.add('visible');
    };

    const hideTooltip = () => {
      activeTarget = null;
      tooltip.classList.remove('visible');
    };
    this.hideTooltip = hideTooltip;

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-tooltip-title], .device-action-btn, .icon-btn, .return-desktop-btn, .device-picker-btn, .zoom-select');
      if (target) {
        showTooltip(target);
      }
    }, true);

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-tooltip-title], .device-action-btn, .icon-btn, .return-desktop-btn, .device-picker-btn, .zoom-select');
      if (target && target === activeTarget) {
        hideTooltip();
      }
    }, true);
  }

  selectDevice(deviceId) {
    const device = window.devicesManager.getDeviceById(deviceId);
    if (!device) return;

    if (this.deviceModalMode === 'showcase-swap') {
      window.multiDeviceManager.swapShowcaseDevice(this.showcaseSwapSlot, deviceId);
    } else if (this.deviceModalMode === 'multi-swap') {
      window.multiDeviceManager.swapDevice(this.deviceToSwapId, deviceId);
      this.showToast(`Switched to ${device.name}`);
    } else if (this.deviceModalMode === 'multi-add') {
      window.multiDeviceManager.addDevice(deviceId);
      this.showToast(`Added ${device.name} to comparison`);
    } else {
      window.simulatorCore.setDevice(device);
      this.updateDevicePickerLabel();
      this.showToast(`Switched to ${device.name}`);
    }
    this.closeDeviceCatalogModal();
  }

  updateDevicePickerLabel() {
    const nameEl = document.getElementById('current-device-name');
    if (nameEl && window.simulatorCore.currentDevice) {
      nameEl.textContent = window.simulatorCore.currentDevice.name;
    }
  }

  // ==================== DEVICE CATALOG MODAL ====================
  openDeviceCatalogModal(isMultiAdd = false) {
    this.deviceModalMode = isMultiAdd ? 'multi-add' : 'select';
    const modal = document.getElementById('device-catalog-modal');
    modal.classList.add('open');

    const titleEl = modal.querySelector('.modal-title');
    titleEl.textContent = isMultiAdd ? 'Add Device to Comparison' : 'Select Simulation Device';

    this.renderCatalogList();
    const searchInput = document.getElementById('device-search-input');
    searchInput.value = '';
    searchInput.focus();

    setTimeout(() => {
      if (this.updateFilterTabsNav) {
        this.updateFilterTabsNav();
      }
    }, 50);
  }

  openDeviceCatalogModalForSwap(deviceId) {
    this.deviceModalMode = 'multi-swap';
    this.deviceToSwapId = deviceId;
    const modal = document.getElementById('device-catalog-modal');
    modal.classList.add('open');

    const titleEl = modal.querySelector('.modal-title');
    const oldDev = window.devicesManager.getDeviceById(deviceId);
    titleEl.textContent = oldDev ? `Switch Device (Replacing ${oldDev.name})` : 'Switch Device';

    this.renderCatalogList();
    const searchInput = document.getElementById('device-search-input');
    searchInput.value = '';
    searchInput.focus();

    setTimeout(() => {
      if (this.updateFilterTabsNav) {
        this.updateFilterTabsNav();
      }
    }, 50);
  }

  openShowcaseSwapModal(slotKey, categoryFilter) {
    this.deviceModalMode = 'showcase-swap';
    this.showcaseSwapSlot = slotKey;
    const modal = document.getElementById('device-catalog-modal');
    modal.classList.add('open');

    const titleEl = modal.querySelector('.modal-title');
    titleEl.textContent = `Choose ${slotKey.toUpperCase()} Device (${categoryFilter})`;

    // Filter to corresponding category tab
    const targetTab = document.querySelector(`.filter-tab-btn[data-category="${categoryFilter}"]`);
    if (targetTab) {
      document.querySelectorAll('.filter-tab-btn').forEach(t => t.classList.remove('active'));
      targetTab.classList.add('active');
      this.selectedCategory = categoryFilter;
      this.selectedBrand = 'all';
    } else {
      this.selectedCategory = 'all';
      this.selectedBrand = 'all';
    }

    this.searchQuery = '';
    this.renderCatalogList();
    const searchInput = document.getElementById('device-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }

    setTimeout(() => {
      if (this.updateFilterTabsNav) {
        this.updateFilterTabsNav();
      }
    }, 50);
  }

  closeDeviceCatalogModal() {
    const modal = document.getElementById('device-catalog-modal');
    modal.classList.remove('open');
  }

  renderCatalogList() {
    const grid = document.getElementById('device-catalog-grid');
    grid.innerHTML = '';

    const devices = window.devicesManager.filterDevices({
      category: this.selectedCategory,
      brand: this.selectedBrand,
      query: this.searchQuery
    });

    const activeId = window.simulatorCore.currentDevice?.id;

    devices.forEach(device => {
      const item = document.createElement('div');
      item.className = `device-catalog-item ${device.id === activeId ? 'active' : ''}`;
      item.innerHTML = `
        <div class="device-item-name">${device.name}</div>
        <div class="device-item-specs">
          <span>${device.width} × ${device.height} px</span>
          <span>${device.dpr}x DPR</span>
        </div>
        <div class="device-item-brand-tag">${device.brand} • ${device.year || ''}</div>
      `;
      item.addEventListener('click', () => {
        this.selectDevice(device.id);
      });
      grid.appendChild(item);
    });

    if (devices.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          No devices found matching "${this.searchQuery}".
        </div>
      `;
    }
  }

  bindModalEvents() {
    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('open');
        });
      }
    });

    // Device search input
    const searchInput = document.getElementById('device-search-input');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderCatalogList();
    });

    // Category filter tabs
    document.querySelectorAll('.filter-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.selectedCategory = tab.dataset.category || 'all';
        this.selectedBrand = tab.dataset.brand || 'all';
        this.renderCatalogList();
      });
    });

    // Smooth horizontal navigation & drag scrolling for filter tabs
    this.initFilterTabsScroller();
  }

  // ==================== FILTER TABS HORIZONTAL SCROLLER ====================
  initFilterTabsScroller() {
    const tabsWrapper = document.querySelector('.filter-tabs-wrapper');
    const tabsEl = document.getElementById('device-filter-tabs');
    const btnLeft = document.getElementById('tabs-scroll-left');
    const btnRight = document.getElementById('tabs-scroll-right');
    if (!tabsWrapper || !tabsEl || !btnLeft || !btnRight) return;

    const updateNav = () => {
      const scrollLeft = tabsEl.scrollLeft;
      const maxScroll = tabsEl.scrollWidth - tabsEl.clientWidth;
      const hasOverflow = maxScroll > 5;

      if (scrollLeft > 10) {
        btnLeft.classList.add('visible');
        tabsWrapper.classList.add('can-scroll-left');
      } else {
        btnLeft.classList.remove('visible');
        tabsWrapper.classList.remove('can-scroll-left');
      }

      if (hasOverflow && scrollLeft < maxScroll - 10) {
        btnRight.classList.add('visible');
        tabsWrapper.classList.add('can-scroll-right');
      } else {
        btnRight.classList.remove('visible');
        tabsWrapper.classList.remove('can-scroll-right');
      }
    };

    this.updateFilterTabsNav = updateNav;

    // Arrow button clicks
    btnLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      tabsEl.scrollBy({ left: -220, behavior: 'smooth' });
    });

    btnRight.addEventListener('click', (e) => {
      e.stopPropagation();
      tabsEl.scrollBy({ left: 220, behavior: 'smooth' });
    });

    // Scroll event
    tabsEl.addEventListener('scroll', updateNav, { passive: true });

    // Mouse wheel: convert vertical mouse wheel to horizontal scroll
    tabsEl.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        tabsEl.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    // Mouse drag-to-scroll (grab to pan)
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    tabsEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('.tabs-nav-btn')) return;
      isDown = true;
      hasMoved = false;
      tabsEl.classList.add('is-dragging');
      startX = e.pageX - tabsEl.offsetLeft;
      scrollLeft = tabsEl.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - tabsEl.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 4) {
        hasMoved = true;
      }
      tabsEl.scrollLeft = scrollLeft - walk;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        tabsEl.classList.remove('is-dragging');
      }
    });

    // Prevent click on pills if dragged
    tabsEl.addEventListener('click', (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Initial check
    setTimeout(updateNav, 100);
  }

  // ==================== QR CODE MODAL ====================
  openQrModal() {
    const modal = document.getElementById('qr-modal');
    const qrContainer = document.getElementById('qrcode-container');
    const qrUrlText = document.getElementById('qr-url-text');
    const url = window.simulatorCore.currentUrl;

    qrUrlText.textContent = url;
    modal.classList.add('open');

    // Generate QR Code
    new QRCode(qrContainer, {
      text: url,
      width: 220,
      height: 220,
      colorDark: '#0f172a',
      colorLight: '#ffffff'
    });
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignore keystrokes inside text inputs, textareas, or selects
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      // Escape closes modals and dropdown popovers
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
        this.closeAllPopovers();
        return;
      }

      // Hotkey ? : Open Shortcuts Cheat Sheet
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        this.openShortcutsModal();
        return;
      }

      // Don't intercept browser-native Ctrl/Meta shortcuts like Cmd+R (reload), Cmd+W (close tab)
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      const key = e.key.toLowerCase();

      // B: Breakpoint Rulers Toggle
      if (key === 'b') {
        e.preventDefault();
        const active = window.simulatorCore.toggleRulers();
        const btnRulers = document.getElementById('toggle-rulers-btn');
        if (btnRulers) {
          btnRulers.classList.toggle('active', active);
          const label = btnRulers.querySelector('.state-label');
          if (label) label.textContent = active ? 'On' : 'Off';
        }
      }

      // G: 12-Column Grid Toggle
      if (key === 'g') {
        e.preventDefault();
        const active = window.simulatorCore.toggleGrid();
        const btnGrid = document.getElementById('toggle-grid-btn');
        if (btnGrid) {
          btnGrid.classList.toggle('active', active);
          const label = btnGrid.querySelector('.state-label');
          if (label) label.textContent = active ? 'On' : 'Off';
        }
      }

      // R: Rotate Orientation
      if (key === 'r') {
        e.preventDefault();
        const orientation = window.simulatorCore.setOrientation();
        const btnRotate = document.getElementById('btn-rotate-all');
        if (btnRotate) btnRotate.classList.toggle('active', orientation === 'landscape');
        this.showToast(`Switched to ${orientation} mode`);
      }

      // M: Mockup Frame Toggle
      if (key === 'm') {
        e.preventDefault();
        const show = window.simulatorCore.toggleMockup();
        const btnMockup = document.getElementById('btn-toggle-mockup');
        if (btnMockup) btnMockup.classList.toggle('active', show);
        this.showToast(show ? 'Hardware mockups enabled' : 'Clean frameless mode enabled');
      }

      // T: Touch Emulation Toggle
      if (key === 't') {
        e.preventDefault();
        window.simulatorCore.toggleTouchEmulation();
      }

      // 1: Single Device Mode
      if (key === '1') {
        e.preventDefault();
        this.switchMode('single');
        this.showToast('Switched to Single Device Mode');
      }

      // 2: Multi-Device Mode
      if (key === '2') {
        e.preventDefault();
        this.switchMode('multi');
        this.showToast('Switched to Multi-Device Comparison');
      }

      // D: Device Catalog Modal
      if (key === 'd') {
        e.preventDefault();
        this.openDeviceCatalogModal(false);
      }

      // W: Webcam Bubble Toggle
      if (key === 'w') {
        e.preventDefault();
        if (window.webcamManager) {
          window.webcamManager.toggleWebcam();
        }
      }

      // S: Export Screenshot (Shift+S opens Studio Dialog, S does instant export)
      if (key === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          this.openStudioExportModal();
        } else {
          this.executeScreenshotExport();
        }
      }
    });
  }

  showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; color: var(--color-primary);"><polyline points="20 6 9 17 4 12"/></svg><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease-out';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }
}

window.app = new SimulatorApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
