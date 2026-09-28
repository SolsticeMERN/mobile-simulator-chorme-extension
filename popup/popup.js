/**
 * Mobile Responsive Simulator - Popup Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('target-url');
  const btnLaunch = document.getElementById('btn-launch');
  const deviceChips = document.querySelectorAll('.chip');
  const toggleMulti = document.getElementById('toggle-multi-mode');
  const quickLinks = document.querySelectorAll('.quick-link');

  let selectedDevice = 'iphone-16-pro';

  // 1. Get current active tab URL
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        const url = tabs[0].url;
        if (!url.startsWith('chrome://') && !url.startsWith('chrome-extension://') && !url.startsWith('edge://') && !url.startsWith('about:')) {
          urlInput.value = url;
        } else {
          urlInput.value = 'https://example.com';
        }
      }
    });
  } else {
    urlInput.value = 'https://example.com';
  }

  // 2. Chip device selection
  deviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      deviceChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedDevice = chip.dataset.device;
    });
  });

  // 3. Quick localhost links
  quickLinks.forEach(link => {
    link.addEventListener('click', () => {
      urlInput.value = link.dataset.url;
    });
  });

  // 4. Launch Simulator
  const launchSimulator = () => {
    let targetUrl = urlInput.value.trim() || 'https://example.com';
    const isMulti = toggleMulti.checked;

    const params = new URLSearchParams({
      url: targetUrl,
      device: selectedDevice,
      mode: isMulti ? 'multi' : 'single'
    });

    const simulatorUrl = chrome.runtime.getURL(`simulator/index.html?${params.toString()}`);
    chrome.tabs.create({ url: simulatorUrl });
    window.close();
  };

  btnLaunch.addEventListener('click', launchSimulator);
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') launchSimulator();
  });
});
