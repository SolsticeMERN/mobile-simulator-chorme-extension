/**
 * Mobile Responsive Simulator - Touch & Inertia Scrolling Emulator
 * Simulates mobile touch events, inertia scroll, and circular touch pointer cursor
 */

class TouchEmulator {
  constructor() {
    this.enabled = true;
    this.isDragging = false;
    this.startY = 0;
    this.startX = 0;
    this.currentScrollY = 0;
    this.velocity = 0;
    this.lastTime = 0;
    this.inertiaRaf = null;

    this.touchCursor = null;
    // Clean up any legacy touch cursor element if present
    const existing = document.getElementById('touch-cursor');
    if (existing) existing.remove();
  }

  toggle(enable) {
    if (window.simulatorCore) {
      return window.simulatorCore.toggleTouchEmulation(enable);
    }
    this.enabled = enable !== undefined ? enable : !this.enabled;
    return this.enabled;
  }

  /**
   * Attach drag-to-scroll and touch emulation to a device wrapper
   */
  attachToDevice(deviceEl, iframeEl) {
    const overlay = deviceEl.querySelector('.device-touch-overlay');
    if (!overlay) return;

    let isDown = false;
    let startY = 0;
    let lastY = 0;
    let velocityY = 0;
    let lastTimestamp = 0;

    const onMouseDown = (e) => {
      if (!this.enabled) return;
      isDown = true;
      startY = e.clientY;
      lastY = e.clientY;
      lastTimestamp = performance.now();
      velocityY = 0;
      cancelAnimationFrame(this.inertiaRaf);

      // Forward touchstart simulation to iframe if accessible
      this.postTouchEvent(iframeEl, 'touchstart', e);
    };

    const onMouseMove = (e) => {
      if (!isDown || !this.enabled) return;
      const now = performance.now();
      const deltaY = e.clientY - lastY;
      const deltaTime = Math.max(1, now - lastTimestamp);

      velocityY = deltaY / deltaTime; // px per ms
      lastY = e.clientY;
      lastTimestamp = now;

      // Scroll iframe content or dispatch scroll
      this.scrollIframe(iframeEl, -deltaY);
      this.postTouchEvent(iframeEl, 'touchmove', e);
    };

    const onMouseUp = (e) => {
      if (!isDown || !this.enabled) return;
      isDown = false;
      this.postTouchEvent(iframeEl, 'touchend', e);

      // Perform inertia scrolling
      if (Math.abs(velocityY) > 0.1) {
        this.applyInertia(iframeEl, velocityY);
      }
    };

    overlay.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  scrollIframe(iframeEl, amount) {
    try {
      if (iframeEl.contentWindow && iframeEl.contentWindow.scrollBy) {
        iframeEl.contentWindow.scrollBy({ top: amount, behavior: 'auto' });
      }
    } catch (e) {
      // Cross-origin restriction fallback: dispatch postMessage
      iframeEl.contentWindow.postMessage({ type: 'SIMULATOR_SCROLL_BY', deltaY: amount }, '*');
    }
  }

  applyInertia(iframeEl, initialVelocity) {
    let v = initialVelocity * 15;
    const decay = 0.94;

    const step = () => {
      if (Math.abs(v) < 0.5) return;
      this.scrollIframe(iframeEl, -v);
      v *= decay;
      this.inertiaRaf = requestAnimationFrame(step);
    };

    this.inertiaRaf = requestAnimationFrame(step);
  }

  postTouchEvent(iframeEl, eventName, mouseEvent) {
    try {
      iframeEl.contentWindow.postMessage({
        type: 'SIMULATOR_TOUCH_EVENT',
        name: eventName,
        clientX: mouseEvent.clientX,
        clientY: mouseEvent.clientY
      }, '*');
    } catch (err) {
      // Cross-origin fallback ignore
    }
  }
}

window.touchEmulator = new TouchEmulator();
