/**
 * Mobile Responsive Simulator - Loom-Style Floating Webcam Bubble
 * Provides a circular, draggable webcam avatar feed with microphone audio,
 * size cycling, mirroring, live voice pulse, and recording audio integration.
 */

class WebcamBubbleManager {
  constructor() {
    this.stream = null;
    this.bubbleEl = null;
    this.videoEl = null;
    this.audioContext = null;
    this.analyser = null;
    this.voicePulseInterval = null;

    this.isActive = false;
    this.isMicMuted = false;
    this.isMirrored = true;
    this.sizes = ['small', 'medium', 'large'];
    this.sizeIndex = 1; // Default 'medium' (180px)

    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.elemStartX = 0;
    this.elemStartY = 0;
  }

  init() {
    this.bubbleEl = document.getElementById('webcam-bubble');
    if (!this.bubbleEl) return;

    this.videoEl = this.bubbleEl.querySelector('#webcam-video');
    this.setupControls();
    this.setupDrag();

    // Restore saved settings
    const savedSize = localStorage.getItem('mrs_webcam_size');
    if (savedSize && this.sizes.includes(savedSize)) {
      this.sizeIndex = this.sizes.indexOf(savedSize);
      this.updateSizeClass();
    }

    const savedPos = localStorage.getItem('mrs_webcam_pos');
    if (savedPos) {
      try {
        const { x, y } = JSON.parse(savedPos);
        this.setPosition(x, y);
      } catch (e) {
        // Default positioning handled by CSS
      }
    }
  }

  setupControls() {
    const btnSize = this.bubbleEl.querySelector('#btn-webcam-size');
    const btnMic = this.bubbleEl.querySelector('#btn-webcam-mic');
    const btnFlip = this.bubbleEl.querySelector('#btn-webcam-flip');
    const btnClose = this.bubbleEl.querySelector('#btn-webcam-close');

    if (btnSize) {
      btnSize.addEventListener('click', (e) => {
        e.stopPropagation();
        this.cycleSize();
      });
    }

    if (btnMic) {
      btnMic.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMic();
      });
    }

    if (btnFlip) {
      btnFlip.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFlip();
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.stopWebcam();
      });
    }
  }

  setupDrag() {
    this.bubbleEl.addEventListener('pointerdown', (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('button')) return;

      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;

      const rect = this.bubbleEl.getBoundingClientRect();
      this.elemStartX = rect.left;
      this.elemStartY = rect.top;

      this.bubbleEl.classList.add('is-dragging');
      this.bubbleEl.setPointerCapture(e.pointerId);
    });

    this.bubbleEl.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.dragStartX;
      const deltaY = e.clientY - this.dragStartY;

      let newX = this.elemStartX + deltaX;
      let newY = this.elemStartY + deltaY;

      // Clamp within viewport
      const bubbleW = this.bubbleEl.offsetWidth;
      const bubbleH = this.bubbleEl.offsetHeight;
      const maxX = window.innerWidth - bubbleW - 10;
      const maxY = window.innerHeight - bubbleH - 10;

      newX = Math.max(10, Math.min(newX, maxX));
      newY = Math.max(50, Math.min(newY, maxY));

      this.setPosition(newX, newY);
    });

    const onPointerEnd = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.bubbleEl.classList.remove('is-dragging');
        try {
          this.bubbleEl.releasePointerCapture(e.pointerId);
        } catch (err) {}

        const rect = this.bubbleEl.getBoundingClientRect();
        localStorage.setItem('mrs_webcam_pos', JSON.stringify({ x: rect.left, y: rect.top }));
      }
    };

    this.bubbleEl.addEventListener('pointerup', onPointerEnd);
    this.bubbleEl.addEventListener('pointercancel', onPointerEnd);
  }

  setPosition(x, y) {
    this.bubbleEl.style.left = `${x}px`;
    this.bubbleEl.style.top = `${y}px`;
    this.bubbleEl.style.right = 'auto';
    this.bubbleEl.style.bottom = 'auto';
  }

  async startWebcam() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user'
        },
        audio: true
      });

      if (this.videoEl) {
        this.videoEl.srcObject = this.stream;
        await this.videoEl.play();
      }

      this.isActive = true;
      this.isMicMuted = false;
      this.bubbleEl.classList.remove('is-hidden');
      this.bubbleEl.style.display = 'block';

      this.startVoiceActivityDetection();
      this.updateToolbarButton(true);

      if (window.app) {
        window.app.showToast('Presenter Webcam active (Loom mode)');
      }

      return true;
    } catch (err) {
      console.warn('Could not start webcam with audio, trying video-only:', err);
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
          audio: false
        });
        if (this.videoEl) {
          this.videoEl.srcObject = this.stream;
          await this.videoEl.play();
        }
        this.isActive = true;
        this.isMicMuted = true;
        this.bubbleEl.classList.remove('is-hidden');
        this.bubbleEl.style.display = 'block';
        this.updateToolbarButton(true);
        if (window.app) {
          window.app.showToast('Webcam active (Microphone not available)');
        }
        return true;
      } catch (videoErr) {
        console.error('Failed to access webcam:', videoErr);
        if (window.app) {
          window.app.showToast('Camera access denied or unavailable', true);
        }
        return false;
      }
    }
  }

  stopWebcam() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.videoEl) {
      this.videoEl.srcObject = null;
    }

    this.stopVoiceActivityDetection();
    this.isActive = false;

    if (this.bubbleEl) {
      this.bubbleEl.classList.add('is-hidden');
      setTimeout(() => {
        if (!this.isActive) this.bubbleEl.style.display = 'none';
      }, 200);
    }

    this.updateToolbarButton(false);
    if (window.app) {
      window.app.showToast('Webcam closed');
    }
  }

  toggleWebcam() {
    if (this.isActive) {
      this.stopWebcam();
    } else {
      this.startWebcam();
    }
  }

  toggleMic() {
    if (!this.stream) return;
    const audioTracks = this.stream.getAudioTracks();
    if (audioTracks.length === 0) {
      if (window.app) window.app.showToast('No microphone connected');
      return;
    }

    this.isMicMuted = !this.isMicMuted;
    audioTracks.forEach(track => {
      track.enabled = !this.isMicMuted;
    });

    const btnMic = this.bubbleEl.querySelector('#btn-webcam-mic');
    if (btnMic) {
      btnMic.classList.toggle('is-muted', this.isMicMuted);
      btnMic.title = this.isMicMuted ? 'Unmute Microphone' : 'Mute Microphone';
    }

    if (window.app) {
      window.app.showToast(this.isMicMuted ? 'Microphone muted' : 'Microphone unmuted');
    }
  }

  toggleFlip() {
    this.isMirrored = !this.isMirrored;
    this.bubbleEl.classList.toggle('unmirrored', !this.isMirrored);
    if (window.app) {
      window.app.showToast(this.isMirrored ? 'Camera mirrored' : 'Camera normal');
    }
  }

  cycleSize() {
    this.sizeIndex = (this.sizeIndex + 1) % this.sizes.length;
    this.updateSizeClass();
    localStorage.setItem('mrs_webcam_size', this.sizes[this.sizeIndex]);

    // Ensure within bounds after resize
    const rect = this.bubbleEl.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 10;
    const maxY = window.innerHeight - rect.height - 10;
    const clampedX = Math.max(10, Math.min(rect.left, maxX));
    const clampedY = Math.max(50, Math.min(rect.top, maxY));
    this.setPosition(clampedX, clampedY);
  }

  updateSizeClass() {
    this.sizes.forEach(s => this.bubbleEl.classList.remove(`size-${s}`));
    const current = this.sizes[this.sizeIndex];
    this.bubbleEl.classList.add(`size-${current}`);
  }

  startVoiceActivityDetection() {
    if (!this.stream || this.stream.getAudioTracks().length === 0) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const buffer = new Uint8Array(this.analyser.frequencyBinCount);
      const ringEl = this.bubbleEl.querySelector('.webcam-ring');

      this.voicePulseInterval = setInterval(() => {
        if (!this.isActive || this.isMicMuted) {
          if (ringEl) ringEl.classList.remove('is-speaking');
          return;
        }

        this.analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;

        if (ringEl) {
          if (avg > 24) {
            ringEl.classList.add('is-speaking');
          } else {
            ringEl.classList.remove('is-speaking');
          }
        }
      }, 100);
    } catch (e) {
      console.warn('Voice pulse detection not available:', e);
    }
  }

  stopVoiceActivityDetection() {
    if (this.voicePulseInterval) {
      clearInterval(this.voicePulseInterval);
      this.voicePulseInterval = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    const ringEl = this.bubbleEl ? this.bubbleEl.querySelector('.webcam-ring') : null;
    if (ringEl) ringEl.classList.remove('is-speaking');
  }

  getAudioTrack() {
    if (this.stream && !this.isMicMuted) {
      const tracks = this.stream.getAudioTracks();
      if (tracks.length > 0 && tracks[0].readyState === 'live') {
        return tracks[0];
      }
    }
    return null;
  }

  updateToolbarButton(active) {
    const btn = document.getElementById('btn-toggle-webcam');
    if (btn) {
      btn.classList.toggle('active', active);
      btn.setAttribute('data-tooltip-desc', active 
        ? 'Presenter Webcam is live. Click to turn off.' 
        : 'Display a floating circular webcam feed (Loom-style) with microphone audio.');
    }
  }
}

window.webcamManager = new WebcamBubbleManager();
