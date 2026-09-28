/**
 * Mobile Responsive Simulator - Core Simulator Engine
 * Manages device rendering, iframe lifecycles, viewport scaling, zoom, and orientation
 */

class SimulatorCore {
  constructor() {
    this.currentUrl = 'https://example.com';
    this.currentDevice = null;
    this.orientation = 'portrait'; // 'portrait' | 'landscape'
    this.showMockup = true;
    this.zoomLevel = 'fit'; // 'fit' | 0.5 | 0.75 | 1.0 | 1.25 | 1.5
    this.theme = 'dark';

    this.workspaceEl = null;
    this.singleContainerEl = null;
    this.multiContainerEl = null;
    this.currentMode = 'single'; // 'single' | 'multi'

    // Developer Inspection & Power Tools
    this.showRulers = false;
    this.showGrid = false;
    this.touchEmulation = true;
    this.a11yFilter = 'none'; // 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'grayscale'
    this.networkSpeed = 'online'; // 'online' | 'fast3g' | 'slow3g' | 'offline'
    this.lockedDeviceIds = new Set();
    this.activeViewportWidth = null;
  }

  init({ workspaceEl, singleContainerEl, multiContainerEl, initialUrl, initialDeviceId }) {
    this.workspaceEl = workspaceEl;
    this.singleContainerEl = singleContainerEl;
    this.multiContainerEl = multiContainerEl;

    // Load initial device
    const device = initialDeviceId 
      ? window.devicesManager.getDeviceById(initialDeviceId)
      : window.devicesManager.getDeviceById('iphone-16-pro');
    this.currentDevice = device;

    if (initialUrl) {
      this.currentUrl = this.normalizeUrl(initialUrl);
    }

    // Bind window resize for auto-fit zoom
    window.addEventListener('resize', () => {
      if (this.zoomLevel === 'fit') {
        this.applyZoom();
      }
    });

    // Start live status bar clock
    this.startClock();

    // Restore saved touch emulation state
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['touchEmulation'], (res) => {
        if (res && res.touchEmulation !== undefined) {
          this.touchEmulation = res.touchEmulation;
          const btnTouch = document.getElementById('btn-toggle-touch');
          if (btnTouch) {
            btnTouch.classList.toggle('active', this.touchEmulation);
          }
        }
      });
    }
  }

  normalizeUrl(url) {
    if (!url) return 'https://example.com';
    let trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      // If localhost or IP, default to http://
      if (trimmed.startsWith('localhost') || trimmed.startsWith('127.0.0.1')) {
        trimmed = 'http://' + trimmed;
      } else {
        trimmed = 'https://' + trimmed;
      }
    }
    return trimmed;
  }

  /**
   * Set target URL and reload iframe(s)
   */
  setUrl(url) {
    this.currentUrl = this.normalizeUrl(url);
    const iframes = this.workspaceEl.querySelectorAll('.device-screen-iframe');
    iframes.forEach(iframe => {
      iframe.src = this.currentUrl;
    });
  }

  /**
   * Reload current page
   */
  reload() {
    const iframes = this.workspaceEl.querySelectorAll('.device-screen-iframe');
    iframes.forEach(iframe => {
      iframe.src = this.currentUrl;
    });
  }

  /**
   * Set current active device for Single Mode
   */
  setDevice(device) {
    this.currentDevice = device;
    this.activeViewportWidth = null;
    if (this.currentMode === 'single') {
      this.renderSingleDevice();
    }
    this.updateRulerCurrentIndicator();
  }

  /**
   * Toggle or set orientation (Portrait / Landscape)
   */
  setOrientation(newOrientation) {
    this.orientation = newOrientation || (this.orientation === 'portrait' ? 'landscape' : 'portrait');
    this.activeViewportWidth = null;
    const isLandscape = this.orientation === 'landscape';

    const containers = this.workspaceEl.querySelectorAll('.device-container');
    containers.forEach(container => {
      container.classList.toggle('landscape', isLandscape);
      container.classList.toggle('portrait', !isLandscape);
      this.updateDeviceDimensions(container);
    });

    this.applyZoom();
    this.updateRulerCurrentIndicator();
    return this.orientation;
  }

  /**
   * Toggle device mockup frames
   */
  toggleMockup(show) {
    this.showMockup = show !== undefined ? show : !this.showMockup;
    const mockups = this.workspaceEl.querySelectorAll('.device-mockup');
    mockups.forEach(m => {
      if (this.showMockup) {
        m.classList.remove('clean-mode');
      } else {
        m.classList.add('clean-mode');
      }
    });
    this.applyZoom();
    return this.showMockup;
  }

  /**
   * Set zoom level
   */
  setZoom(zoom) {
    this.zoomLevel = zoom;
    this.applyZoom();
  }

  /**
   * Apply calculated or explicit zoom scale
   */
  applyZoom() {
    if (this.currentMode === 'single') {
      this.multiContainerEl.style.zoom = '';
      const container = this.singleContainerEl.querySelector('.device-container');
      if (!container) return;

      let scale = 1.0;
      if (this.zoomLevel === 'fit') {
        const wsWidth = this.workspaceEl.clientWidth - 80;
        const wsHeight = this.workspaceEl.clientHeight - 80;

        const isLandscape = this.orientation === 'landscape';
        const dWidth = this.getCurrentViewportWidth();
        const dHeight = isLandscape ? this.currentDevice.width : this.currentDevice.height;

        // Account for hardware mockup padding & header
        const totalW = dWidth + (this.showMockup ? 40 : 0);
        const totalH = dHeight + (this.showMockup ? 120 : 50);

        scale = Math.min(wsWidth / totalW, wsHeight / totalH, 1.0);
        if (scale < 0.25) scale = 0.25;
      } else {
        scale = parseFloat(this.zoomLevel);
      }

      container.style.transform = `scale(${scale})`;
    } else {
      // In multi-mode:
      if (window.multiDeviceManager && window.multiDeviceManager.layoutMode === 'showcase') {
        this.multiContainerEl.style.zoom = '';
        const stage = this.multiContainerEl.querySelector('.showcase-stage');
        if (stage) {
          let scale = 1.0;
          if (this.zoomLevel === 'fit') {
            const wsWidth = this.workspaceEl.clientWidth - 40;
            const wsHeight = this.workspaceEl.clientHeight - 90; // account for bottom dock & padding
            const stageW = stage.offsetWidth || 1320;
            const stageH = stage.offsetHeight || 780;
            scale = Math.min(wsWidth / stageW, wsHeight / stageH, 1.0);
            if (scale < 0.2) scale = 0.2;
          } else {
            scale = parseFloat(this.zoomLevel);
          }
          stage.style.transform = `scale(${scale})`;
          stage.style.transformOrigin = 'center center';
          this.multiContainerEl.style.overflow = this.zoomLevel === 'fit' ? 'hidden' : 'auto';
        }
      } else {
        // In standard grid / row multi-mode, apply scale to multiContainerEl directly
        // This eliminates empty phantom gaps caused by individual container transforms
        const containers = this.multiContainerEl.querySelectorAll('.device-container');
        containers.forEach(c => {
          c.style.transform = '';
        });
        let scale = this.zoomLevel === 'fit' ? 0.75 : parseFloat(this.zoomLevel);
        this.multiContainerEl.style.zoom = scale;
      }
    }
  }

  /**
   * Create device DOM element
   */
  createDeviceElement(device, isMulti = false, onRemove = null) {
    const isLandscape = this.orientation === 'landscape';
    const width = isLandscape ? device.height : device.width;
    const height = isLandscape ? device.width : device.height;

    const container = document.createElement('div');
    container.className = `device-container ${isLandscape ? 'landscape' : 'portrait'}`;
    container.dataset.deviceId = device.id;
    container.dataset.deviceName = device.name;

    // 1. Header Bar
    const headerBar = document.createElement('div');
    headerBar.className = 'device-header-bar';
    headerBar.innerHTML = `
      <div class="device-header-title clickable-device-title"
        data-tooltip-title="Change Device Model" 
        data-tooltip-desc="Click to switch this device to another model (iPhone, Samsung, Pixel, iPad, etc.).">
        <span class="device-title-text">${device.name}</span>
        <span class="device-header-specs">${device.width} × ${device.height}</span>
        <svg class="device-title-chevron" width="12" height="12" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="device-header-actions">
        <button class="device-action-btn btn-change-device" 
          data-tooltip-title="Change Device Model" 
          data-tooltip-desc="Switch this device to another model (iPhone, Samsung, Pixel, iPad, MacBook, or custom size).">
          <svg viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"/></svg>
        </button>
        <button class="device-action-btn btn-rotate-single" 
          data-tooltip-title="Rotate Device" 
          data-tooltip-desc="Flip between Portrait and Landscape orientation.">
          <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
        </button>
        <button class="device-action-btn btn-screenshot-single" 
          data-tooltip-title="Capture Mockup" 
          data-tooltip-desc="Download high-resolution PNG screenshot with hardware frame.">
          <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>
        <button class="device-action-btn btn-open-external" 
          data-tooltip-title="Open in New Tab" 
          data-tooltip-desc="Open this website in a standard browser tab.">
          <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </button>
        ${isMulti ? `
        <button class="device-action-btn btn-toggle-scroll-lock ${this.lockedDeviceIds.has(device.id) ? 'is-locked' : ''}" 
          data-tooltip-title="Lock / Unlock Scroll" 
          data-tooltip-desc="Freeze this device so it doesn't scroll with others.">
          <svg class="icon-unlocked" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
          <svg class="icon-locked" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </button>
        <button class="device-action-btn btn-remove-device" 
          data-tooltip-title="Remove Device" 
          data-tooltip-desc="Remove this device from multi-device comparison.">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>` : ''}
      </div>
    `;

    // 2. Hardware Mockup Chassis
    const mockup = document.createElement('div');
    mockup.className = `device-mockup frame-${device.frameType || 'frameless'} ${this.showMockup ? '' : 'clean-mode'}`;

    // Specific hardware elements
    if (device.frameType === 'macbook') {
      const notch = document.createElement('div');
      notch.className = 'hardware-notch';
      mockup.appendChild(notch);
    }

    if (device.frameType === 'iphone-island' || device.frameType === 'iphone-notch' || device.frameType === 'tablet') {
      const homeBar = document.createElement('div');
      homeBar.className = 'hardware-home-bar';
      mockup.appendChild(homeBar);
    } else if (device.frameType === 'iphone-classic') {
      const homeBtn = document.createElement('div');
      homeBtn.className = 'hardware-home-button';
      mockup.appendChild(homeBtn);
    }

    // 3. Screen Wrapper & Iframe
    const screenWrapper = document.createElement('div');
    screenWrapper.className = 'device-screen-wrapper';
    screenWrapper.style.width = `${width}px`;
    screenWrapper.style.height = `${height}px`;

    // 4. Realistic Status Bar (Time, Dynamic Island / Notch, Signal, WiFi, Battery)
    if (device.frameType && device.frameType !== 'frameless' && device.frameType !== 'macbook') {
      const statusBar = this.createStatusBar(device);
      screenWrapper.appendChild(statusBar);
    }

    const iframe = document.createElement('iframe');
    iframe.className = `device-screen-iframe ${this.a11yFilter !== 'none' ? `a11y-${this.a11yFilter}` : ''}`;
    iframe.src = this.currentUrl;
    iframe.title = device.name;
    iframe.allow = 'accelerometer; autoplay; camera; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; screen-wake-lock; web-share; xr-spatial-tracking';
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads';

    // Broadcast touch emulation settings once iframe loads
    iframe.addEventListener('load', () => {
      try {
        iframe.contentWindow.postMessage({
          type: 'SIMULATOR_TOGGLE_TOUCH',
          enabled: this.touchEmulation
        }, '*');
      } catch (e) {}
    });

    // 5. Touch Overlay & 12-Column Layout Grid
    const touchOverlay = document.createElement('div');
    touchOverlay.className = 'device-touch-overlay';

    const gridOverlay = document.createElement('div');
    gridOverlay.className = `device-grid-overlay ${this.showGrid ? 'active' : ''}`;
    for (let i = 0; i < 12; i++) {
      const col = document.createElement('div');
      col.className = 'grid-col';
      gridOverlay.appendChild(col);
    }

    screenWrapper.appendChild(iframe);
    screenWrapper.appendChild(touchOverlay);
    screenWrapper.appendChild(gridOverlay);

    // 6. Interactive Drag-to-Resize Handle (Single Device Mode)
    if (!isMulti) {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'device-resize-handle';
      resizeHandle.title = 'Drag horizontally to test responsive CSS media queries fluidly';
      resizeHandle.innerHTML = '<div class="resize-handle-pill"></div>';

      let isDragging = false;
      let startX = 0;
      let startW = 0;

      resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        startX = e.clientX;
        startW = screenWrapper.offsetWidth;
        document.body.classList.add('is-resizing-viewport');
        container.classList.add('is-being-resized');

        const onMouseMove = (moveEvent) => {
          if (!isDragging) return;
          const delta = moveEvent.clientX - startX;
          const newW = Math.max(320, Math.min(2560, Math.round(startW + delta)));
          screenWrapper.style.width = `${newW}px`;
          iframe.style.width = `${newW}px`;

          const adapted = window.devicesManager && window.devicesManager.getAdaptedProfileForWidth
            ? window.devicesManager.getAdaptedProfileForWidth(newW)
            : this.getBreakpointDevice(newW);

          const titleEl = container.querySelector('.device-title-text') || container.querySelector('.device-header-title span:first-child');
          if (titleEl && adapted) {
            titleEl.textContent = adapted.name;
          }

          const specsEl = container.querySelector('.device-header-specs');
          if (specsEl) {
            const h = adapted ? adapted.height : height;
            const dpr = adapted ? adapted.dpr : 2;
            specsEl.textContent = `${newW} × ${h} (${dpr}x) • ${this.getBreakpointTier(newW)}`;
          }
          this.activeViewportWidth = newW;
          this.updateRulerCurrentIndicator();
        };

        const onMouseUp = () => {
          if (isDragging) {
            isDragging = false;
            document.body.classList.remove('is-resizing-viewport');
            container.classList.remove('is-being-resized');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (this.activeViewportWidth) {
              this.setViewportWidth(this.activeViewportWidth);
            }
          }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      screenWrapper.appendChild(resizeHandle);
    }

    mockup.appendChild(screenWrapper);

    container.appendChild(headerBar);
    container.appendChild(mockup);

    // Bind event handlers
    const btnRotate = headerBar.querySelector('.btn-rotate-single');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        container.classList.toggle('landscape');
        this.updateDeviceDimensions(container);
      });
    }

    const btnScreenshot = headerBar.querySelector('.btn-screenshot-single');
    if (btnScreenshot) {
      btnScreenshot.addEventListener('click', () => {
        if (window.app && window.app.openExportStudioModal) {
          window.app.openExportStudioModal(container);
        } else {
          window.mediaExportManager.exportScreenshot(container, !this.showMockup);
        }
      });
    }

    // Change Device (Title click or Change button)
    const triggerSwap = (e) => {
      e.stopPropagation();
      if (window.app) {
        if (isMulti) {
          window.app.openDeviceCatalogModalForSwap(device.id);
        } else {
          window.app.openDeviceCatalogModal(false);
        }
      }
    };

    const titleEl = headerBar.querySelector('.clickable-device-title');
    if (titleEl) titleEl.addEventListener('click', triggerSwap);

    const btnChange = headerBar.querySelector('.btn-change-device');
    if (btnChange) btnChange.addEventListener('click', triggerSwap);

    const btnExternal = headerBar.querySelector('.btn-open-external');
    if (btnExternal) {
      btnExternal.addEventListener('click', () => {
        window.open(this.currentUrl, '_blank');
      });
    }

    if (isMulti) {
      const lockBtn = headerBar.querySelector('.btn-toggle-scroll-lock');
      if (lockBtn) {
        lockBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleDeviceScrollLock(device.id, lockBtn);
        });
      }

      if (onRemove) {
        const btnRemove = headerBar.querySelector('.btn-remove-device');
        if (btnRemove) {
          btnRemove.addEventListener('click', () => onRemove(device.id));
        }
      }
    }

    // Attach touch emulator
    if (window.touchEmulator) {
      window.touchEmulator.attachToDevice(container, iframe);
    }

    return container;
  }

  startClock() {
    if (this._clockInterval) return;
    this._clockInterval = setInterval(() => {
      const timeStr = this.getFormattedTime();
      document.querySelectorAll('.status-time').forEach(el => {
        el.textContent = timeStr;
      });
    }, 15000);
  }

  getFormattedTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  createStatusBar(device) {
    const statusBar = document.createElement('div');
    statusBar.className = `device-status-bar status-bar-${device.frameType || 'standard'}`;
    statusBar.setAttribute('data-tooltip-title', 'Device Status Bar');
    statusBar.setAttribute('data-tooltip-desc', 'Click status bar to toggle between light and dark styling.');
    statusBar.addEventListener('click', () => {
      statusBar.classList.toggle('status-bar-dark');
    });

    // 1. Left: Live Clock (e.g. 11:45 AM)
    const left = document.createElement('div');
    left.className = 'status-bar-left';
    left.innerHTML = `<span class="status-time">${this.getFormattedTime()}</span>`;

    // 2. Center: Dynamic Island / Notch / Camera
    const center = document.createElement('div');
    center.className = 'status-bar-center';
    if (device.frameType === 'iphone-island') {
      center.innerHTML = `
        <div class="dynamic-island">
          <div class="dynamic-island-sensor"></div>
          <div class="dynamic-island-camera"></div>
        </div>
      `;
    } else if (device.frameType === 'iphone-notch') {
      center.innerHTML = `
        <div class="notch-classic">
          <div class="notch-speaker"></div>
          <div class="notch-classic-camera"></div>
        </div>
      `;
    } else if (device.frameType === 'samsung-punchhole' || device.frameType === 'pixel-pill' || device.frameType === 'tablet') {
      center.innerHTML = `<div class="punch-hole"></div>`;
    }

    // 3. Right: Cellular Signal + WiFi + Battery
    const right = document.createElement('div');
    right.className = 'status-bar-right';
    right.innerHTML = `
      <span class="status-icon status-cellular" title="Cellular: Full Signal">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="8" width="2.6" height="3" rx="0.6"/>
          <rect x="4.4" y="5.5" width="2.6" height="5.5" rx="0.6"/>
          <rect x="8.8" y="3" width="2.6" height="8" rx="0.6"/>
          <rect x="13.2" y="0.5" width="2.6" height="10.5" rx="0.6"/>
        </svg>
      </span>
      <span class="status-icon status-wifi" title="Wi-Fi: Connected">
        <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.7A1.3 1.3 0 1 0 8 12.3A1.3 1.3 0 0 0 8 9.7Z"/>
          <path d="M4.6 7.5C5.5 6.6 6.7 6.1 8 6.1C9.3 6.1 10.5 6.6 11.4 7.5C11.8 7.8 12.3 7.8 12.6 7.5C12.9 7.2 12.9 6.7 12.6 6.4C11.4 5.2 9.8 4.6 8 4.6C6.2 4.6 4.6 5.2 3.4 6.4C3.1 6.7 3.1 7.2 3.4 7.5C3.7 7.8 4.3 7.8 4.6 7.5Z"/>
          <path d="M1.9 4.8C3.5 3.2 5.7 2.3 8 2.3C10.3 2.3 12.5 3.2 14.1 4.8C14.4 5.1 15 5.1 15.3 4.8C15.6 4.5 15.6 4 15.3 3.7C13.4 1.8 10.8 0.8 8 0.8C5.2 0.8 2.6 1.8 0.7 3.7C0.4 4 0.4 4.5 0.7 4.8C1 5.1 1.6 5.1 1.9 4.8Z"/>
        </svg>
      </span>
      <span class="status-icon status-battery" title="Battery: 100%">
        <svg width="24" height="12" viewBox="0 0 24 12" fill="currentColor">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <rect x="2.5" y="2.5" width="13.5" height="7" rx="1.6" fill="currentColor"/>
          <path d="M22 4C22.6 4.4 23 5.1 23 6C23 6.9 22.6 7.6 22 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        </svg>
      </span>
    `;

    statusBar.appendChild(left);
    statusBar.appendChild(center);
    statusBar.appendChild(right);

    return statusBar;
  }

  updateDeviceDimensions(container) {
    const deviceId = container.dataset.deviceId;
    const device = window.devicesManager.getDeviceById(deviceId);
    if (!device) return;

    const isLandscape = container.classList.contains('landscape');
    const width = isLandscape ? device.height : device.width;
    const height = isLandscape ? device.width : device.height;

    const screenWrapper = container.querySelector('.device-screen-wrapper');
    if (screenWrapper) {
      screenWrapper.style.width = `${width}px`;
      screenWrapper.style.height = `${height}px`;
    }

    const specsEl = container.querySelector('.device-header-specs');
    if (specsEl) {
      specsEl.textContent = `${width} × ${height} (${device.dpr}x)`;
    }
  }

  /**
   * Render single device mode
   */
  renderSingleDevice() {
    this.currentMode = 'single';
    this.singleContainerEl.style.display = 'flex';
    this.multiContainerEl.style.display = 'none';
    this.singleContainerEl.innerHTML = '';

    const deviceEl = this.createDeviceElement(this.currentDevice, false);
    this.singleContainerEl.appendChild(deviceEl);
    this.applyZoom();
  }

  /* ==================== DEVELOPER INSPECTION & POWER TOOLS ==================== */

  toggleDeviceScrollLock(deviceId, btnEl) {
    if (this.lockedDeviceIds.has(deviceId)) {
      this.lockedDeviceIds.delete(deviceId);
      if (btnEl) btnEl.classList.remove('is-locked');
      if (window.app) window.app.showToast('Device scroll unlocked');
    } else {
      this.lockedDeviceIds.add(deviceId);
      if (btnEl) btnEl.classList.add('is-locked');
      if (window.app) window.app.showToast('Device scroll frozen (independent)');
    }
  }

  toggleTouchEmulation(force) {
    this.touchEmulation = force !== undefined ? force : !this.touchEmulation;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ touchEmulation: this.touchEmulation });
    }
    const iframes = document.querySelectorAll('.device-screen-iframe');
    iframes.forEach(iframe => {
      try {
        iframe.contentWindow.postMessage({
          type: 'SIMULATOR_TOGGLE_TOUCH',
          enabled: this.touchEmulation
        }, '*');
      } catch (e) {}
    });
    const btnTouch = document.getElementById('btn-toggle-touch');
    if (btnTouch) {
      btnTouch.classList.toggle('active', this.touchEmulation);
      btnTouch.setAttribute('data-tooltip-title', this.touchEmulation ? 'Touch Gesture Emulation (Active)' : 'Touch Gesture Emulation (Disabled)');
    }
    if (window.app) {
      window.app.showToast(this.touchEmulation ? 'Touch gesture emulation enabled' : 'Touch emulation disabled');
    }
    return this.touchEmulation;
  }

  toggleGrid(force) {
    this.showGrid = force !== undefined ? force : !this.showGrid;
    const overlays = this.workspaceEl.querySelectorAll('.device-grid-overlay');
    overlays.forEach(o => o.classList.toggle('active', this.showGrid));
    if (window.app) {
      window.app.showToast(this.showGrid ? '12-Column Alignment Grid enabled' : 'Alignment Grid hidden');
    }
    return this.showGrid;
  }

  toggleRulers(force) {
    this.showRulers = force !== undefined ? force : !this.showRulers;
    let rulerContainer = document.getElementById('ruler-container');
    if (!rulerContainer) {
      rulerContainer = document.createElement('div');
      rulerContainer.id = 'ruler-container';
      rulerContainer.className = 'ruler-container';
      rulerContainer.innerHTML = `
        <div id="ruler-top" class="ruler ruler-top"></div>
        <div id="ruler-left" class="ruler ruler-left"></div>
      `;
      this.workspaceEl.prepend(rulerContainer);
    }
    rulerContainer.classList.toggle('active', this.showRulers);
    this.workspaceEl.classList.toggle('has-rulers', this.showRulers);

    if (this.showRulers) {
      this.renderRulerMarkers();
    }
    if (window.app) {
      window.app.showToast(this.showRulers ? 'Breakpoint Rulers enabled' : 'Rulers hidden');
    }
    return this.showRulers;
  }

  renderRulerMarkers() {
    const topRuler = document.getElementById('ruler-top');
    const leftRuler = document.getElementById('ruler-left');
    if (!topRuler || !leftRuler) return;

    topRuler.innerHTML = '';
    leftRuler.innerHTML = '';

    const breakpoints = [
      { px: 375, label: '375 Mobile S', tier: 'Mobile S' },
      { px: 430, label: '430 Mobile L', tier: 'Mobile L' },
      { px: 640, label: '640 SM', tier: 'SM' },
      { px: 768, label: '768 MD', tier: 'MD' },
      { px: 1024, label: '1024 LG', tier: 'LG' },
      { px: 1280, label: '1280 XL', tier: 'XL' },
      { px: 1536, label: '1536 2XL', tier: '2XL' }
    ];

    // Click anywhere on top ruler to jump viewport width
    topRuler.onclick = (e) => {
      if (e.target.closest('.bp-tag')) return; // handled by button
      const rect = topRuler.getBoundingClientRect();
      const clickPx = Math.round(e.clientX - rect.left);
      if (clickPx >= 320 && clickPx <= 2560) {
        this.setViewportWidth(clickPx);
      }
    };

    // Pixel graduation ticks
    for (let px = 0; px <= 2600; px += 50) {
      const tick = document.createElement('div');
      tick.className = `ruler-tick ${px % 100 === 0 ? 'major' : 'minor'}`;
      tick.style.left = `${px}px`;
      if (px % 100 === 0) {
        tick.innerHTML = `<span class="ruler-label">${px}</span>`;
      }
      topRuler.appendChild(tick);
    }

    // Interactive Click-to-Jump Breakpoint Badges
    breakpoints.forEach(bp => {
      const marker = document.createElement('div');
      marker.className = 'ruler-bp-marker';
      marker.dataset.px = bp.px;
      marker.style.left = `${bp.px}px`;

      const tag = document.createElement('button');
      tag.className = 'bp-tag';
      tag.textContent = bp.label;
      tag.title = `Click to resize viewport to ${bp.label} (${bp.px}px)`;
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setViewportWidth(bp.px);
      });

      marker.appendChild(tag);
      topRuler.appendChild(marker);
    });

    // Vertical Y ruler
    for (let py = 0; py <= 2000; py += 50) {
      const tick = document.createElement('div');
      tick.className = `ruler-tick ${py % 100 === 0 ? 'major' : 'minor'}`;
      tick.style.top = `${py}px`;
      if (py % 100 === 0) {
        tick.innerHTML = `<span class="ruler-label">${py}</span>`;
      }
      leftRuler.appendChild(tick);
    }

    this.updateRulerCurrentIndicator();
  }

  setViewportWidth(targetWidth) {
    if (this.currentMode !== 'single') {
      if (window.app) {
        window.app.switchMode('single');
      } else {
        this.renderSingleDevice();
      }
    }

    let container = this.singleContainerEl.querySelector('.device-container');
    if (!container) {
      this.renderSingleDevice();
      container = this.singleContainerEl.querySelector('.device-container');
    }
    if (!container) return;

    // 1. Get adapted device profile for this width
    const adaptedDevice = window.devicesManager && window.devicesManager.getAdaptedProfileForWidth
      ? window.devicesManager.getAdaptedProfileForWidth(targetWidth)
      : this.getBreakpointDevice(targetWidth);

    this.currentDevice = adaptedDevice;
    this.activeViewportWidth = targetWidth;
    container.dataset.deviceId = adaptedDevice.id;

    const mockup = container.querySelector('.device-mockup');
    const screenWrapper = container.querySelector('.device-screen-wrapper');
    const iframe = container.querySelector('.device-screen-iframe');
    const titleEl = container.querySelector('.device-title-text') || container.querySelector('.device-header-title span:first-child');
    const specsEl = container.querySelector('.device-header-specs');
    const statusBar = container.querySelector('.device-status-bar');
    const homeBar = container.querySelector('.hardware-home-bar');

    // 2. Update Title and Specs in Device Header
    if (titleEl) {
      titleEl.textContent = adaptedDevice.name;
    }
    if (specsEl) {
      specsEl.textContent = `${targetWidth} × ${adaptedDevice.height} (${adaptedDevice.dpr}x) • ${this.getBreakpointTier(targetWidth)}`;
    }

    // 3. Update Dimensions
    if (screenWrapper && iframe) {
      screenWrapper.style.width = `${targetWidth}px`;
      screenWrapper.style.height = `${adaptedDevice.height}px`;
      iframe.style.width = `${targetWidth}px`;
      iframe.style.height = `${adaptedDevice.height}px`;
      iframe.title = adaptedDevice.name;
    }

    // 4. Update Hardware Mockup Chassis
    if (mockup) {
      // Remove all frame-* classes and apply the appropriate frame
      mockup.className = mockup.className.replace(/\bframe-[a-z0-9-]+\b/g, '').trim();
      mockup.classList.add(`frame-${adaptedDevice.frameType}`);

      // Adjust status bar & home bar depending on device category
      if (statusBar) {
        if (adaptedDevice.category === 'desktop' || adaptedDevice.frameType === 'macbook' || adaptedDevice.frameType === 'frameless') {
          statusBar.style.display = 'none';
        } else if (adaptedDevice.category === 'tablet') {
          statusBar.style.display = 'none'; // Clean tablet screen
        } else {
          statusBar.style.display = 'flex';
          const island = statusBar.querySelector('.status-dynamic-island');
          if (island) {
            island.style.display = (adaptedDevice.frameType === 'iphone-island') ? 'flex' : 'none';
          }
        }
      }

      // Hardware notch (for MacBook webcam or tablet dot)
      let notch = mockup.querySelector('.hardware-notch');
      if (adaptedDevice.frameType === 'macbook' || adaptedDevice.frameType === 'tablet') {
        if (!notch) {
          notch = document.createElement('div');
          notch.className = 'hardware-notch';
          mockup.prepend(notch);
        }
        notch.style.display = 'block';
      } else if (notch) {
        notch.style.display = 'none';
      }

      // Home bar (phones only)
      if (homeBar) {
        homeBar.style.display = (adaptedDevice.category === 'mobile') ? 'block' : 'none';
      }
    }

    // 5. Update Bottom Bar Label
    if (window.app && window.app.updateDevicePickerLabel) {
      window.app.updateDevicePickerLabel();
    }

    // 6. Update Rulers & Zoom
    this.updateRulerCurrentIndicator();
    this.applyZoom();

    if (window.app) {
      window.app.showToast(`Device: ${adaptedDevice.name} [${targetWidth}px]`);
    }
  }

  getBreakpointDevice(width) {
    if (width <= 385) {
      return { id: 'iphone-se-3', name: 'Apple iPhone SE (Mobile S)', width: 375, height: 667, dpr: 2.0, frameType: 'iphone-notch', category: 'mobile' };
    }
    if (width < 420) {
      return { id: 'iphone-16-pro', name: 'Apple iPhone 16 Pro', width: 402, height: 874, dpr: 3.0, frameType: 'iphone-island', category: 'mobile' };
    }
    if (width < 550) {
      return { id: 'iphone-16-plus', name: 'Apple iPhone 16 Plus (Mobile L)', width: 430, height: 932, dpr: 3.0, frameType: 'iphone-island', category: 'mobile' };
    }
    if (width < 700) {
      return { id: 'foldable-tablet-640', name: 'Foldable / Compact Tablet (640 SM)', width: 640, height: 720, dpr: 2.0, frameType: 'tablet', category: 'tablet' };
    }
    if (width < 800) {
      return { id: 'ipad-10', name: 'Apple iPad 10.9" (Tablet MD)', width: 768, height: 1024, dpr: 2.0, frameType: 'tablet', category: 'tablet' };
    }
    if (width < 960) {
      return { id: 'ipad-pro-11', name: 'Apple iPad Pro 11" (Tablet)', width: 834, height: 1194, dpr: 2.0, frameType: 'tablet', category: 'tablet' };
    }
    if (width < 1180) {
      return { id: 'ipad-pro-12-9', name: 'Apple iPad Pro 12.9" (Laptop LG)', width: 1024, height: 768, dpr: 2.0, frameType: 'tablet', category: 'tablet' };
    }
    if (width < 1400) {
      return { id: 'macbook-air-13', name: 'Apple MacBook Air 13" (Laptop XL)', width: 1280, height: 832, dpr: 2.0, frameType: 'macbook', category: 'desktop' };
    }
    if (width < 1650) {
      return { id: 'desktop-ultra-2xl', name: 'Apple MacBook Pro 14" (Ultra 2XL)', width: 1536, height: 960, dpr: 2.0, frameType: 'macbook', category: 'desktop' };
    }
    if (width < 1850) {
      return { id: 'macbook-pro-16', name: 'Apple MacBook Pro 16"', width: 1728, height: 1117, dpr: 2.0, frameType: 'macbook', category: 'desktop' };
    }
    return { id: 'desktop-1080p', name: 'Full HD 1080p Desktop (1920×1080)', width: 1920, height: 1080, dpr: 1.0, frameType: 'frameless', category: 'desktop' };
  }

  getCurrentViewportWidth() {
    if (this.activeViewportWidth) return this.activeViewportWidth;
    if (!this.currentDevice) return 402;
    const isLandscape = this.orientation === 'landscape';
    return isLandscape ? this.currentDevice.height : this.currentDevice.width;
  }

  getBreakpointTier(width) {
    if (width < 430) return 'Mobile S';
    if (width < 640) return 'Mobile L';
    if (width < 768) return 'Tablet SM';
    if (width < 1024) return 'Tablet MD';
    if (width < 1280) return 'Laptop LG';
    if (width < 1536) return 'Desktop XL';
    return 'Ultra 2XL';
  }

  updateRulerCurrentIndicator() {
    const topRuler = document.getElementById('ruler-top');
    if (!topRuler) return;

    let indicator = topRuler.querySelector('.ruler-active-width-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'ruler-active-width-indicator';
      topRuler.appendChild(indicator);
    }

    const currentW = this.getCurrentViewportWidth();
    indicator.style.left = `${currentW}px`;
    indicator.innerHTML = `<span class="active-width-tag">${currentW}px</span>`;

    // Highlight matching breakpoint badges
    topRuler.querySelectorAll('.ruler-bp-marker').forEach(m => {
      const px = parseInt(m.dataset.px, 10);
      m.classList.toggle('is-active-bp', Math.abs(px - currentW) <= 20);
    });
  }

  setA11yFilter(filterName) {
    this.a11yFilter = filterName || 'none';
    const iframes = this.workspaceEl.querySelectorAll('.device-screen-iframe');
    iframes.forEach(iframe => {
      iframe.classList.remove('a11y-deuteranopia', 'a11y-protanopia', 'a11y-tritanopia', 'a11y-grayscale');
      if (this.a11yFilter !== 'none') {
        iframe.classList.add(`a11y-${this.a11yFilter}`);
      }
    });
    if (window.app) {
      const labels = {
        none: 'Normal Vision',
        deuteranopia: 'Deuteranopia (Green Blindness)',
        protanopia: 'Protanopia (Red Blindness)',
        tritanopia: 'Tritanopia (Blue Blindness)',
        grayscale: 'High Contrast Grayscale'
      };
      window.app.showToast(`Vision Filter: ${labels[this.a11yFilter] || this.a11yFilter}`);
    }
  }

  setNetworkSpeed(speed) {
    this.networkSpeed = speed || 'online';
    const indicator = document.getElementById('network-speed-indicator');
    if (indicator) {
      indicator.className = `network-speed-badge speed-${this.networkSpeed}`;
      const labels = {
        online: 'Fast (Normal)',
        fast3g: 'Fast 3G',
        slow3g: 'Slow 3G',
        offline: 'Offline'
      };
      indicator.textContent = labels[this.networkSpeed] || speed;
    }
    if (window.app) {
      window.app.showToast(`Network mode: ${speed.toUpperCase()}`);
    }
  }
}

window.simulatorCore = new SimulatorCore();
