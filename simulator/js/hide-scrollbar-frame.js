/**
 * Mobile Responsive Simulator - Frame Controller (Content Script)
 * Runs inside all iframes loaded within the simulator.
 * Features:
 * 1. Desktop scrollbar elimination (pure mobile aesthetic)
 * 2. Synchronized scrolling engine (real-time percentage broadcast & receipt)
 * 3. Mobile touch gesture emulation (circular touch pointer dot, drag-to-scroll, inertia physics)
 * 4. Mobile touch capabilities emulation (navigator.maxTouchPoints = 5)
 */

(function () {
  try {
    // Only run if embedded inside an iframe whose ancestor is our simulator extension
    const isSubframe = window.self !== window.top;
    if (!isSubframe) return;

    let isFromSimulator = false;
    if (window.location && window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
      const topOrigin = window.location.ancestorOrigins[0];
      if (topOrigin && topOrigin.startsWith('chrome-extension://')) {
        isFromSimulator = true;
      }
    } else {
      isFromSimulator = true;
    }

    if (!isFromSimulator) return;

    // ==================== 1. SCROLLBAR ELIMINATION ====================
    const injectStyles = () => {
      if (document.getElementById('mobile-simulator-frame-styles')) return;

      const style = document.createElement('style');
      style.id = 'mobile-simulator-frame-styles';
      style.textContent = `
        /* Hide desktop scrollbars */
        ::-webkit-scrollbar {
          display: none !important;
          width: 0px !important;
          height: 0px !important;
          background: transparent !important;
        }
        html, body, * {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        /* Circular Mobile Touch Pointer Cursor */
        #mobile-simulator-touch-pointer {
          position: fixed;
          top: 0;
          left: 0;
          width: 26px;
          height: 26px;
          margin-left: -13px;
          margin-top: -13px;
          border-radius: 50%;
          background: rgba(100, 116, 139, 0.35);
          border: 1.5px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.2), 0 3px 10px rgba(0, 0, 0, 0.25);
          pointer-events: none !important;
          z-index: 2147483647 !important;
          opacity: 0;
          transform: scale(1);
          transition: transform 0.12s cubic-bezier(0.2, 0, 0, 1), background-color 0.12s ease, opacity 0.15s ease;
          will-change: transform, left, top;
        }
        #mobile-simulator-touch-pointer.is-touching {
          transform: scale(0.82);
          background: rgba(51, 65, 85, 0.6);
          border-color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.3), 0 1px 4px rgba(0, 0, 0, 0.35);
        }
        #mobile-simulator-touch-pointer.is-visible {
          opacity: 1;
        }

        /* Prevent text selection during drag-to-scroll swipe */
        html.mobile-simulator-dragging,
        html.mobile-simulator-dragging * {
          user-select: none !important;
          -webkit-user-select: none !important;
          cursor: grabbing !important;
        }
      `;

      const target = document.head || document.documentElement;
      if (target) {
        target.appendChild(style);
      }
    };

    injectStyles();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectStyles);
    }

    // ==================== 2. TOUCH CAPABILITIES EMULATION ====================
    try {
      if (!('ontouchstart' in window)) {
        window.ontouchstart = null;
      }
      Object.defineProperty(navigator, 'maxTouchPoints', {
        get: () => 5,
        configurable: true
      });
    } catch (e) {}

    // ==================== 3. TOUCH POINTER CURSOR ====================
    let touchPointerEl = null;
    let touchEmulationEnabled = true;

    const createTouchPointer = () => {
      if (touchPointerEl || !document.body) return;
      touchPointerEl = document.createElement('div');
      touchPointerEl.id = 'mobile-simulator-touch-pointer';
      document.body.appendChild(touchPointerEl);
    };

    if (document.body) {
      createTouchPointer();
    } else {
      document.addEventListener('DOMContentLoaded', createTouchPointer);
    }

    // Pointer movement tracking
    window.addEventListener('mousemove', (e) => {
      if (!touchEmulationEnabled) return;
      if (!touchPointerEl) createTouchPointer();
      if (touchPointerEl) {
        touchPointerEl.style.left = `${e.clientX}px`;
        touchPointerEl.style.top = `${e.clientY}px`;
        if (!touchPointerEl.classList.contains('is-visible')) {
          touchPointerEl.classList.add('is-visible');
        }
      }
    }, { passive: true, capture: true });

    document.addEventListener('mouseleave', () => {
      if (touchPointerEl) {
        touchPointerEl.classList.remove('is-visible');
      }
    });

    // ==================== 4. DRAG-TO-SCROLL & INERTIA PHYSICS ====================
    let isMouseDown = false;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocityY = 0;
    let velocityX = 0;
    let inertiaRaf = null;
    let suppressNextClick = false;
    const DRAG_THRESHOLD = 5; // px moved to consider as swipe/scroll rather than tap

    // Check if element is a form input where user wants to click/type
    const isInteractiveInput = (el) => {
      if (!el) return false;
      const tag = el.tagName ? el.tagName.toLowerCase() : '';
      return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    };

    window.addEventListener('mousedown', (e) => {
      if (!touchEmulationEnabled) return;
      // Only emulate on primary left click
      if (e.button !== 0) return;

      isMouseDown = true;
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = performance.now();
      velocityY = 0;
      velocityX = 0;

      cancelAnimationFrame(inertiaRaf);

      if (touchPointerEl) {
        touchPointerEl.classList.add('is-touching');
      }
    }, { capture: true });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown || !touchEmulationEnabled) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Check if drag threshold is crossed
      if (!isDragging) {
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          isDragging = true;
          suppressNextClick = true;
          document.documentElement.classList.add('mobile-simulator-dragging');
        }
      }

      if (isDragging) {
        const stepX = e.clientX - lastX;
        const stepY = e.clientY - lastY;
        const now = performance.now();
        const dt = Math.max(1, now - lastTime);

        // Perform instant natural scroll
        window.scrollBy({ left: -stepX, top: -stepY, behavior: 'instant' });

        velocityY = stepY / dt; // px per ms
        velocityX = stepX / dt;
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    }, { capture: true });

    const handleMouseUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      document.documentElement.classList.remove('mobile-simulator-dragging');

      if (touchPointerEl) {
        touchPointerEl.classList.remove('is-touching');
      }

      if (isDragging) {
        isDragging = false;

        // Apply realistic mobile momentum/inertia scroll with physics decay
        let vy = velocityY * 15;
        let vx = velocityX * 15;
        const decay = 0.93;

        const stepInertia = () => {
          if (Math.abs(vy) < 0.4 && Math.abs(vx) < 0.4) return;
          window.scrollBy({ left: -vx, top: -vy, behavior: 'instant' });
          vy *= decay;
          vx *= decay;
          inertiaRaf = requestAnimationFrame(stepInertia);
        };

        cancelAnimationFrame(inertiaRaf);
        inertiaRaf = requestAnimationFrame(stepInertia);
      }
    };

    window.addEventListener('mouseup', handleMouseUp, { capture: true });

    // Suppress accidental link click or button activation immediately after swiping
    window.addEventListener('click', (e) => {
      if (suppressNextClick) {
        suppressNextClick = false;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }, { capture: true });

    // ==================== 5. SYNCHRONIZED SCROLLING ENGINE ====================
    let isProgrammaticScroll = false;
    let programmaticTimer = null;
    let scrollRaf = null;

    // Helper: calculate normalized scroll percent (0.0 to 1.0)
    const getScrollPercent = () => {
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      );
      const maxScrollY = Math.max(1, docHeight - window.innerHeight);
      const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      return Math.min(1, Math.max(0, currentY / maxScrollY));
    };

    // 1. Broadcast scroll position to parent simulator
    window.addEventListener('scroll', () => {
      if (isProgrammaticScroll) return;
      if (scrollRaf) return;

      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        if (isProgrammaticScroll) return;

        const percent = getScrollPercent();
        try {
          window.parent.postMessage({
            type: 'SIMULATOR_SYNC_SCROLL',
            scrollPercent: percent
          }, '*');
        } catch (err) {}
      });
    }, { passive: true });

    // 2. Listen for messages from parent simulator
    window.addEventListener('message', (event) => {
      if (!event.data || typeof event.data !== 'object') return;

      // Handle Synchronized Scroll command from Multi-Device Manager
      if (event.data.type === 'SIMULATOR_SET_SCROLL_PERCENT') {
        const { scrollPercent } = event.data;
        if (typeof scrollPercent !== 'number' || isNaN(scrollPercent)) return;

        const docHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body ? document.body.scrollHeight : 0
        );
        const maxScrollY = Math.max(1, docHeight - window.innerHeight);
        const targetY = scrollPercent * maxScrollY;

        isProgrammaticScroll = true;
        cancelAnimationFrame(inertiaRaf);

        window.scrollTo({
          top: targetY,
          behavior: 'instant'
        });

        clearTimeout(programmaticTimer);
        programmaticTimer = setTimeout(() => {
          isProgrammaticScroll = false;
        }, 80);
      }

      // Handle relative scroll by delta
      if (event.data.type === 'SIMULATOR_SCROLL_BY') {
        const { deltaY } = event.data;
        if (typeof deltaY === 'number') {
          window.scrollBy({ top: deltaY, behavior: 'instant' });
        }
      }

      // Handle Touch Emulation Toggle
      if (event.data.type === 'SIMULATOR_TOGGLE_TOUCH') {
        touchEmulationEnabled = !!event.data.enabled;
        if (touchPointerEl) {
          touchPointerEl.style.display = touchEmulationEnabled ? 'block' : 'none';
        }
      }
    });

  } catch (err) {
    // Silently ignore cross-origin access errors
  }
})();

