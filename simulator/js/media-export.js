/**
 * Mobile Responsive Simulator - Media Export & Recording
 * Handles Transparent PNG Mockup Screenshots and WebM Video Screen Recording
 */

class MediaExportManager {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordingStartTime = 0;
    this.recordingTimerInterval = null;
    this.isRecording = false;
  }

  /**
   * Export transparent PNG device mockup or clean viewport screenshot
   */
  async exportScreenshot(deviceContainerEl, isCleanMode = false, studioOptions = {}) {
    const deviceName = (deviceContainerEl.dataset.deviceName || 'device').toLowerCase().replace(/\s+/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const bgName = studioOptions.background && studioOptions.background !== 'transparent' ? `-${studioOptions.background}` : '';
    const filename = `${deviceName}-${isCleanMode ? 'clean' : 'mockup'}${bgName}-${timestamp}.png`;

    try {
      // 1. Try extension tab capture if available for high-res iframe content
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.captureVisibleTab) {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
          if (chrome.runtime.lastError || !dataUrl) {
            this.renderCanvasMockup(deviceContainerEl, isCleanMode, filename, studioOptions);
          } else {
            this.cropAndDownloadScreenshot(dataUrl, deviceContainerEl, isCleanMode, filename, studioOptions);
          }
        });
      } else {
        this.renderCanvasMockup(deviceContainerEl, isCleanMode, filename, studioOptions);
      }
    } catch (err) {
      console.warn('Fallback to canvas capture:', err);
      this.renderCanvasMockup(deviceContainerEl, isCleanMode, filename, studioOptions);
    }
  }

  /**
   * Crop visible tab capture to the exact device bounding box with studio background & shadow
   */
  cropAndDownloadScreenshot(dataUrl, deviceContainerEl, isCleanMode, filename, studioOptions = {}) {
    const img = new Image();
    img.onload = () => {
      let targetEl = deviceContainerEl;
      if (deviceContainerEl.classList.contains('showcase-stage')) {
        targetEl = deviceContainerEl;
      } else if (isCleanMode) {
        targetEl = deviceContainerEl.querySelector('.device-screen-wrapper') || deviceContainerEl;
      } else {
        targetEl = deviceContainerEl.querySelector('.device-mockup') || deviceContainerEl;
      }
      const rect = targetEl.getBoundingClientRect();

      const dpr = window.devicePixelRatio || 1;
      const bg = studioOptions.background || 'transparent';
      const shadow = studioOptions.shadow || 'subtle';

      const pad = (bg !== 'transparent' || shadow !== 'none') ? 60 * dpr : 0;
      const canvas = document.createElement('canvas');
      canvas.width = (rect.width * dpr) + (pad * 2);
      canvas.height = (rect.height * dpr) + (pad * 2);
      const ctx = canvas.getContext('2d');

      // 1. Draw Studio Background if selected
      if (bg === 'minimal') {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bg === 'titanium') {
        const rad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50 * dpr, canvas.width / 2, canvas.height / 2, canvas.width / 1.4);
        rad.addColorStop(0, '#334155');
        rad.addColorStop(1, '#0f172a');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bg === 'sunset') {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(0.5, '#ec4899');
        grad.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bg === 'cosmic') {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#4f46e5');
        grad.addColorStop(0.5, '#7c3aed');
        grad.addColorStop(1, '#db2777');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bg === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Apply Drop Shadow if requested
      if (shadow !== 'none' && pad > 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = shadow === 'dramatic' ? 60 * dpr : (shadow === 'deep' ? 35 * dpr : 20 * dpr);
        ctx.shadowOffsetY = shadow === 'dramatic' ? 30 * dpr : (shadow === 'deep' ? 18 * dpr : 10 * dpr);
      }

      ctx.drawImage(
        img,
        rect.left * dpr,
        rect.top * dpr,
        rect.width * dpr,
        rect.height * dpr,
        pad,
        pad,
        rect.width * dpr,
        rect.height * dpr
      );

      if (shadow !== 'none' && pad > 0) {
        ctx.restore();
      }

      canvas.toBlob((blob) => {
        this.downloadBlob(blob, filename);
      }, 'image/png');
    };
    img.src = dataUrl;
  }

  /**
   * Client-side canvas compositor for transparent device mockups
   */
  renderCanvasMockup(deviceContainerEl, isCleanMode, filename, studioOptions = {}) {
    const mockupEl = deviceContainerEl.querySelector('.device-mockup');
    const screenEl = deviceContainerEl.querySelector('.device-screen-wrapper');
    const targetEl = deviceContainerEl.classList.contains('showcase-stage') 
      ? deviceContainerEl 
      : (isCleanMode ? (screenEl || deviceContainerEl) : (mockupEl || deviceContainerEl));

    const rect = targetEl.getBoundingClientRect();
    const bg = studioOptions.background || 'transparent';
    const scale = 2; // 2x Retina quality
    const pad = bg !== 'transparent' ? 50 * scale : 0;

    const canvas = document.createElement('canvas');
    canvas.width = (rect.width * scale) + (pad * 2);
    canvas.height = (rect.height * scale) + (pad * 2);
    const ctx = canvas.getContext('2d');

    // Background
    if (bg === 'minimal') {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg === 'titanium') {
      const rad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50 * scale, canvas.width / 2, canvas.height / 2, canvas.width / 1.4);
      rad.addColorStop(0, '#334155');
      rad.addColorStop(1, '#0f172a');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg === 'sunset') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(0.5, '#ec4899');
      grad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg === 'cosmic') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#4f46e5');
      grad.addColorStop(0.5, '#7c3aed');
      grad.addColorStop(1, '#db2777');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (!isCleanMode) {
      // Draw stylized device chassis
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4 * scale;
      this.roundRect(ctx, 4 * scale, 4 * scale, canvas.width - 8 * scale, canvas.height - 8 * scale, 36 * scale);
      ctx.fill();
      ctx.stroke();
    }

    // Inner viewport representation
    ctx.fillStyle = '#ffffff';
    const screenRect = screenEl.getBoundingClientRect();
    const offsetX = (screenRect.left - rect.left) * scale;
    const offsetY = (screenRect.top - rect.top) * scale;
    const screenW = screenRect.width * scale;
    const screenH = screenRect.height * scale;

    this.roundRect(ctx, offsetX, offsetY, screenW, screenH, (isCleanMode ? 0 : 20 * scale));
    ctx.fill();

    // Add device metadata watermark at bottom
    ctx.fillStyle = isCleanMode ? '#64748b' : '#94a3b8';
    ctx.font = `${11 * scale}px -apple-system, sans-serif`;
    ctx.fillText(`Simulated on ${deviceContainerEl.dataset.deviceName || 'Device'} (${Math.round(screenRect.width)}×${Math.round(screenRect.height)})`, offsetX + 10, offsetY + screenH - 15);

    canvas.toBlob((blob) => {
      this.downloadBlob(blob, filename);
    }, 'image/png');
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Start video recording using DisplayMedia / Screen capture with synchronized microphone audio
   */
  async startRecording(onTick, onComplete, onError) {
    if (this.isRecording) return;
    this.recordedChunks = [];

    try {
      // 1. Capture screen video + optional tab audio
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: true
      });

      // 2. Capture microphone voice audio (from webcamManager or standalone mic)
      let micStream = null;
      let micTrack = null;

      if (window.webcamManager && window.webcamManager.getAudioTrack()) {
        micTrack = window.webcamManager.getAudioTrack();
      } else {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          if (micStream.getAudioTracks().length > 0) {
            micTrack = micStream.getAudioTracks()[0];
          }
        } catch (micErr) {
          console.warn('Microphone audio not enabled or denied:', micErr);
        }
      }

      // 3. Mix audio tracks (microphone voice + display system audio)
      let mixedAudioTracks = [];
      let recordingAudioCtx = null;

      const displayAudioTracks = displayStream.getAudioTracks();
      if (micTrack && displayAudioTracks.length > 0) {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          recordingAudioCtx = new AudioCtx();
          const dest = recordingAudioCtx.createMediaStreamDestination();

          const micSource = recordingAudioCtx.createMediaStreamSource(new MediaStream([micTrack]));
          micSource.connect(dest);

          const sysSource = recordingAudioCtx.createMediaStreamSource(new MediaStream(displayAudioTracks));
          sysSource.connect(dest);

          mixedAudioTracks = dest.stream.getAudioTracks();
        } catch (mixErr) {
          console.warn('Audio mix failed, falling back to mic audio track:', mixErr);
          mixedAudioTracks = [micTrack];
        }
      } else if (micTrack) {
        mixedAudioTracks = [micTrack];
      } else if (displayAudioTracks.length > 0) {
        mixedAudioTracks = displayAudioTracks;
      }

      // 4. Combined stream for MediaRecorder
      const recordStream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...mixedAudioTracks
      ]);

      const candidateMimes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp9',
        'video/webm'
      ];
      let selectedMime = 'video/webm';
      for (const m of candidateMimes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      this.mediaRecorder = new MediaRecorder(recordStream, { mimeType: selectedMime });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.stopTimer();
        this.isRecording = false;

        // Stop display tracks
        displayStream.getTracks().forEach(track => track.stop());

        // Stop temporary mic stream if created only for recording
        if (micStream) {
          micStream.getTracks().forEach(track => track.stop());
        }

        // Close mixer audio context if open
        if (recordingAudioCtx && recordingAudioCtx.state !== 'closed') {
          try { recordingAudioCtx.close(); } catch (e) {}
        }

        const blob = new Blob(this.recordedChunks, { type: selectedMime });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        this.downloadBlob(blob, `simulator-demo-${timestamp}.webm`);

        if (onComplete) onComplete();
      };

      // Handle user stopping share via browser native banner
      displayStream.getVideoTracks()[0].onended = () => {
        if (this.isRecording) {
          this.stopRecording();
        }
      };

      this.mediaRecorder.start(250);
      this.isRecording = true;
      this.recordingStartTime = Date.now();
      this.startTimer(onTick);

      return true;
    } catch (err) {
      console.error('Failed to start recording:', err);
      if (onError) onError(err);
      return false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  startTimer(onTick) {
    this.recordingTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
      const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      if (onTick) onTick(`${mins}:${secs}`);
    }, 1000);
  }

  stopTimer() {
    if (this.recordingTimerInterval) {
      clearInterval(this.recordingTimerInterval);
      this.recordingTimerInterval = null;
    }
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }
}

window.mediaExportManager = new MediaExportManager();
