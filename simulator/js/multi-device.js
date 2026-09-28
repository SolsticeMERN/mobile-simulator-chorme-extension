/**
 * Mobile Responsive Simulator - Multi-Device Comparison Manager
 * Displays multiple devices with shared navigation, synchronized scrolling,
 * smooth canvas grab-to-pan, grid/row layouts, and a quick-jump device dock.
 */

class MultiDeviceManager {
  constructor() {
    this.activeDeviceIds = ['iphone-16-pro', 'samsung-s24-ultra', 'ipad-pro-11', 'macbook-air-13'];
    this.showcaseDevices = {
      laptop: 'macbook-air-13',
      tablet: 'ipad-pro-11',
      mobile: 'iphone-16-pro'
    };
    this.showcaseStyle = 'centered'; // 'centered' | 'panoramic' | 'spacious'
    this.syncScrollEnabled = true;
    this.layoutMode = 'grid'; // 'grid' | 'row' | 'showcase'
    this.containerEl = null;
    this.core = null;
    this.jumpDockEl = null;

    this.isPanning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    this.scrollStartX = 0;
    this.scrollStartY = 0;
  }

  init(containerEl, core) {
    this.containerEl = containerEl;
    this.core = core;

    // Load saved comparison devices & layout mode
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['multiDevices', 'syncScroll', 'layoutMode', 'showcaseDevices', 'showcaseStyle'], (res) => {
        if (res.multiDevices && Array.isArray(res.multiDevices) && res.multiDevices.length > 0) {
          this.activeDeviceIds = res.multiDevices;
        }
        if (res.syncScroll !== undefined) {
          this.syncScrollEnabled = res.syncScroll;
        }
        const btnSync = document.getElementById('btn-toggle-sync-scroll');
        if (btnSync) {
          btnSync.classList.toggle('active', this.syncScrollEnabled);
        }
        if (res.layoutMode) {
          this.layoutMode = res.layoutMode;
        }
        if (res.showcaseDevices) {
          this.showcaseDevices = { ...this.showcaseDevices, ...res.showcaseDevices };
        }
        if (res.showcaseStyle) {
          this.showcaseStyle = res.showcaseStyle;
        }
      });
    }

    this.setupMessageListener();
    this.setupCanvasPan();
  }

  toggleSyncScroll() {
    this.syncScrollEnabled = !this.syncScrollEnabled;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ syncScroll: this.syncScrollEnabled });
    }
    const btn = document.getElementById('btn-toggle-sync-scroll');
    if (btn) {
      btn.classList.toggle('active', this.syncScrollEnabled);
      btn.setAttribute('data-tooltip-title', this.syncScrollEnabled ? 'Synchronized Scrolling (Active)' : 'Synchronized Scrolling (Paused)');
    }
    if (window.app) {
      window.app.showToast(this.syncScrollEnabled ? 'Synchronized scrolling enabled' : 'Synchronized scrolling paused');
    }
    return this.syncScrollEnabled;
  }

  setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (!this.syncScrollEnabled || this.core.currentMode !== 'multi') return;
      if (event.data && event.data.type === 'SIMULATOR_SYNC_SCROLL') {
        const { scrollPercent } = event.data;
        this.broadcastScroll(scrollPercent, event.source);
      }
    });
  }

  /**
   * Fluid Grab & Drag-to-Pan on the workspace canvas
   */
  setupCanvasPan() {
    const ws = this.core.workspaceEl;
    if (!ws) return;

    ws.classList.add('can-pan');

    ws.addEventListener('mousedown', (e) => {
      // Only pan if clicking canvas background (not inside device iframe, headers, or buttons)
      if (e.target.closest('.device-mockup') || e.target.closest('.device-header-bar') || e.target.closest('.device-jump-dock') || e.target.closest('.modal-dialog')) {
        return;
      }

      this.isPanning = true;
      this.panStartX = e.clientX;
      this.panStartY = e.clientY;
      this.scrollStartX = ws.scrollLeft;
      this.scrollStartY = ws.scrollTop;
      ws.classList.add('is-panning');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      const dx = e.clientX - this.panStartX;
      const dy = e.clientY - this.panStartY;
      ws.scrollLeft = this.scrollStartX - dx;
      ws.scrollTop = this.scrollStartY - dy;
    });

    window.addEventListener('mouseup', () => {
      if (this.isPanning) {
        this.isPanning = false;
        ws.classList.remove('is-panning');
      }
    });

    // Horizontal mouse-wheel scrolling for Side-by-Side Row Mode
    ws.addEventListener('wheel', (e) => {
      if (this.core && this.core.currentMode === 'multi' && this.layoutMode === 'row') {
        if (!e.target.closest('.device-screen-iframe')) {
          if (e.deltaY !== 0 && !e.deltaX) {
            ws.scrollLeft += e.deltaY * 1.1;
            e.preventDefault();
          }
        }
      }
    }, { passive: false });

    // Floating navigation arrows for 1-click smooth horizontal scroll
    const btnLeft = document.getElementById('btn-scroll-row-left');
    const btnRight = document.getElementById('btn-scroll-row-right');
    if (btnLeft) {
      btnLeft.addEventListener('click', () => {
        ws.scrollBy({ left: -500, behavior: 'smooth' });
      });
    }
    if (btnRight) {
      btnRight.addEventListener('click', () => {
        ws.scrollBy({ left: 500, behavior: 'smooth' });
      });
    }
  }

  broadcastScroll(percent, sourceWindow) {
    let sourceDeviceId = null;
    const iframes = this.containerEl.querySelectorAll('.device-screen-iframe');
    iframes.forEach(iframe => {
      if (iframe.contentWindow === sourceWindow) {
        const c = iframe.closest('.device-container');
        if (c) sourceDeviceId = c.dataset.deviceId;
      }
    });

    // If source device has its scroll locked, don't broadcast
    if (sourceDeviceId && this.core && this.core.lockedDeviceIds.has(sourceDeviceId)) {
      return;
    }

    iframes.forEach(iframe => {
      if (iframe.contentWindow !== sourceWindow) {
        const c = iframe.closest('.device-container');
        const targetDevId = c ? c.dataset.deviceId : null;
        // If target device is locked, skip it
        if (targetDevId && this.core && this.core.lockedDeviceIds.has(targetDevId)) {
          return;
        }

        iframe.contentWindow.postMessage({
          type: 'SIMULATOR_SET_SCROLL_PERCENT',
          scrollPercent: percent
        }, '*');
      }
    });
  }

  applyComparisonBundle(bundleKey) {
    const bundles = {
      'holy-trinity': ['macbook-air-13', 'ipad-pro-11', 'iphone-16-pro'],
      'flagships': ['iphone-16-pro', 'samsung-s24-ultra', 'pixel-9-pro'],
      'all-forms': ['apple-watch-10', 'iphone-16-pro', 'ipad-pro-11', 'macbook-air-13'],
      'break-points': ['iphone-se', 'ipad-mini', 'ipad-pro-11', 'macbook-pro-16']
    };
    if (bundles[bundleKey]) {
      this.activeDeviceIds = [...bundles[bundleKey]];
      this.saveDevices();
      if (this.core.currentMode === 'multi') {
        this.renderMultiView();
      }
      if (window.app) {
        const bundleNames = {
          'holy-trinity': 'The Holy Trinity (MacBook + iPad + iPhone)',
          'flagships': 'Android vs iOS Flagships',
          'all-forms': 'All Form Factors (Watch, Phone, Tablet, Laptop)',
          'break-points': 'Responsive Breakpoint Spectrum'
        };
        window.app.showToast(`Preset: ${bundleNames[bundleKey] || bundleKey}`);
      }
    }
  }

  setLayout(mode) {
    if (!['grid', 'row', 'showcase'].includes(mode)) return this.layoutMode;
    this.layoutMode = mode;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ layoutMode: this.layoutMode });
    }
    if (window.app) {
      window.app.updateLayoutButtons(this.layoutMode);
    }
    if (this.core.currentMode === 'multi') {
      this.renderMultiView();
    }
    return this.layoutMode;
  }

  toggleLayout() {
    const cycle = { grid: 'row', row: 'showcase', showcase: 'grid' };
    const nextMode = cycle[this.layoutMode] || 'grid';
    return this.setLayout(nextMode);
  }

  renderMultiView() {
    this.core.currentMode = 'multi';
    this.core.singleContainerEl.style.display = 'none';
    this.containerEl.style.display = 'flex';
    this.containerEl.className = `workspace-multi layout-${this.layoutMode}`;
    this.containerEl.innerHTML = '';

    if (this.layoutMode === 'showcase') {
      this.renderShowcaseView();
    } else {
      this.renderStandardMultiView();
    }

    // Render Bottom Quick-Jump Dock
    this.renderJumpDock();
    this.updateRowNavArrows();

    this.core.applyZoom();
  }

  /**
   * Standard Grid & Row Multi-Device View
   */
  renderStandardMultiView() {
    // Render each comparison device
    this.activeDeviceIds.forEach(deviceId => {
      const device = window.devicesManager.getDeviceById(deviceId);
      if (device) {
        const deviceEl = this.core.createDeviceElement(device, true, (idToRemove) => {
          this.removeDevice(idToRemove);
        });
        this.containerEl.appendChild(deviceEl);
      }
    });

    // Render "+ Add Device" Card at the end
    const addCard = document.createElement('div');
    addCard.className = 'add-device-card';
    addCard.id = 'btn-add-comparison-device';
    addCard.innerHTML = `
      <div class="add-device-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <div style="font-weight: 600; font-size: 14px;">Add Device</div>
      <div style="font-size: 12px; color: var(--text-muted);">Compare another breakpoint</div>
    `;
    addCard.addEventListener('click', () => {
      if (window.app) {
        window.app.openDeviceCatalogModal(true);
      }
    });
    this.containerEl.appendChild(addCard);
  }

  /**
   * Showcase Hero Trio:
   * - Centered Hero (Desktop in center foreground, 100% visible screen, tablet & mobile flanking)
   * - Clean Panoramic (Zero Overlap across all 3 devices)
   * - Spacious Studio (Asymmetrical studio composition)
   */
  renderShowcaseView() {
    const stage = document.createElement('div');
    const style = this.showcaseStyle || 'centered';
    stage.className = `showcase-stage preset-${style}`;
    stage.dataset.deviceName = 'device-trio-showcase';

    const slots = [
      { key: 'tablet', role: 'Left Tablet', defaultId: 'ipad-pro-11', category: 'tablet' },
      { key: 'laptop', role: 'Desktop Laptop (Center Hero)', defaultId: 'macbook-air-13', category: 'laptop' },
      { key: 'mobile', role: 'Right Mobile', defaultId: 'iphone-16-pro', category: 'mobile' }
    ];

    slots.forEach(slot => {
      const deviceId = this.showcaseDevices[slot.key] || slot.defaultId;
      const device = window.devicesManager.getDeviceById(deviceId) || window.devicesManager.getDeviceById(slot.defaultId);
      if (!device) return;

      const slotEl = document.createElement('div');
      slotEl.className = `showcase-slot showcase-slot-${slot.key}`;
      slotEl.dataset.slot = slot.key;

      const deviceEl = this.core.createDeviceElement(device, false);

      // Customize header bar for showcase slot
      const headerBar = deviceEl.querySelector('.device-header-bar');
      if (headerBar) {
        // Add Slot Badge
        const titleEl = headerBar.querySelector('.device-header-title');
        if (titleEl) {
          const roleBadge = document.createElement('span');
          roleBadge.className = 'showcase-role-badge';
          roleBadge.textContent = slot.key.toUpperCase();
          titleEl.prepend(roleBadge);
        }

        // Add Quick Swap Device Button
        const actionsEl = headerBar.querySelector('.device-header-actions');
        if (actionsEl) {
          const swapBtn = document.createElement('button');
          swapBtn.className = 'device-action-btn btn-swap-showcase-device';
          swapBtn.setAttribute('data-tooltip-title', `Switch ${slot.role}`);
          swapBtn.setAttribute('data-tooltip-desc', `Choose another ${slot.category} model for this slot.`);
          swapBtn.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"/></svg>
          `;
          swapBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.app) {
              window.app.openShowcaseSwapModal(slot.key, slot.category);
            }
          });
          actionsEl.prepend(swapBtn);
        }
      }

      slotEl.appendChild(deviceEl);
      stage.appendChild(slotEl);
    });

    this.containerEl.appendChild(stage);
  }

  setShowcaseStyle(style) {
    if (!['centered', 'spacious'].includes(style)) return;
    this.showcaseStyle = style;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ showcaseStyle: style });
    }
    if (this.core.currentMode === 'multi' && this.layoutMode === 'showcase') {
      this.renderMultiView();
    }
  }

  swapShowcaseDevice(slotKey, newDeviceId) {
    if (!this.showcaseDevices) this.showcaseDevices = {};
    this.showcaseDevices[slotKey] = newDeviceId;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ showcaseDevices: this.showcaseDevices });
    }
    const dev = window.devicesManager.getDeviceById(newDeviceId);
    if (window.app && dev) {
      window.app.showToast(`${slotKey.toUpperCase()} updated to ${dev.name}`);
    }
    if (this.core.currentMode === 'multi' && this.layoutMode === 'showcase') {
      this.renderMultiView();
    }
  }

  getShortDeviceName(name) {
    if (!name) return 'Device';
    return name
      .replace(/^Apple\s+/i, '')
      .replace(/^Samsung\s+/i, '')
      .replace(/^Google\s+/i, '')
      .replace(/\s*\([^)]*\)/g, '')
      .trim();
  }

  getDeviceCategoryIcon(category) {
    switch (category) {
      case 'laptop':
      case 'desktop':
        return `<svg class="dock-device-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 18h20"/></svg>`;
      case 'tablet':
        return `<svg class="dock-device-icon" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="3"/><circle cx="12" cy="18" r="1"/></svg>`;
      case 'watch':
        return `<svg class="dock-device-icon" viewBox="0 0 24 24"><rect x="6" y="5" width="12" height="14" rx="4"/><path d="M9 5V2h6v3M9 19v3h6v-3"/></svg>`;
      case 'mobile':
      default:
        return `<svg class="dock-device-icon" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`;
    }
  }

  renderJumpDock() {
    if (this.jumpDockEl) {
      this.jumpDockEl.remove();
    }

    const dock = document.createElement('div');
    dock.className = 'device-jump-dock';

    // 1. Quick Jump Section
    const jumpSection = document.createElement('div');
    jumpSection.className = 'dock-section dock-section-jump';

    jumpSection.innerHTML = `
      <span class="jump-dock-label">
        <svg class="jump-dock-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="1" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="1" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="23" y2="12"/></svg>
        <span>Jump</span>
      </span>
    `;

    const pillsList = document.createElement('div');
    pillsList.className = 'dock-pills-list';

    const devicesToList = this.layoutMode === 'showcase'
      ? [
          window.devicesManager.getDeviceById(this.showcaseDevices.laptop || 'macbook-air-13'),
          window.devicesManager.getDeviceById(this.showcaseDevices.tablet || 'ipad-pro-11'),
          window.devicesManager.getDeviceById(this.showcaseDevices.mobile || 'iphone-16-pro')
        ].filter(Boolean)
      : this.activeDeviceIds.map(id => window.devicesManager.getDeviceById(id)).filter(Boolean);

    devicesToList.forEach(device => {
      const pill = document.createElement('button');
      pill.className = 'jump-dock-pill';
      pill.title = `Scroll into focus: ${device.name}`;
      const shortName = this.getShortDeviceName(device.name);
      pill.innerHTML = `
        ${this.getDeviceCategoryIcon(device.category)}
        <span class="jump-pill-text">${shortName}</span>
      `;
      pill.addEventListener('click', () => {
        const targetEl = this.containerEl.querySelector(`[data-device-id="${device.id}"]`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      });
      pillsList.appendChild(pill);
    });

    jumpSection.appendChild(pillsList);
    dock.appendChild(jumpSection);

    // Divider
    const divider1 = document.createElement('div');
    divider1.className = 'jump-dock-divider';
    dock.appendChild(divider1);

    // 2. Segmented Layout Switcher (Grid / Row / Showcase)
    const layoutSegment = document.createElement('div');
    layoutSegment.className = 'dock-segment-group';

    const layouts = [
      {
        id: 'grid',
        label: 'Grid',
        title: 'Switch to Responsive Grid Comparison',
        icon: `<svg class="dock-action-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`
      },
      {
        id: 'row',
        label: 'Row',
        title: 'Switch to Side-by-Side Horizontal Row',
        icon: `<svg class="dock-action-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="8" height="16" rx="1.5"/><rect x="13" y="4" width="8" height="16" rx="1.5"/></svg>`
      },
      {
        id: 'showcase',
        label: 'Showcase Trio',
        title: 'Switch to Showcase Trio (Laptop + Tablet + Mobile Hero Mockup)',
        icon: `<svg class="dock-action-icon" viewBox="0 0 24 24"><path d="M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><line x1="3" y1="17" x2="21" y2="17"/><rect x="2" y="10" width="5" height="9" rx="1" fill="currentColor"/><rect x="17" y="9" width="5" height="10" rx="1" fill="currentColor"/></svg>`
      }
    ];

    layouts.forEach(l => {
      const btn = document.createElement('button');
      btn.className = `layout-toggle-btn ${this.layoutMode === l.id ? 'active' : ''}`;
      btn.innerHTML = `${l.icon}<span>${l.label}</span>`;
      btn.title = l.title;
      btn.addEventListener('click', () => {
        this.setLayout(l.id);
        if (window.app) {
          window.app.showToast(`Layout: ${l.label}`);
        }
      });
      layoutSegment.appendChild(btn);
    });

    dock.appendChild(layoutSegment);

    // 3. Showcase Style Segment & Layer Order
    if (this.layoutMode === 'showcase') {
      const divider2 = document.createElement('div');
      divider2.className = 'jump-dock-divider';
      dock.appendChild(divider2);

      const styleSegment = document.createElement('div');
      styleSegment.className = 'dock-segment-group';

      const presets = [
        {
          id: 'centered',
          label: 'Centered Trio',
          title: 'Centered Trio Composition (Laptop centered, Tablet bottom-left, Mobile bottom-right)',
          icon: `<svg class="dock-action-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>`
        },
        {
          id: 'spacious',
          label: 'Spacious Studio',
          title: 'Spacious Studio Composition (Asymmetrical layout with Laptop on right)',
          icon: `<svg class="dock-action-icon" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/><circle cx="12" cy="12" r="3"/></svg>`
        }
      ];

      presets.forEach(p => {
        const btn = document.createElement('button');
        btn.className = `layout-toggle-btn ${(this.showcaseStyle || 'centered') === p.id ? 'active' : ''}`;
        btn.innerHTML = `${p.icon}<span>${p.label}</span>`;
        btn.title = p.title;
        btn.addEventListener('click', () => {
          this.setShowcaseStyle(p.id);
          if (window.app) {
            window.app.showToast(`Showcase: ${p.label}`);
          }
        });
        styleSegment.appendChild(btn);
      });

      dock.appendChild(styleSegment);
    }

    document.body.appendChild(dock);
    this.jumpDockEl = dock;
  }

  hideJumpDock() {
    if (this.jumpDockEl) {
      this.jumpDockEl.remove();
      this.jumpDockEl = null;
    }
    this.updateRowNavArrows();
  }

  updateRowNavArrows() {
    const btnLeft = document.getElementById('btn-scroll-row-left');
    const btnRight = document.getElementById('btn-scroll-row-right');
    const isRowMode = this.core && this.core.currentMode === 'multi' && this.layoutMode === 'row';
    if (btnLeft) btnLeft.style.display = isRowMode ? 'flex' : 'none';
    if (btnRight) btnRight.style.display = isRowMode ? 'flex' : 'none';
  }

  swapDevice(oldDeviceId, newDeviceId) {
    const idx = this.activeDeviceIds.indexOf(oldDeviceId);
    if (idx !== -1) {
      this.activeDeviceIds[idx] = newDeviceId;
    } else {
      this.activeDeviceIds.push(newDeviceId);
    }
    this.saveDevices();
    if (this.core.currentMode === 'multi') {
      this.renderMultiView();
    }
  }

  addDevice(deviceId) {
    if (!this.activeDeviceIds.includes(deviceId)) {
      this.activeDeviceIds.push(deviceId);
      this.saveDevices();
      if (this.core.currentMode === 'multi') {
        this.renderMultiView();
      }
    }
  }

  removeDevice(deviceId) {
    if (this.activeDeviceIds.length <= 1) {
      if (window.app) window.app.showToast('At least one device must remain in comparison');
      return;
    }
    this.activeDeviceIds = this.activeDeviceIds.filter(id => id !== deviceId);
    this.saveDevices();
    if (this.core.currentMode === 'multi') {
      this.renderMultiView();
    }
  }

  saveDevices() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ multiDevices: this.activeDeviceIds });
    }
  }
}

window.multiDeviceManager = new MultiDeviceManager();
